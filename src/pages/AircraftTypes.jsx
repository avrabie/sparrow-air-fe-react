import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getAllAircraftTypes } from '../api/services/aircraftTypeService';
import '../styles/AircraftTypes.css';

function AircraftTypes() {
  const [allAircraftTypes, setAllAircraftTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadingStatus, setImageLoadingStatus] = useState({});

  // Fetch all aircraft types on component mount
  useEffect(() => {
    fetchAircraftTypes();
  }, []);

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

  // Filter aircraft types based on search term
  const aircraftTypes = useMemo(() => {
    if (!searchTerm.trim()) {
      return allAircraftTypes;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allAircraftTypes.filter(aircraft => 
      (aircraft.name && aircraft.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (aircraft.manufacturer && aircraft.manufacturer.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (aircraft.icaoCode && aircraft.icaoCode.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (aircraft.engineType && aircraft.engineType.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [allAircraftTypes, searchTerm]);

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
        <form onSubmit={handleSearchSubmit} className="search-form" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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
        ) : aircraftTypes.length === 0 ? (
          <div className="no-results">
            <p>No aircraft found. Try a different search term.</p>
          </div>
        ) : (
          <div className="aircraft-types-grid">
            {aircraftTypes.map((aircraft) => (
              <Link
                to={`/aircraft/${aircraft.icaoCode}`}
                key={aircraft.icaoCode}
                className="aircraft-card"
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
                    <span>Engine: {aircraft.engineType}</span>
                    <span>Engine Count: {aircraft.engineCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AircraftTypes;
