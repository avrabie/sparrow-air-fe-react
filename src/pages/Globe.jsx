import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faSpinner, faPlaneDeparture, faPlaneArrival, faPlane, faRuler } from '@fortawesome/free-solid-svg-icons';
import { getAirports, getAirportByIcaoCode, getAirportsDistance } from '../api/services/airportService';
import GlobeGL from 'react-globe.gl';
import * as THREE from 'three';
import '../styles/Globe.css';

function Globe() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [departureAirport, setDepartureAirport] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [arcData, setArcData] = useState([]);
  const [planePosition, setPlanePosition] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [distanceLoading, setDistanceLoading] = useState(false);
  const globeRef = useRef();
  const animationRef = useRef();

  useEffect(() => {
    fetchAirports();

    // Check if dark mode is enabled
    const isDark = document.body.classList.contains('dark-mode');
    setIsDarkMode(isDark);

    // Add listener for dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.body.classList.contains('dark-mode');
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    return () => {
      // Clean up observer
      observer.disconnect();

      // Clean up any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Fetch distance information when both departure and destination airports are selected
  useEffect(() => {
    const fetchDistanceInfo = async () => {
      // Only fetch if both airports are selected and they are different
      if (departureAirport && destinationAirport && departureAirport !== destinationAirport) {
        try {
          setDistanceLoading(true);
          setDistanceInfo(null);

          const data = await getAirportsDistance(departureAirport, destinationAirport);
          setDistanceInfo(data);
        } catch (error) {
          console.error('Failed to fetch distance information:', error);
          setDistanceInfo(null);
        } finally {
          setDistanceLoading(false);
        }
      } else {
        // Clear distance info if one or both airports are not selected
        setDistanceInfo(null);
      }
    };

    fetchDistanceInfo();
  }, [departureAirport, destinationAirport]);

  const fetchAirports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch a larger number of airports to display on the globe
      const data = await getAirports(0, 4600);

      let airportsData = [];
      if (data.content) {
        airportsData = data.content;
      } else {
        airportsData = data;
      }

      // Filter out airports without valid coordinates
      const validAirports = airportsData.filter(airport => 
        airport.latitude && airport.longitude && 
        !isNaN(parseFloat(airport.latitude)) && 
        !isNaN(parseFloat(airport.longitude))
      );

      setAirports(validAirports);
    } catch (error) {
      console.error('Failed to fetch airports:', error);
      setError('Failed to load airports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const findAirportByIcao = useCallback((icaoCode) => {
    return airports.find(airport => airport.icaoCode === icaoCode);
  }, [airports]);

  const animateFlight = useCallback(async () => {
    if (!departureAirport || !destinationAirport) {
      alert('Please enter both departure and destination airport ICAO codes');
      return;
    }

    // Find the airports in our data
    const depAirport = findAirportByIcao(departureAirport);
    const destAirport = findAirportByIcao(destinationAirport);

    // If airports not found in current data, try to fetch them
    let dep = depAirport;
    let dest = destAirport;

    if (!dep && departureAirport) {
      try {
        dep = await getAirportByIcaoCode(departureAirport);
      } catch (error) {
        console.error(`Could not find departure airport ${departureAirport}:`, error);
      }
    }

    if (!dest && destinationAirport) {
      try {
        dest = await getAirportByIcaoCode(destinationAirport);
      } catch (error) {
        console.error(`Could not find destination airport ${destinationAirport}:`, error);
      }
    }

    if (!dep || !dest) {
      alert('One or both airports could not be found. Please check the ICAO codes.');
      return;
    }

    // Create arc data for the flight path
    const arc = {
      startLat: parseFloat(dep.latitude),
      startLng: parseFloat(dep.longitude),
      endLat: parseFloat(dest.latitude),
      endLng: parseFloat(dest.longitude),
      color: 'rgba(255, 165, 0, 0.8)'
    };

    setArcData([arc]);
    setAnimating(true);

    // Clear any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Point the globe to the midpoint of the arc
    // if (globeRef.current) {
    //   const midLat = (arc.startLat + arc.endLat) / 2;
    //   const midLng = (arc.startLng + arc.endLng) / 2;
    //   globeRef.current.pointOfView({ lat: midLat, lng: midLng, altitude: 1.5 }, 1000);
    // }

    // Animate the plane along the arc
    let progress = 0;
    const animateFrame = () => {
      progress += 0.005; // Speed of animation

      if (progress >= 1) {
        setAnimating(false);
        setPlanePosition(null);
        return;
      }

      // Calculate current position along the arc
      const currentLat = arc.startLat + (arc.endLat - arc.startLat) * progress;
      const currentLng = arc.startLng + (arc.endLng - arc.startLng) * progress;

      setPlanePosition({ lat: currentLat, lng: currentLng, progress });

      animationRef.current = requestAnimationFrame(animateFrame);
    };

    animateFrame();
  }, [departureAirport, destinationAirport, findAirportByIcao]);

  return (
    <div className="globe-container">
      <div className="globe-header">
        <h1>
          <FontAwesomeIcon icon={faGlobe} className="me-2" />
          Airport Globe
        </h1>
        <p className="lead">
          Explore airports around the world on an interactive 3D globe.
        </p>
      </div>

      <div className="airport-selection mb-4">
        <div className="row">
          <div className="col-md-5 mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faPlaneDeparture} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Departure Airport (ICAO code)"
                value={departureAirport}
                onChange={(e) => setDepartureAirport(e.target.value.toUpperCase())}
                maxLength={4}
              />
            </div>
          </div>
          <div className="col-md-5 mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faPlaneArrival} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Destination Airport (ICAO code)"
                value={destinationAirport}
                onChange={(e) => setDestinationAirport(e.target.value.toUpperCase())}
                maxLength={4}
              />
            </div>
          </div>
          <div className="col-md-2 mb-3">
            <button 
              className="btn btn-primary w-100" 
              onClick={animateFlight}
              disabled={animating || !departureAirport || !destinationAirport}
            >
              <FontAwesomeIcon icon={faPlane} className="me-2" />
              {animating ? 'Flying...' : 'Fly'}
            </button>
          </div>
        </div>

        {/* Distance information */}
        {departureAirport && destinationAirport && departureAirport !== destinationAirport && (
          <div className="distance-info mt-2 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <FontAwesomeIcon icon={faRuler} className="me-2" />
                  Distance Information
                </h5>
                {distanceLoading ? (
                  <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span className="ms-2">Calculating distance...</span>
                  </div>
                ) : distanceInfo ? (
                  <p className="mb-0">
                    The distance between <strong>{departureAirport}</strong> and <strong>{destinationAirport}</strong> is{' '}
                    <strong>
                      {distanceInfo.distanceKm 
                        ? `${distanceInfo.distanceKm.toFixed(2)} km (${(distanceInfo.distanceKm * 0.539957).toFixed(2)} NM)` 
                        : 'not available'}
                    </strong>
                  </p>
                ) : (
                  <p className="text-muted mb-0">Unable to calculate distance. Please check the airport codes.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          <p>Loading airports...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="text-danger">{error}</p>
          <button className="btn btn-primary" onClick={fetchAirports}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="globe-visualization">
          <GlobeGL
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            pointsData={airports}
            pointLat={d => parseFloat(d.latitude)}
            pointLng={d => parseFloat(d.longitude)}
            pointColor={(d) => {
              if (d.icaoCode === departureAirport) return 'green';
              if (d.icaoCode === destinationAirport) return 'blue';
              return 'red';
            }}
            pointAltitude={0.005}
            pointRadius={(d) => {
                if (d.icaoCode === departureAirport || d.icaoCode === destinationAirport) return 0.25;
                return 0.06;
            }}
            pointLabel={d => `${d.name} (${d.icaoCode})<br/>Location: ${d.city}, ${d.country}`}
            backgroundColor={isDarkMode ? '#1a1a1a' : '#f0f0f0'}
            width={800}
            height={600}

            // Arc for flight path
            arcsData={arcData}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={1500}

            // Custom layer for airplane
            customLayerData={planePosition ? [planePosition] : []}
            customThreeObject={d => {
              if (!d) return null;

              // Create a small airplane using a sphere
              const geometry = new THREE.SphereGeometry(0.5, 16, 16);
              const material = new THREE.MeshBasicMaterial({ color: 'yellow' });
              const airplane = new THREE.Mesh(geometry, material);

              return airplane;
            }}
            customThreeObjectUpdate={(obj, d) => {
              if (!d) return;

              // Position the airplane
              Object.assign(obj.position, globeRef.current.getCoords(d.lat, d.lng, 0.01));
            }}
          />
          <div className="globe-stats">
            <p>Airports displayed: {airports.length}</p>
          </div>
        </div>
      )}

      <div className="globe-info mt-4">
        <h2>About This Visualization</h2>
        <p>
          This interactive globe displays airports from around the world. Each point represents an airport,
          with its position determined by the airport's latitude and longitude coordinates.
        </p>
        <p>
          The colors of the airports indicate:
        </p>
        <ul>
          <li><span style={{ color: 'red' }}>Red</span>: Regular airports</li>
          <li><span style={{ color: 'green' }}>Green</span>: Selected departure airport</li>
          <li><span style={{ color: 'blue' }}>Blue</span>: Selected destination airport</li>
        </ul>
        <p>
          You can interact with the globe in the following ways:
        </p>
        <ul>
          <li>Enter ICAO codes in the input boxes to highlight departure and destination airports</li>
          <li>Click the "Fly" button to animate an airplane flying from the departure to the destination airport</li>
          <li>Rotate the globe by dragging with your mouse</li>
          <li>Zoom in and out using the scroll wheel</li>
          <li>Hover over airports to see their details (name, ICAO code, city, and country)</li>
          <li>The globe automatically adjusts its appearance based on your light/dark mode preference</li>
        </ul>
      </div>
    </div>
  );
}

export default Globe;
