import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./StudentHeader.css"; // Make sure this path is correct.

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      {/* Hamburger menu button */}
      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-label="Toggle navigation menu"
      >
        &#9776; {/* Hamburger icon */}
      </button>

      {/* Navbar links */}
      <nav className={`navbar ${isMenuOpen ? "active" : ""}`}>
        <Link
          to="/"
          className={`nav-link ${isActive("/") ? "active-link" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`nav-link ${isActive("/about") ? "active-link" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          About Us
        </Link>
        <Link
          to="/login"
          className={`nav-link btn ${isActive("/login") ? "active-link" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Log In
        </Link>
        <Link
          to="/register"
          className={`nav-link btn ${
            isActive("/register") ? "active-link" : ""
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          Sign Up
        </Link>
      </nav>
    </header>
  );
};

export default Header;
