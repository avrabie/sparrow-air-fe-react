import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import AircraftTypes from './pages/AircraftTypes'
import AircraftTypeDetail from './pages/AircraftTypeDetail'
import Airports from './pages/Airports'
import AirportDetails from './pages/AirportDetails'
import Globe from './pages/Globe'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check if user has a preference saved in localStorage
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode))
    }
  }, [])

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode)
  }

  return (
    <Router>
      <div className={`${darkMode ? 'dark-mode' : ''}`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="container py-4">
          <div className="row">
            <div className="col-lg-10 col-md-12 mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/aircraft" element={<AircraftTypes />} />
                <Route path="/aircraft/:icaoCode" element={<AircraftTypeDetail />} />
                <Route path="/airports" element={<Airports />} />
                <Route path="/airports/:icaoCode" element={<AirportDetails />} />
                <Route path="/globe" element={<Globe />} />
              </Routes>
            </div>
          </div>
        </main>
        <footer className="bg-dark text-light py-3 mt-auto">
          <div className="container text-center">
            <p className="mb-0">
              <FontAwesomeIcon icon={faCopyright} style={{ marginRight: '0.5rem' }} />
              {new Date().getFullYear()} Airline Management System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
