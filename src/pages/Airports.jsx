import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneArrival, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getAirports } from '../api/services/airportService';
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
  }, []);

  // Fetch airports when search term changes (with debounce)
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if the term is empty
    if (!searchTerm.trim()) {
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
  }, [searchTerm]);

  // Fetch airports from the backend
  const fetchAirports = async (page = 0, size = 100, search = '') => {
    try {
      if (!searching) {
        setLoading(true);
      }
      setError(null);

      const data = await getAirports(page, size, search);

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

  return (
    <div className="aircraft-types-container">
      <h1 className="page-title">
        <FontAwesomeIcon icon={faPlaneArrival} className="title-icon" />
        Airports {totalElements > 0 && <span className="total-count">({totalElements} total)</span>}
      </h1>

      <div className="search-container">
        <div className="search-input-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search airports by name, code, city, or country..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
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
