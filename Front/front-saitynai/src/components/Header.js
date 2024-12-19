import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { jwtDecode } from "jwt-decode";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUserName(null);
    setIsAdmin(false); // Reset admin state on logout
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(
          decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
          decodedToken["name"]
        );
        // Check if the user has the "Admin" role
        const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (Array.isArray(roles) ? roles.includes("Admin") : roles === "Admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/" className="header-logo-link">
          <h1>Gym Management</h1>
        </Link>
      </div>
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
        ☰
      </button>
      <nav className={`header-nav ${isMobileMenuOpen ? "open" : ""}`}>
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/gyms">Gyms</Link></li>
          {isAdmin && (
            <li><Link to="/gymManagment">Gym Management</Link></li> 
          )}
          {userName ? (
            <li style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "8px" }}>Welcome, {userName}</span>
              <button onClick={handleLogout} className="logout-button" style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}>
                <FiLogOut style={{ marginRight: "4px" }} /> Logout
              </button>
            </li>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
