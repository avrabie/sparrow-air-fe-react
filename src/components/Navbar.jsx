import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faHome, faInfoCircle, faEnvelope, faMoon, faSun, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';

function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <FontAwesomeIcon icon={faPlane} />
          <span>Airline Management System</span>
        </Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">
          <FontAwesomeIcon icon={faHome} />
          <span>Home</span>
        </Link>
        <Link to="/about" className="navbar-item">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span>About</span>
        </Link>
        <Link to="/contact" className="navbar-item">
          <FontAwesomeIcon icon={faEnvelope} />
          <span>Contact</span>
        </Link>
        <Link to="/aircraft-types" className="navbar-item">
          <FontAwesomeIcon icon={faPlaneDeparture} />
          <span>Aircraft Types</span>
        </Link>
        <button 
          className="theme-toggle-button" 
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
