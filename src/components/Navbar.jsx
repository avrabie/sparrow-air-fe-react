import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faHome, faInfoCircle, faEnvelope, faMoon, faSun, faPlaneDeparture, faPlaneArrival, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import '../styles/Navbar.css';

function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <BootstrapNavbar 
      bg={darkMode ? "dark" : "primary"} 
      variant={darkMode ? "dark" : "light"} 
      expand="lg" 
      sticky="top" 
      className="shadow-sm"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FontAwesomeIcon icon={faPlane} className="me-2" />
          <span>vAMS</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <FontAwesomeIcon icon={faHome} className="me-1" />
              <span>Home</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
              <span>About</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              <FontAwesomeIcon icon={faEnvelope} className="me-1" />
              <span>Contact</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/aircraft">
              <FontAwesomeIcon icon={faPlaneDeparture} className="me-1" />
              <span>Aircraft</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/airports">
              <FontAwesomeIcon icon={faPlaneArrival} className="me-1" />
              <span>Airports</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/airlines">
              <FontAwesomeIcon icon={faPlane} className="me-1" />
              <span>Airlines</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/globe">
              <FontAwesomeIcon icon={faGlobe} className="me-1" />
              <span>Globe</span>
            </Nav.Link>
          </Nav>
          <Button 
            variant="outline-light" 
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </Button>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
