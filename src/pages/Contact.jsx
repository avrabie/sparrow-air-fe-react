import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLocationDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here
    alert('Form submitted! In a real application, this would send your message.');
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
        Have questions or need assistance? We're here to help! Fill out the form below or use our contact information to get in touch with our team.
      </p>
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input type="text" id="subject" name="subject" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" required></textarea>
        </div>
        
        <button type="submit" className="submit-button">
          <FontAwesomeIcon icon={faPaperPlane} />
          Send Message
        </button>
      </form>
      
      <div className="contact-info">
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
      </div>
    </div>
  );
}

export default Contact;