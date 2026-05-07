import React, { useState, useEffect } from "react";
import logo from "../asset/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
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

  // Cart open only if logged in
  const handleCartClick = () => {
    if (!user) {
      navigate("/Login");
      return;
    }
    navigate("/cart");
  };

  return (
    <nav className="d-none d-lg-block bg-white border-bottom sticky-top">
      <div className="container d-flex justify-content-between align-items-center py-2">

        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="logo" width={60} />
        </Link>

        {/* Links */}
        <div className="d-flex gap-4">
          <Link to="/" className="text-decoration-none text-dark fw-medium">
            Home
          </Link>
          <Link to="/shop" className="text-decoration-none text-dark fw-medium">
            Shop
          </Link>
          <Link to="/Category" className="text-decoration-none text-dark fw-medium">
            Categories
          </Link>
          <Link
            to="/contact-support"
            className="text-decoration-none text-dark fw-medium"
          >
            Contact Support
          </Link>
        </div>

        {/* Icons & Profile */}
        <div className="d-flex align-items-center gap-3">

          {/* Cart */}
          <button
            className="cart-btn"
            onClick={handleCartClick}
            style={{ cursor: "pointer" }}
          >
            <ShoppingCart size={20} />
          </button>

          {/* User Profile */}
          {user && (
            <div className="position-relative">
              <FaUserCircle
                size={35}
                onClick={() => setDropdown(!dropdown)}
                style={{ cursor: "pointer" }}
              />

              {dropdown && (
                <div
                  className="position-absolute end-0 bg-white shadow p-2 rounded mt-2"
                  style={{
                    zIndex: 1000,
                    minWidth: "170px",
                  }}
                >
                  <p
                    className="mb-2"
                    onClick={() => navigate("/profile")}
                    style={{ cursor: "pointer" }}
                  >
                    Profile
                  </p>

                  <p
                    className="mb-2"
                    onClick={() => navigate("/OrderHistory")}
                    style={{ cursor: "pointer" }}
                  >
                    Order History
                  </p>

                  <p
                    className="mb-0 text-danger"
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Login Button */}
          {!user && (
            <Link to="/Login">
              <button className="btn btn-dark p-2 px-3 btn-sm">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}