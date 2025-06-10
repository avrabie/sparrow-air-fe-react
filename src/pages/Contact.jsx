import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhone, 
  faLocationDot, 
  faPaperPlane, 
  faInfoCircle,
  faMapMarkerAlt,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please fill out all fields.'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please enter a valid email address.'
      });
      return;
    }

    // In a real application, you would handle form submission here
    // For now, we'll simulate a successful submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });

    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
        Have questions or need assistance? We're here to help! Fill out the form below or use our contact information to get in touch with our team.
      </p>

      <div className="contact-content">
        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-button">
              <FontAwesomeIcon icon={faPaperPlane} />
              Send Message
            </button>

            {formStatus.submitted && (
              <div className={`form-feedback ${formStatus.success ? 'success' : 'error'}`}>
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>{formStatus.message}</span>
              </div>
            )}
          </form>
        </div>

        <div className="contact-info-container">
          <div className="contact-info-card">
            <h2>
              <FontAwesomeIcon icon={faGlobe} />
              Contact Information
            </h2>

            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>info@airlinemanagement.com</span>
            </div>

            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <span>+1 (555) 123-4567</span>
            </div>

            <div className="contact-item">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>123 Aviation Way, Skyline City, SC 12345</span>
            </div>

            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FontAwesomeIcon icon={faGlobe} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FontAwesomeIcon icon={faGlobe} />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faGlobe} />
              </a>
            </div>
          </div>

          <div className="contact-info-card">
            <h2>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Our Location
            </h2>
            <div className="map-container">
              Map would be displayed here in a real application
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
