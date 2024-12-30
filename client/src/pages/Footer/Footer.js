import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <h3>Contact Us</h3>
            <p>Email: support@[platformname].com</p>
            <p>Phone: +1-800-123-4567</p>
          </div>
          <div className="footer-content">
            <h3>Follow Us</h3>
            <ul className="social-links">
              <li>
                <a href="/login">Facebook</a>
              </li>
              <li>
                <a href="/login">Twitter</a>
              </li>
              <li>
                <a href="/login">Instagram</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
