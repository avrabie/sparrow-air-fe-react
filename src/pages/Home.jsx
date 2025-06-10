import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faChartLine,
    faClock,
    faCode,
    faGlobe,
    faHeadset,
    faPlaneUp,
    faServer
} from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to a Vitrual Airline Management System</h1>
                <Link to="/globe">
                    <button className="cta-button">
                        Get Started
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </button>
                </Link>
            </div>

            <div className="about-section">
                <h2>About This Project</h2>
                <div className="about-content">
                    <p>
                        Hey developers! I'm currently exploring the world of reactive programming through a hands-on
                        project that integrates Spring Boot, PostgreSQL, and React. It’s been a mix of intuitive “vibe
                        coding” and the occasional deep dive into manual tweaking and refactoring.
                    </p>

                    <p>
                        A major focus has been ensuring data consistency across the reactive stack—especially for
                        high-stakes features like flight bookings, where errors like double-bookings are a no-go. We’re
                        still in the early phases, and I’d love to collaborate as we build a fully reactive system that
                        balances both performance and reliability.
                    </p>

                </div>
            </div>

            <div className="source-code-section">
                <h2>Source Code</h2>
                <p>Interested in how this project works? Check out our repositories:</p>
                <div className="services-grid">
                    <a href="https://github.com/avrabie/sparrow-air-fe-react" target="_blank" rel="noopener noreferrer"
                       className="service-card">
                        <FontAwesomeIcon icon={faCode} size="2x"/>
                        <h3>Front-end Repository</h3>
                        <p>React-based frontend with interactive UI components</p>
                    </a>
                    <a href="https://github.com/avrabie/sparrow-air" target="_blank" rel="noopener noreferrer"
                       className="service-card">
                        <FontAwesomeIcon icon={faServer} size="2x"/>
                        <h3>Back-end Repository</h3>
                        <p>Spring Boot backend with reactive programming</p>
                    </a>
                </div>
            </div>

            {/*<div className="services-section">*/}
            {/*  <h2>Our Services</h2>*/}
            {/*  <div className="services-grid">*/}
            {/*    <div className="service-card">*/}
            {/*      <FontAwesomeIcon icon={faPlaneArrival} size="2x" />*/}
            {/*      <h3>Flight Management</h3>*/}
            {/*      <p>Schedule and track flights with real-time updates and notifications</p>*/}
            {/*    </div>*/}
            {/*    <div className="service-card">*/}
            {/*      <FontAwesomeIcon icon={faUserGroup} size="2x" />*/}
            {/*      <h3>Passenger Services</h3>*/}
            {/*      <p>Streamline check-in, boarding, and in-flight service processes</p>*/}
            {/*    </div>*/}
            {/*    <div className="service-card">*/}
            {/*      <FontAwesomeIcon icon={faUsersCog} size="2x" />*/}
            {/*      <h3>Crew Management</h3>*/}
            {/*      <p>Optimize crew scheduling, assignments, and certification tracking</p>*/}
            {/*    </div>*/}
            {/*    <div className="service-card">*/}
            {/*      <FontAwesomeIcon icon={faToolbox} size="2x" />*/}
            {/*      <h3>Maintenance Tracking</h3>*/}
            {/*      <p>Monitor aircraft maintenance schedules and compliance</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            <div className="features-section">
                <h2>Key Features</h2>
                <div className="features-grid">
                    <Link to="/globe" className="feature-item">
                        <FontAwesomeIcon icon={faGlobe} size="2x"/>
                        <h3>Interactive Globe</h3>
                        <p>Explore airports worldwide on a 3D interactive globe</p>
                    </Link>
                    <Link to="/airports" className="feature-item">
                        <FontAwesomeIcon icon={faPlaneUp} size="2x"/>
                        <h3>Airports Database</h3>
                        <p>Browse and search through our comprehensive airport database</p>
                    </Link>
                    <Link to="/aircraft" className="feature-item">
                        <FontAwesomeIcon icon={faChartLine} size="2x"/>
                        <h3>Aircraft Types</h3>
                        <p>Discover various aircraft types and their specifications</p>
                    </Link>
                </div>
            </div>

            <div className="stats-section">
                <h2>Why Choose Us</h2>
                <div className="stats-grid">
                    <div className="stat-item">
                        <FontAwesomeIcon icon={faClock} size="2x"/>
                        <h3>99.8%</h3>
                        <p>On-time Performance</p>
                    </div>
                    <div className="stat-item">
                        <FontAwesomeIcon icon={faPlaneUp} size="2x"/>
                        <h3>500+</h3>
                        <p>Airlines Served</p>
                    </div>
                    <div className="stat-item">
                        <FontAwesomeIcon icon={faHeadset} size="2x"/>
                        <h3>24/7</h3>
                        <p>Customer Support</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
