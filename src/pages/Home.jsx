import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faPlaneArrival, 
  faUserGroup, 
  faUsersCog, 
  faToolbox, 
  faClock, 
  faPlaneUp, 
  faHeadset 
} from '@fortawesome/free-solid-svg-icons';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Airline Management System</h1>
        <p>Your comprehensive solution for efficient airline operations</p>
        <button className="cta-button">
          Get Started
            <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>

      <div className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <FontAwesomeIcon icon={faPlaneArrival} size="2x" style={{ color: '#0056b3', marginBottom: '1rem' }} />
            <h3>Flight Management</h3>
            <p>Schedule and track flights with real-time updates</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faUserGroup} size="2x" style={{ color: '#0056b3', marginBottom: '1rem' }} />
            <h3>Passenger Services</h3>
            <p>Streamline check-in and boarding processes</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faUsersCog} size="2x" style={{ color: '#0056b3', marginBottom: '1rem' }} />
            <h3>Crew Management</h3>
            <p>Optimize crew scheduling and assignments</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faToolbox} size="2x" style={{ color: '#0056b3', marginBottom: '1rem' }} />
            <h3>Maintenance Tracking</h3>
            <p>Monitor aircraft maintenance schedules</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2>Why Choose Us</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <FontAwesomeIcon icon={faClock} size="2x" style={{ color: '#0056b3', marginBottom: '1rem' }} />
            <h3>99.8%</h3>
            <p>On-time Performance</p>
          </div>
          <div className="stat-item">
            <FontAwesomeIcon icon={faPlaneUp} size="2x" style={{ color: '#0056b3', marginBottom: '1rem' }} />
            <h3>500+</h3>
            <p>Airlines Served</p>
          </div>
          <div className="stat-item">
            <FontAwesomeIcon icon={faHeadset} size="2x" style={{ color: '#0056b3', marginBottom: '1rem' }} />
            <h3>24/7</h3>
            <p>Customer Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
