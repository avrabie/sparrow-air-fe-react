import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlane, 
  faArrowLeft, 
  faSpinner, 
  faIndustry, 
  faUsers, 
  faRulerHorizontal, 
  faWeightHanging,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import { getAircraftTypeByIcaoCode } from '../api/services/aircraftTypeService';

function AircraftTypeDetail() {
  const { icaoCode } = useParams();
  const [aircraftType, setAircraftType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchAircraftType = async () => {
      try {
        setLoading(true);
        setError(null);
        setImageError(false); // Reset image error state when fetching new aircraft data
        setImageLoaded(false); // Reset image loaded state when fetching new aircraft data
        const data = await getAircraftTypeByIcaoCode(icaoCode);
        setAircraftType(data);
      } catch (err) {
        setError('Failed to fetch aircraft type details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAircraftType();
  }, [icaoCode]);

  if (loading) {
    return (
      <div className="aircraft-detail-container">
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading aircraft type details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aircraft-detail-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <Link to="/aircraft-types" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} />
            Back to Aircraft Types
          </Link>
        </div>
      </div>
    );
  }

  if (!aircraftType) {
    return (
      <div className="aircraft-detail-container">
        <div className="not-found-container">
          <h2>Aircraft Type Not Found</h2>
          <p>The aircraft type with ICAO code {icaoCode} could not be found.</p>
          <Link to="/aircraft-types" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} />
            Back to Aircraft Types
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="aircraft-detail-container">
      <div className="detail-header">
        <Link to="/aircraft-types" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} />
          Back to Aircraft Types
        </Link>
        <h1>
          <FontAwesomeIcon icon={faPlane} style={{ marginRight: '0.5rem' }} />
          {aircraftType.modelName}
        </h1>
      </div>

      <div className="aircraft-detail-card">


        <div className="aircraft-image">
          {!imageError ? (
            <div style={{ position: 'relative', width: '100%', height: '0', paddingBottom: '56.25%', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
              {!imageLoaded && (
                <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', zIndex: 1 }}>
                  <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: '#0056b3' }} />
                </div>
              )}
              <img 
                src={`https://skybrary.aero/sites/default/files/${aircraftType.icaoCode}.jpg`} 
                alt={`${aircraftType.modelName} aircraft`} 
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
              <p>Image not available for {aircraftType.modelName} ({aircraftType.icaoCode})</p>
            </div>
          )}
        </div>

        <div className="aircraft-detail-info">
          <div className="detail-section">
            <h2>Basic Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-text">
                  <h3><FontAwesomeIcon icon={faPlane} className="detail-icon" /> ICAO Code</h3>
                  <p>{aircraftType.icaoCode}</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faIndustry} className="detail-icon" />
                <div className="detail-text">
                  <h3>Manufacturer</h3>
                  <p>{aircraftType.manufacturer}</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faUsers} className="detail-icon" />
                <div className="detail-text">
                  <h3>Seating Capacity</h3>
                  <p>{aircraftType.seatingCapacity} passengers</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faRulerHorizontal} className="detail-icon" />
                <div className="detail-text">
                  <h3>Maximum Range</h3>
                  <p>{aircraftType.maxRangeKm} km</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faWeightHanging} className="detail-icon" />
                <div className="detail-text">
                  <h3>Maximum Take-Off Weight</h3>
                  <p>{aircraftType.mtow} kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AircraftTypeDetail;
