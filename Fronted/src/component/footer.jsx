import React from "react";
import logo from "../asset/img/logo.png";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        
        {/* Section 1: Logo & Socials */}
        <div className="footer-section">
          <img src={logo} alt="logo" width={80} className="footer-logo" />
          <p>Style meets comfort. Your one-stop shop for the latest fashion trends.</p>
          <div className="social-icons">
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
            <FaYoutube />
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Shop">Shop</Link></li>
            <li><Link to="/Category">Categories</Link></li>
            <li><Link to="/About">About Us</Link></li>
          </ul>
        </div>

        {/* Section 3: Customer Service */}
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><Link to="/">Track Order</Link></li>
            <li><Link to="/">Returns & Refunds</Link></li>
            <li><Link to="/">Shipping Policy</Link></li>
            <li><Link to="/">FAQs</Link></li>
          </ul>
        </div>

        {/* Section 4: Newsletter */}
        <div className="footer-section">
          <h4>Newsletter</h4>
          <p>Subscribe to get special offers and once-in-a-lifetime deals.</p>
          <div className="newsletter-box">
            <input type="email" placeholder="Your Email" />
            <button className="footer-btn">Join</button>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AK Unique Enterprise. All rights reserved.</p>
      </div>
    </footer>
  );
}