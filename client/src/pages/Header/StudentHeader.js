import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentHeader.css"; // Make sure this path is correct.

const StudentHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Correct use of useNavigate

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Clear user token and other local data
    localStorage.removeItem("token");
    localStorage.removeItem("formCompleted"); // Optional: Clear this if you want to reset form status on logout
    navigate("/"); // Redirect to login page after logout
  };

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
        <a
          href="/StudentPortal"
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </a>
        <a
          href="/ApplyForInterview"
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Schedule Interview
        </a>
        <a
          href="/my-applications"
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
          My Applications
        </a>
        <a
          href="/FeedbackView"
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Feedback
        </a>
        <a
          href="/ProfilePage"
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Profile
        </a>
        <button onClick={handleLogout} className="nav-link btn">
          Log Out
        </button>
      </nav>
    </header>
  );
};

export default StudentHeader;
