import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faCalendarCheck, 
  faTicket, 
  faUsersCog, 
  faToolbox, 
  faClockRotateLeft 
} from '@fortawesome/free-solid-svg-icons';

function About() {
  return (
    <div className="about-container">
      <FontAwesomeIcon icon={faInfoCircle} size="3x" style={{ color: '#0056b3', marginBottom: '1.5rem' }} />
      <h1>About Our Airline Management System</h1>
      <p>
        Welcome to our Airline Management System. We provide comprehensive solutions for managing airline operations, 
        including flight scheduling, passenger management, and crew assignments.
      </p>
      <p>
        Our system is designed to streamline airline operations and enhance the passenger experience through 
        efficient management of resources and timely information delivery.
      </p>
      <div className="features">
        <h2>Key Features</h2>
        <ul>
          <li>
            <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '0.5rem', color: '#0056b3' }} />
            Flight scheduling and management
          </li>
          <li>
            <FontAwesomeIcon icon={faTicket} style={{ marginRight: '0.5rem', color: '#0056b3' }} />
            Passenger booking and check-in
          </li>
          <li>
            <FontAwesomeIcon icon={faUsersCog} style={{ marginRight: '0.5rem', color: '#0056b3' }} />
            Crew assignment and management
          </li>
          <li>
            <FontAwesomeIcon icon={faToolbox} style={{ marginRight: '0.5rem', color: '#0056b3' }} />
            Aircraft maintenance tracking
          </li>
          <li>
            <FontAwesomeIcon icon={faClockRotateLeft} style={{ marginRight: '0.5rem', color: '#0056b3' }} />
            Real-time flight status updates
          </li>
        </ul>
      </div>
    </div>
  );
}

export default About;
