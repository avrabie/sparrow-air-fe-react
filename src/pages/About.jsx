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
        Hey fellow developers! I'm diving deep into reactive programming principles with this project, creating an immersive learning experience that leverages Spring Boot, PostgreSQL, and React. It's been a journey of "vibe coding" - that flow state where you build features step by step, though sometimes we need to roll up our sleeves for manual interventions and refactoring.
      </p>

      <p>
        I'm particularly focused on maintaining data consistency throughout the reactive stack, especially when it comes to critical operations like flight bookings. After all, nobody wants the real-world frustration of double-booked flights! We're still in early stages, but I'd love your collaboration as we work toward building a fully reactive application that delivers both performance and reliability.
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
