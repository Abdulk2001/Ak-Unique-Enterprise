import React, { useState, useEffect } from "react";
import logo from "../asset/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import "../asset/css/style.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/Login");
  };

  // Cart access check
  const handleCartClick = () => {
    if (!user) {
      navigate("/Login");
      return;
    }
    navigate("/cart");
  };

  return (
    <nav className="main-nav">
      {/* ================= TOP BAR ================= */}
      <div className="icons">
        {/* LOGO */}
        <div>
          <Link to="/">
            <img src={logo} alt="logo" width={60} />
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ gap: "12px" }}>
          {/* LOGIN / PROFILE */}
          {!user ? (
            <Link to="/Login">
              <button className="btn-outline-dark">Login</button>
            </Link>
          ) : (
            <div style={{ position: "relative" }}>
              <FaUserCircle
                size={25}
                onClick={() => setDropdown(!dropdown)}
                style={{ cursor: "pointer" }}
              />

              {dropdown && (
                <div className="profile-dropdown">
                  <p onClick={() => navigate("/profile")}>Profile</p>
                  <p onClick={handleLogout} style={{ color: "red" }}>
                    Logout
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CART ICON */}
          <div className="icon-group">
            <ShoppingCart
              onClick={handleCartClick}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* MENU BUTTON */}
          <button
            className="btn-outline-dark"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <RxCross2 /> : <CiMenuBurger />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className="nav-link"
        style={{
          height: menuOpen ? "auto" : "0px",
          padding: menuOpen ? "10px" : "0px",
          overflow: "hidden",
        }}
      >
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/shop" onClick={() => setMenuOpen(false)}>
          Shop
        </Link>
        <Link to="/Category" onClick={() => setMenuOpen(false)}>
          Categories
        </Link>
        <Link to="/contact-support" onClick={() => setMenuOpen(false)}>
          Contact Support
        </Link>

        {!user && (
          <Link to="/Login" onClick={() => setMenuOpen(false)}>
            <button className="custom-btn">Login</button>
          </Link>
        )}

        {user && (
          <>
            <button
              className="custom-btn"
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
            >
              Profile
            </button>

            <button
              className="custom-btn"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}