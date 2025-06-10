import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faSearch, faSpinner, faSliders, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { getAirlines, getCountries, getAirlinesByCountry, getAirlinesByActiveStatus } from '../api/services/airlineService';
import '../styles/Airports.css'; // Reusing the Airports CSS for now

function Airlines() {
  const [airlines, setAirlines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [visibleCount, setVisibleCount] = useState(20);
  const searchTimeoutRef = useRef(null);

  // Filter state
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [activeFilter, setActiveFilter] = useState(''); // '' for all, 'Y' for active, 'N' for inactive

  const observer = useRef();
  const lastAirlineElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  // Fetch airlines on component mount
  useEffect(() => {
    fetchAirlines();
    fetchCountries();
  }, []);

  // Fetch countries for the filter
  const fetchCountries = async () => {
    try {
      setLoadingCountries(true);
      const countriesList = await getCountries();
      setCountries(countriesList);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fetch airlines when search term, selected country, or active filter changes (with debounce)
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If search term is empty and no filters are selected, fetch all airlines
    if (!searchTerm.trim() && !selectedCountry && !activeFilter) {
      if (airlines.length === 0) {
        fetchAirlines();
      }
      return;
    }

    // Set a new timeout to search after 500ms
    setSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      fetchAirlines(0, 100, searchTerm);
    }, 500);

    // Cleanup function to clear the timeout if the component unmounts or search/filter changes again
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, selectedCountry, activeFilter]);

  // Fetch airlines from the backend
  const fetchAirlines = async (page = 0, size = 100, search = '') => {
    try {
      if (!searching) {
        setLoading(true);
      }
      setError(null);

      let data;

      // Apply filters based on what's selected
      if (selectedCountry) {
        // If a country is selected, use the country-specific endpoint
        data = await getAirlinesByCountry(selectedCountry, page, size);
      } else if (activeFilter) {
        // If active filter is selected, use the active-specific endpoint
        data = await getAirlinesByActiveStatus(activeFilter, page, size);
      } else {
        // Otherwise use the main endpoint with search if provided
        data = await getAirlines(page, size, search);
      }

      // Assuming the API returns a paginated response with content, totalElements, etc.
      if (data.content) {
        setAirlines(data.content);
        setTotalElements(data.totalElements || 0);
        setHasMore(data.content.length < (data.totalElements || 0));
      } else {
        // Fallback if the API doesn't return a paginated response
        setAirlines(data);
        setHasMore(data.length >= 20); // Assume there might be more if we got at least a full page
      }
    } catch (err) {
      setError('Failed to fetch airlines. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
      setSearching(false);
      setLoadingMore(false);
    }
  };

  // Load more airlines when user scrolls to the bottom
  const loadMore = () => {
    setLoadingMore(true);
    // Simulate a delay to show loading indicator
    setTimeout(() => {
      setVisibleCount(prevCount => {
        const newCount = prevCount + 20;
        // Check if we've reached the end of the filtered airlines list
        if (newCount >= filteredAirlines.length) {
          setHasMore(false);
        }
        return newCount;
      });
      setLoadingMore(false);
    }, 500); // 500ms delay to show loading indicator
  };

  // Use the airlines directly since filtering is now done on the backend
  const filteredAirlines = useMemo(() => {
    return airlines;
  }, [airlines]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle country selection change
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    // Reset search term and active filter when changing country
    setSearchTerm('');
    setActiveFilter('');
    // Fetch airlines for the selected country
    fetchAirlines(0, 100, '');
  };

  // Handle active filter change
  const handleActiveFilterChange = (e) => {
    setActiveFilter(e.target.value);
    // Reset search term and country filter when changing active filter
    setSearchTerm('');
    setSelectedCountry('');
    // Fetch airlines for the selected active status
    fetchAirlines(0, 100, '');
  };

  return (
    <div className="aircraft-types-container">
      <h1 className="page-title">
        <FontAwesomeIcon icon={faPlane} className="title-icon" />
        Airlines {totalElements > 0 && <span className="total-count">({totalElements} total)</span>}
      </h1>

      <div className="search-container">
        <div className="search-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div className="search-input-container" style={{ display: 'flex', width: '100%', maxWidth: '800px' }}>
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search airlines by name, code, callsign, or country..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              style={{ flexGrow: 1 }}
            />
            <button 
              onClick={() => fetchAirlines(0, 100, searchTerm)}
              className="search-button"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.5rem 1rem', 
                backgroundColor: '#0056b3', 
                color: 'white', 
                border: '1px solid #0056b3', 
                borderRadius: '0 4px 4px 0', 
                cursor: 'pointer',
                marginLeft: '-1px'
              }}
            >
              <FontAwesomeIcon icon={faSearch} style={{ marginRight: '0.5rem' }} />
              Search
            </button>
          </div>

          <div style={{ marginTop: '1rem', width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className="filter-toggle-button"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.5rem 1rem', 
                backgroundColor: showFilters ? '#0056b3' : '#f8f9fa', 
                color: showFilters ? 'white' : '#0056b3', 
                border: '1px solid #0056b3', 
                borderRadius: '4px', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <FontAwesomeIcon icon={faSliders} style={{ marginRight: '0.5rem' }} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="filter-section" style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '800px' }}>
              <h3 style={{ marginBottom: '1rem', color: '#0056b3', textAlign: 'center' }}>Filter Airlines</h3>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {/* Country Filter */}
                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    <FontAwesomeIcon icon={faGlobe} style={{ marginRight: '0.5rem' }} />
                    Filter by Country:
                  </label>
                  <select 
                    value={selectedCountry} 
                    onChange={handleCountryChange}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      borderRadius: '4px', 
                      border: '1px solid #ccc',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.name}>{country.name}</option>
                    ))}
                  </select>

                  {loadingCountries && (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', color: '#666' }}>
                      <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '0.5rem' }} />
                      Loading countries...
                    </div>
                  )}
                </div>

                {/* Active Status Filter */}
                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    <FontAwesomeIcon icon={faPlane} style={{ marginRight: '0.5rem' }} />
                    Filter by Status:
                  </label>
                  <select 
                    value={activeFilter} 
                    onChange={handleActiveFilterChange}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      borderRadius: '4px', 
                      border: '1px solid #ccc',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">All Airlines</option>
                    <option value="Y">Active Airlines</option>
                    <option value="N">Inactive Airlines</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                {(selectedCountry || activeFilter) && (
                  <button 
                    onClick={() => {
                      setSelectedCountry('');
                      setActiveFilter('');
                      fetchAirlines(0, 100, searchTerm);
                    }}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      backgroundColor: '#f8f9fa', 
                      color: '#0056b3', 
                      border: '1px solid #0056b3', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading || searching ? (
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <p>{searching ? 'Searching airlines...' : 'Loading airlines...'}</p>
        </div>
      ) : (
        <>
          {filteredAirlines.length === 0 ? (
            <div className="no-results">
              <p>No airlines found matching your search criteria.</p>
            </div>
          ) : (
            <>
              <div className="aircraft-grid">
                {filteredAirlines.slice(0, visibleCount).map((airline, index) => {
                  const isLastElement = index === visibleCount - 1;
                  return (
                    <div 
                      key={airline.icaoCode || airline.airlineId} 
                      className="aircraft-card"
                      ref={isLastElement ? lastAirlineElementRef : null}
                    >
                      <div className="aircraft-card-content">
                        <h3 className="aircraft-name">
                          {airline.name || 'Unknown Airline'}
                        </h3>
                        <div className="aircraft-details">
                          <p>
                            <strong>ICAO:</strong> {airline.icaoCode || 'N/A'}
                          </p>
                          <p>
                            <strong>IATA:</strong> {airline.iata || 'N/A'}
                          </p>
                          <p>
                            <strong>Callsign:</strong> {airline.callsign || 'N/A'}
                          </p>
                          <p>
                            <strong>Country:</strong> {airline.country || 'N/A'}
                          </p>
                          <p>
                            <strong>Status:</strong> {airline.active === 'Y' ? 'Active' : airline.active === 'N' ? 'Inactive' : 'Unknown'}
                          </p>
                        </div>
                        {airline.icaoCode && (
                          <Link
                            to={`/airlines/${airline.icaoCode}`}
                            className="view-details-button"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {loadingMore && (
                <div className="loading-more">
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Loading more airlines...</span>
                </div>
              )}

              {!hasMore && filteredAirlines.length > 0 && (
                <p className="end-message">
                  You've reached the end of the list.
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Airlines;
