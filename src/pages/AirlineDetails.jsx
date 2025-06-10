import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlane, 
  faArrowLeft, 
  faSpinner, 
  faPhone,
  faEnvelope,
  faLink,
  faFlag,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { getAirlineByIcaoCode } from '../api/services/airlineService';
import '../styles/Contact.css';

function AirlineDetails() {
  const { icaoCode } = useParams();
  const [airline, setAirline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchAirline = async () => {
      try {
        setLoading(true);
        setError(null);
        setImageError(false);
        setImageLoaded(false);
        const data = await getAirlineByIcaoCode(icaoCode);
        setAirline(data);
      } catch (err) {
        setError('Failed to fetch airline details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAirline();
  }, [icaoCode]);

  if (loading) {
    return (
      <div className="contact-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }} />
          <p>Loading airline details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contact-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="form-feedback error" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>{error}</span>
          </div>
          <div>
            <Link to="/airlines" className="submit-button" style={{ display: 'inline-flex', marginTop: '1rem' }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} />
              Back to Airlines
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!airline) {
    return (
      <div className="contact-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ color: 'var(--error-light-text)', marginBottom: '1rem' }}>Airline Not Found</h2>
          <p>The airline with ICAO code {icaoCode} could not be found.</p>
          <div>
            <Link to="/airlines" className="submit-button" style={{ display: 'inline-flex', marginTop: '1rem' }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} />
              Back to Airlines
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Function to get a logo URL for the airline
  const getAirlineLogo = () => {
    return `https://content.airhex.com/content/logos/airlines_${airline.icaoCode}_200_200_s.png`;
  };

  return (
    <div className="contact-container">
      <h1>
        <FontAwesomeIcon icon={faPlane} style={{ marginRight: '0.5rem' }} />
        {airline.name}
      </h1>
      <p>
        <Link to="/airlines" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} />
          Back to Airlines
        </Link>
      </p>

      <div className="contact-content">
        <div className="contact-form-container">
          <div className="airline-logo-container" style={{ textAlign: 'center', padding: '1rem' }}>
            {!imageError ? (
              <img
                src={getAirlineLogo()}
                alt={`${airline.name} logo`}
                onError={() => setImageError(true)}
                onLoad={() => setImageLoaded(true)}
                style={{ 
                  display: imageLoaded ? 'block' : 'none',
                  maxWidth: '100%',
                  maxHeight: '200px',
                  margin: '0 auto'
                }}
              />
            ) : (
              <div className="image-placeholder" style={{ padding: '2rem' }}>
                <FontAwesomeIcon icon={faPlane} size="3x" />
                <p>No logo available</p>
              </div>
            )}
            {!imageLoaded && !imageError && (
              <div className="image-loading" style={{ padding: '2rem' }}>
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                <p>Loading logo...</p>
              </div>
            )}
          </div>

          <div className="contact-info-card" style={{ marginTop: '1rem' }}>
            <h2>
              <FontAwesomeIcon icon={faInfoCircle} />
              Airline Information
            </h2>

            <div className="contact-item">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span><strong>ICAO Code:</strong> {airline.icaoCode || 'N/A'}</span>
            </div>

            <div className="contact-item">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span><strong>IATA Code:</strong> {airline.iata || 'N/A'}</span>
            </div>

            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <span><strong>Callsign:</strong> {airline.callsign || 'N/A'}</span>
            </div>

            <div className="contact-item">
              <FontAwesomeIcon icon={faFlag} />
              <span><strong>Country:</strong> {airline.country || 'N/A'}</span>
            </div>

            <div className="contact-item">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span><strong>Status:</strong> {airline.active === 'Y' ? 'Active' : airline.active === 'N' ? 'Inactive' : 'Unknown'}</span>
            </div>
          </div>
        </div>

        <div className="contact-info-container">
          {(airline.website || airline.email || airline.phone) && (
            <div className="contact-info-card">
              <h2>
                <FontAwesomeIcon icon={faEnvelope} />
                Contact Information
              </h2>

              {airline.website && (
                <div className="contact-item">
                  <FontAwesomeIcon icon={faLink} />
                  <span>
                    <a href={airline.website.startsWith('http') ? airline.website : `https://${airline.website}`} target="_blank" rel="noopener noreferrer">
                      {airline.website}
                    </a>
                  </span>
                </div>
              )}

              {airline.email && (
                <div className="contact-item">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>
                    <a href={`mailto:${airline.email}`}>{airline.email}</a>
                  </span>
                </div>
              )}

              {airline.phone && (
                <div className="contact-item">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>{airline.phone}</span>
                </div>
              )}
            </div>
          )}

          <div className="contact-info-card">
            <h2>
              <FontAwesomeIcon icon={faPlane} />
              Fleet Information
            </h2>
            <div className="contact-item">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>Fleet information would be displayed here in a real application.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirlineDetails;
