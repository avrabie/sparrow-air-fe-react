import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faPlaneArrival, 
  faUserGroup, 
  faUsersCog, 
  faToolbox, 
  faClock, 
  faPlaneUp, 
  faHeadset,
  faChartLine,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Airline Management System</h1>
        <p>Your comprehensive solution for efficient airline operations and passenger management</p>
        <button className="cta-button">
          Get Started
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <div className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <FontAwesomeIcon icon={faPlaneArrival} size="2x" />
            <h3>Flight Management</h3>
            <p>Schedule and track flights with real-time updates and notifications</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faUserGroup} size="2x" />
            <h3>Passenger Services</h3>
            <p>Streamline check-in, boarding, and in-flight service processes</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faUsersCog} size="2x" />
            <h3>Crew Management</h3>
            <p>Optimize crew scheduling, assignments, and certification tracking</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faToolbox} size="2x" />
            <h3>Maintenance Tracking</h3>
            <p>Monitor aircraft maintenance schedules and compliance</p>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <FontAwesomeIcon icon={faGlobe} size="2x" />
            <h3>Global Coverage</h3>
            <p>Access to worldwide airport and route information</p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon icon={faChartLine} size="2x" />
            <h3>Analytics</h3>
            <p>Comprehensive reporting and business intelligence tools</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2>Why Choose Us</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <FontAwesomeIcon icon={faClock} size="2x" />
            <h3>99.8%</h3>
            <p>On-time Performance</p>
          </div>
          <div className="stat-item">
            <FontAwesomeIcon icon={faPlaneUp} size="2x" />
            <h3>500+</h3>
            <p>Airlines Served</p>
          </div>
          <div className="stat-item">
            <FontAwesomeIcon icon={faHeadset} size="2x" />
            <h3>24/7</h3>
            <p>Customer Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
