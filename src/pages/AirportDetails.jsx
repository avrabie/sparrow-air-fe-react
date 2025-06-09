import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlaneArrival, 
  faArrowLeft, 
  faSpinner, 
  faLocationDot, 
  faGlobe, 
  faRulerVertical,
  faImage,
  faMapMarkerAlt,
  faCity,
  faFlag,
  faGlobeAmericas
} from '@fortawesome/free-solid-svg-icons';
import { getAirportByIcaoCode } from '../api/services/airportService';
import '../styles/AirportDetails.css';

function AirportDetails() {
  const { icaoCode } = useParams();
  const [airport, setAirport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchAirport = async () => {
      try {
        setLoading(true);
        setError(null);
        setImageError(false); // Reset image error state when fetching new airport data
        setImageLoaded(false); // Reset image loaded state when fetching new airport data
        const data = await getAirportByIcaoCode(icaoCode);
        setAirport(data);
      } catch (err) {
        setError('Failed to fetch airport details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAirport();
  }, [icaoCode]);

  if (loading) {
    return (
      <div className="airport-detail-container">
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading airport details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="airport-detail-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <Link to="/airports" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} />
            Back to Airports
          </Link>
        </div>
      </div>
    );
  }

  if (!airport) {
    return (
      <div className="airport-detail-container">
        <div className="not-found-container">
          <h2>Airport Not Found</h2>
          <p>The airport with ICAO code {icaoCode} could not be found.</p>
          <Link to="/airports" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} />
            Back to Airports
          </Link>
        </div>
      </div>
    );
  }

  // Function to get a Google Maps URL for the airport location
  const getGoogleMapsUrl = () => {
    if (airport.latitude && airport.longitude) {
      return `https://www.google.com/maps?q=${airport.latitude},${airport.longitude}`;
    }
    return null;
  };

  return (
    <div className="airport-detail-container">
      <div className="detail-header">
        <Link to="/airports" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} />
          Back to Airports
        </Link>
        <h1>
          <FontAwesomeIcon icon={faPlaneArrival} style={{ marginRight: '0.5rem' }} />
          {airport.name}
        </h1>
      </div>

      <div className="airport-detail-card">
        <div className="airport-image">
          {!imageError ? (
            <div style={{ position: 'relative', width: '100%', height: '0', paddingBottom: '56.25%', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
              {!imageLoaded && (
                <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', zIndex: 1 }}>
                  <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: '#0056b3' }} />
                </div>
              )}
              <img 
                src={`https://aviationstack.com/airports/${airport.icaoCode.toLowerCase()}.jpg`} 
                alt={`${airport.name} airport`} 
                style={{ 
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#f8f9fa'
                }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', marginBottom: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <FontAwesomeIcon icon={faImage} size="4x" style={{ color: '#6c757d', marginBottom: '1rem' }} />
              <p>Image not available for {airport.name} ({airport.icaoCode})</p>
            </div>
          )}
        </div>

        <div className="airport-detail-info">
          <div className="detail-section">
            <h2>Basic Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <FontAwesomeIcon icon={faPlaneArrival} className="detail-icon" />
                <div className="detail-text">
                  <h3>ICAO Code</h3>
                  <p>{airport.icaoCode}</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faPlaneArrival} className="detail-icon" />
                <div className="detail-text">
                  <h3>IATA Code</h3>
                  <p>{airport.iataCode || 'N/A'}</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faCity} className="detail-icon" />
                <div className="detail-text">
                  <h3>City</h3>
                  <p>{airport.city || 'N/A'}</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faFlag} className="detail-icon" />
                <div className="detail-text">
                  <h3>Country</h3>
                  <p>{airport.country || 'N/A'}</p>
                </div>
              </div>

              {airport.icaoRegion && (
                <div className="detail-item">
                  <FontAwesomeIcon icon={faGlobeAmericas} className="detail-icon" />
                  <div className="detail-text">
                    <h3>ICAO Region</h3>
                    <p>{airport.icaoRegion}</p>
                  </div>
                </div>
              )}

              {airport.icaoTerritory && (
                <div className="detail-item">
                  <FontAwesomeIcon icon={faGlobe} className="detail-icon" />
                  <div className="detail-text">
                    <h3>ICAO Territory</h3>
                    <p>{airport.icaoTerritory}</p>
                  </div>
                </div>
              )}

              {airport.location && (
                <div className="detail-item">
                  <FontAwesomeIcon icon={faLocationDot} className="detail-icon" />
                  <div className="detail-text">
                    <h3>Location</h3>
                    <p>{airport.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h2>Geographic Information</h2>
            <div className="detail-grid">
              {airport.latitude && airport.longitude && (
                <div className="detail-item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
                  <div className="detail-text">
                    <h3>Coordinates</h3>
                    <p>Latitude: {airport.latitude}°</p>
                    <p>Longitude: {airport.longitude}°</p>
                    {getGoogleMapsUrl() && (
                      <a 
                        href={getGoogleMapsUrl()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="map-link"
                      >
                        View on Google Maps
                      </a>
                    )}
                  </div>
                </div>
              )}

              {airport.elevation && (
                <div className="detail-item">
                  <FontAwesomeIcon icon={faRulerVertical} className="detail-icon" />
                  <div className="detail-text">
                    <h3>Elevation</h3>
                    <p>{airport.elevation} ft</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(airport.airportBS || airport.airportLOS || airport.airportRE) && (
            <div className="detail-section">
              <h2>Airport Classification</h2>
              <div className="detail-grid">
                {airport.airportBS && (
                  <div className="detail-item">
                    <div className="detail-text">
                      <h3>Airport BS</h3>
                      <p>{airport.airportBS}</p>
                    </div>
                  </div>
                )}

                {airport.airportLOS && (
                  <div className="detail-item">
                    <div className="detail-text">
                      <h3>Airport LOS</h3>
                      <p>{airport.airportLOS}</p>
                    </div>
                  </div>
                )}

                {airport.airportRE && (
                  <div className="detail-item">
                    <div className="detail-text">
                      <h3>Airport RE</h3>
                      <p>{airport.airportRE}</p>
                    </div>
                  </div>
                )}

                {airport.kccode && (
                  <div className="detail-item">
                    <div className="detail-text">
                      <h3>KC Code</h3>
                      <p>{airport.kccode}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AirportDetails;
