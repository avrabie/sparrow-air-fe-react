import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneArrival, faSearch, faSpinner, faSliders, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { getAirports, getCountries, getAirportsByCountry } from '../api/services/airportService';
import '../styles/Airports.css'; // Using a dedicated CSS file for Airports

function Airports() {
  const [airports, setAirports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [visibleCount, setVisibleCount] = useState(20);
  const searchTimeoutRef = useRef(null);

  // Country filter state
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const observer = useRef();
  const lastAirportElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  // Fetch airports on component mount
  useEffect(() => {
    fetchAirports();
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

  // Fetch airports when search term or selected country changes (with debounce)
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If a country is selected, we'll use that for filtering
    // If search term is empty and no country is selected, fetch all airports
    if (!searchTerm.trim() && !selectedCountry) {
      if (airports.length === 0) {
        fetchAirports();
      }
      return;
    }

    // Set a new timeout to search after 500ms
    setSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      fetchAirports(0, 100, searchTerm);
    }, 500);

    // Cleanup function to clear the timeout if the component unmounts or searchTerm changes again
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, selectedCountry]);

  // Fetch airports from the backend
  const fetchAirports = async (page = 0, size = 100, search = '') => {
    try {
      if (!searching) {
        setLoading(true);
      }
      setError(null);

      let data;

      // If a country is selected, use the country-specific endpoint
      if (selectedCountry) {
        data = await getAirportsByCountry(selectedCountry, page, size);
      } else {
        data = await getAirports(page, size, search);
      }

      // Assuming the API returns a paginated response with content, totalElements, etc.
      if (data.content) {
        setAirports(data.content);
        setTotalElements(data.totalElements || 0);
        setHasMore(data.content.length < (data.totalElements || 0));
      } else {
        // Fallback if the API doesn't return a paginated response
        setAirports(data);
        setHasMore(data.length >= 20); // Assume there might be more if we got at least a full page
      }
    } catch (err) {
      setError('Failed to fetch airports. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
      setSearching(false);
      setLoadingMore(false);
    }
  };

  // Load more airports when user scrolls to the bottom
  const loadMore = () => {
    setLoadingMore(true);
    // Simulate a delay to show loading indicator
    setTimeout(() => {
      setVisibleCount(prevCount => {
        const newCount = prevCount + 20;
        // Check if we've reached the end of the filtered airports list
        if (newCount >= filteredAirports.length) {
          setHasMore(false);
        }
        return newCount;
      });
      setLoadingMore(false);
    }, 500); // 500ms delay to show loading indicator
  };

  // Use the airports directly since filtering is now done on the backend
  const filteredAirports = useMemo(() => {
    return airports;
  }, [airports]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle country selection change
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    // Reset search term when changing country
    setSearchTerm('');
    // Fetch airports for the selected country
    fetchAirports(0, 100, '');
  };

  return (
    <div className="aircraft-types-container">
      <h1 className="page-title">
        <FontAwesomeIcon icon={faPlaneArrival} className="title-icon" />
        Airports {totalElements > 0 && <span className="total-count">({totalElements} total)</span>}
      </h1>

      <div className="search-container">
        <div className="search-input-container" style={{ display: 'flex' }}>
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search airports by name, code, city, or country..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            style={{ flexGrow: 1 }}
          />
          <button 
            onClick={() => fetchAirports(0, 100, searchTerm)}
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

        <div style={{ marginTop: '1rem' }}>
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
          <div className="filter-section" style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '1rem', color: '#0056b3', textAlign: 'center' }}>Filter Airports</h3>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
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

              {selectedCountry && (
                <button 
                  onClick={() => {
                    setSelectedCountry('');
                    fetchAirports(0, 100, searchTerm);
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
                  Clear Country Filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading || searching ? (
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <p>{searching ? 'Searching airports...' : 'Loading airports...'}</p>
        </div>
      ) : (
        <>
          {filteredAirports.length === 0 ? (
            <div className="no-results">
              <p>No airports found matching your search criteria.</p>
            </div>
          ) : (
            <>
              <div className="aircraft-grid">
                {filteredAirports.slice(0, visibleCount).map((airport, index) => {
                  const isLastElement = index === visibleCount - 1;
                  return (
                    <div 
                      key={airport.icaoCode} 
                      className="aircraft-card"
                      ref={isLastElement ? lastAirportElementRef : null}
                    >
                      <div className="aircraft-card-content">
                        <h3 className="aircraft-name">
                          {airport.name || 'Unknown Airport'}
                        </h3>
                        <div className="aircraft-details">
                          <p>
                            <strong>ICAO:</strong> {airport.icaoCode || 'N/A'}
                          </p>
                          <p>
                            <strong>IATA:</strong> {airport.iataCode || 'N/A'}
                          </p>
                          <p>
                            <strong>City:</strong> {airport.city || 'N/A'}
                          </p>
                          <p>
                            <strong>Country:</strong> {airport.country || 'N/A'}
                          </p>
                        </div>
                        <Link
                          to={`/airports/${airport.icaoCode}`}
                          className="view-details-button"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {loadingMore && (
                <div className="loading-more">
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Loading more airports...</span>
                </div>
              )}

              {!hasMore && filteredAirports.length > 0 && (
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

export default Airports;
