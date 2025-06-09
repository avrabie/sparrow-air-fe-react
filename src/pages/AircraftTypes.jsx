import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faSearch, faSpinner, faSliders } from '@fortawesome/free-solid-svg-icons';
import { getAllAircraftTypes } from '../api/services/aircraftTypeService';
import '../styles/AircraftTypes.css';

function AircraftTypes() {
  const [allAircraftTypes, setAllAircraftTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [imageLoadingStatus, setImageLoadingStatus] = useState({});
  const [visibleCount, setVisibleCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [rangeFilter, setRangeFilter] = useState({ min: 0, max: 10000 });
  const [mtowFilter, setMtowFilter] = useState({ min: 0, max: 600000 });
  const [velocityFilter, setVelocityFilter] = useState({ min: 0, max: 1 });
  const observer = useRef();
  const lastAircraftElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  // Fetch all aircraft types on component mount
  useEffect(() => {
    fetchAircraftTypes();
  }, []);

  // Initialize filter ranges based on actual data
  useEffect(() => {
    if (allAircraftTypes.length > 0) {
      // Find min and max values for each filter
      let rangeMin = Infinity;
      let rangeMax = 0;
      let mtowMin = Infinity;
      let mtowMax = 0;
      let velocityMin = Infinity;
      let velocityMax = 0;

      allAircraftTypes.forEach(aircraft => {
        // Range filter
        if (aircraft.rangeNm !== undefined) {
          rangeMin = Math.min(rangeMin, aircraft.rangeNm);
          rangeMax = Math.max(rangeMax, aircraft.rangeNm);
        }

        // MTOW filter
        if (aircraft.maxTakeOffWeightKg !== undefined) {
          mtowMin = Math.min(mtowMin, aircraft.maxTakeOffWeightKg);
          mtowMax = Math.max(mtowMax, aircraft.maxTakeOffWeightKg);
        }

        // Velocity filter
        if (aircraft.cruiseMach !== undefined) {
          velocityMin = Math.min(velocityMin, aircraft.cruiseMach);
          velocityMax = Math.max(velocityMax, aircraft.cruiseMach);
        }
      });

      // Set filter ranges based on actual data
      if (rangeMin !== Infinity && rangeMax !== 0) {
        setRangeFilter({ min: Math.floor(rangeMin), max: Math.ceil(rangeMax) });
      }

      if (mtowMin !== Infinity && mtowMax !== 0) {
        setMtowFilter({ min: Math.floor(mtowMin), max: Math.ceil(mtowMax) });
      }

      if (velocityMin !== Infinity && velocityMax !== 0) {
        setVelocityFilter({ min: Math.floor(velocityMin * 100) / 100, max: Math.ceil(velocityMax * 100) / 100 });
      }
    }
  }, [allAircraftTypes]);

  // Load more aircraft when user scrolls to the bottom
  const loadMore = () => {
    setLoadingMore(true);
    // Simulate a delay to show loading indicator
    setTimeout(() => {
      setVisibleCount(prevCount => {
        const newCount = prevCount + 20;
        // Check if we've reached the end of the filtered aircraft list
        if (newCount >= filteredAircraftTypes.length) {
          setHasMore(false);
        }
        return newCount;
      });
      setLoadingMore(false);
    }, 500); // 500ms delay to show loading indicator
  };

  // Fetch all aircraft types from the backend
  const fetchAircraftTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAircraftTypes();
      setAllAircraftTypes(data);
    } catch (err) {
      setError('Failed to fetch aircraft. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter aircraft types based on search term and range filters
  const filteredAircraftTypes = useMemo(() => {
    // Start with all aircraft
    let filtered = allAircraftTypes;

    // Apply text search filter
    if (searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(aircraft => 
        (aircraft.name && aircraft.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (aircraft.manufacturer && aircraft.manufacturer.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (aircraft.icaoCode && aircraft.icaoCode.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (aircraft.engineType && aircraft.engineType.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Apply range filter
    filtered = filtered.filter(aircraft => {
      // Skip filtering if the property doesn't exist
      if (aircraft.rangeNm === undefined) return true;
      return aircraft.rangeNm >= rangeFilter.min && aircraft.rangeNm <= rangeFilter.max;
    });

    // Apply MTOW filter
    filtered = filtered.filter(aircraft => {
      // Skip filtering if the property doesn't exist
      if (aircraft.maxTakeOffWeightKg === undefined) return true;
      return aircraft.maxTakeOffWeightKg >= mtowFilter.min && aircraft.maxTakeOffWeightKg <= mtowFilter.max;
    });

    // Apply velocity filter
    filtered = filtered.filter(aircraft => {
      // Skip filtering if the property doesn't exist
      if (aircraft.cruiseMach === undefined) return true;
      return aircraft.cruiseMach >= velocityFilter.min && aircraft.cruiseMach <= velocityFilter.max;
    });

    return filtered;
  }, [allAircraftTypes, searchTerm, rangeFilter, mtowFilter, velocityFilter]);

  // Get visible aircraft types based on the current visibleCount
  const visibleAircraftTypes = useMemo(() => {
    return filteredAircraftTypes.slice(0, visibleCount);
  }, [filteredAircraftTypes, visibleCount]);

  // Reset visibleCount and hasMore when search term changes
  useEffect(() => {
    setVisibleCount(20);
    setHasMore(filteredAircraftTypes.length > 20);
  }, [filteredAircraftTypes.length]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // No need to fetch from backend, filtering is done on the frontend
  };

  // Handle image loading
  const handleImageLoad = (icaoCode) => {
    setImageLoadingStatus(prev => ({
      ...prev,
      [icaoCode]: true
    }));
  };

  // Handle image error
  const handleImageError = (icaoCode) => {
    setImageLoadingStatus(prev => ({
      ...prev,
      [icaoCode]: false
    }));
  };

  return (
    <div className="aircraft-types-container">
      <div className="page-header">
        <h1>
          {/*<FontAwesomeIcon icon={faPlane} style={{ marginRight: '0.5rem' }} />*/}
          Aircraft
        </h1>
        <p>Browse and search for different aircraft in our database</p>
      </div>

      <div className="search-section" style={{ padding: '2rem 0', backgroundColor: '#f0f7ff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}>
        <form onSubmit={handleSearchSubmit} className="search-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div className="search-input-container" style={{ position: 'relative', width: '100%', maxWidth: '800px', boxShadow: '0 6px 18px rgba(0, 86, 179, 0.2)', borderRadius: '12px' }}>
            <input
              type="text"
              placeholder="Search aircraft..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              style={{ width: '100%', padding: '1.2rem 1.5rem', paddingRight: '4rem', border: '3px solid #ccc', borderRadius: '12px', fontSize: '1.3rem' }}
            />
            <button type="submit" className="search-button" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '4rem', backgroundColor: '#0056b3', color: 'white', border: 'none', borderTopRightRadius: '12px', borderBottomRightRadius: '12px', cursor: 'pointer', fontSize: '1.3rem' }}>
              <FontAwesomeIcon icon={faSearch} />
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
            <div className="filter-section" style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '800px' }}>
              <h3 style={{ marginBottom: '1rem', color: '#0056b3', textAlign: 'center' }}>Filter by Aircraft Specifications</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Range Filter */}
                <div className="filter-item">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Range (NM): {rangeFilter.min} - {rangeFilter.max}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="10000" 
                      step="100"
                      value={rangeFilter.min}
                      onChange={(e) => setRangeFilter(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      style={{ flex: 1 }}
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="10000" 
                      step="100"
                      value={rangeFilter.max}
                      onChange={(e) => setRangeFilter(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Min:</label>
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        step="100"
                        value={rangeFilter.min}
                        onChange={(e) => setRangeFilter(prev => ({ 
                          ...prev, 
                          min: Math.min(parseInt(e.target.value) || 0, prev.max) 
                        }))}
                        style={{ width: '80px', padding: '0.3rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Max:</label>
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        step="100"
                        value={rangeFilter.max}
                        onChange={(e) => setRangeFilter(prev => ({ 
                          ...prev, 
                          max: Math.max(parseInt(e.target.value) || 0, prev.min) 
                        }))}
                        style={{ width: '80px', padding: '0.3rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* MTOW Filter */}
                <div className="filter-item">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Maximum Take-Off Weight (kg): {mtowFilter.min} - {mtowFilter.max}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="600000" 
                      step="10000"
                      value={mtowFilter.min}
                      onChange={(e) => setMtowFilter(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      style={{ flex: 1 }}
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="600000" 
                      step="10000"
                      value={mtowFilter.max}
                      onChange={(e) => setMtowFilter(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Min:</label>
                      <input
                        type="number"
                        min="0"
                        max="600000"
                        step="10000"
                        value={mtowFilter.min}
                        onChange={(e) => setMtowFilter(prev => ({ 
                          ...prev, 
                          min: Math.min(parseInt(e.target.value) || 0, prev.max) 
                        }))}
                        style={{ width: '80px', padding: '0.3rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Max:</label>
                      <input
                        type="number"
                        min="0"
                        max="600000"
                        step="10000"
                        value={mtowFilter.max}
                        onChange={(e) => setMtowFilter(prev => ({ 
                          ...prev, 
                          max: Math.max(parseInt(e.target.value) || 0, prev.min) 
                        }))}
                        style={{ width: '80px', padding: '0.3rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Velocity Filter */}
                <div className="filter-item">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Velocity (Mach): {velocityFilter.min.toFixed(2)} - {velocityFilter.max.toFixed(2)}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      value={velocityFilter.min}
                      onChange={(e) => setVelocityFilter(prev => ({ ...prev, min: parseFloat(e.target.value) }))}
                      style={{ flex: 1 }}
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      value={velocityFilter.max}
                      onChange={(e) => setVelocityFilter(prev => ({ ...prev, max: parseFloat(e.target.value) }))}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Min:</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={velocityFilter.min.toFixed(2)}
                        onChange={(e) => setVelocityFilter(prev => ({ 
                          ...prev, 
                          min: Math.min(parseFloat(e.target.value) || 0, prev.max) 
                        }))}
                        style={{ width: '80px', padding: '0.3rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Max:</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={velocityFilter.max.toFixed(2)}
                        onChange={(e) => setVelocityFilter(prev => ({ 
                          ...prev, 
                          max: Math.max(parseFloat(e.target.value) || 0, prev.min) 
                        }))}
                        style={{ width: '80px', padding: '0.3rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button 
                  onClick={() => {
                    setRangeFilter({ min: 0, max: 10000 });
                    setMtowFilter({ min: 0, max: 600000 });
                    setVelocityFilter({ min: 0, max: 1 });
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
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="aircraft-types-content">
        {loading ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p>Loading aircraft...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => fetchAircraftTypes()} className="retry-button">
              Try Again
            </button>
          </div>
        ) : filteredAircraftTypes.length === 0 ? (
          <div className="no-results">
            <p>No aircraft found. Try a different search term.</p>
          </div>
        ) : (
          <div>
            <div className="aircraft-types-grid">
              {visibleAircraftTypes.map((aircraft, index) => (
                <Link
                  to={`/aircraft/${aircraft.icaoCode}`}
                  key={aircraft.icaoCode}
                  className="aircraft-card"
                  ref={index === visibleAircraftTypes.length - 1 ? lastAircraftElementRef : null}
                >
                  <div className="aircraft-icon" style={{ height: '120px', position: 'relative', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                    {!imageLoadingStatus[aircraft.icaoCode] && (
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                        <FontAwesomeIcon icon={faPlane} size="2x" style={{ color: '#0056b3' }} />
                      </div>
                    )}
                    <img 
                      src={`https://skybrary.aero/sites/default/files/${aircraft.icaoCode}.jpg`} 
                      alt={`${aircraft.name} aircraft`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onLoad={() => handleImageLoad(aircraft.icaoCode)}
                      onError={() => handleImageError(aircraft.icaoCode)}
                    />
                  </div>
                  <div className="aircraft-info">
                    <h3>{aircraft.name}</h3>
                    <p className="manufacturer">{aircraft.manufacturer}</p>
                    <div className="aircraft-details">
                      <span>ICAO: {aircraft.icaoCode}</span>
                      {/*<span>Engine: {aircraft.engineType}</span>*/}
                      <span>Velocity: {aircraft.cruiseMach}</span>
                      <span>Range: {aircraft.rangeNm}</span>

                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {loadingMore && (
              <div className="loading-more-container" style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p style={{ marginLeft: '0.5rem' }}>Loading more aircraft...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AircraftTypes;
