import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../asset/css/admin_style.css";

export default function Slidebar({ open, setOpen }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/AdminLogin");
  };

  return (
    <div className={`sidebar ${open ? "show" : ""}`}>

      <h2 className="logo">
        <Link
          to="/AdminDashboard"
          className="text-decoration-none"
          onClick={() => setOpen(false)}
        >
          Admin
        </Link>
      </h2>

      <ul>
        <li>
          <Link to="/AdminDashboard" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/AdminDashboard/Users" onClick={() => setOpen(false)}>
            Users
          </Link>
        </li>

        <li>
          <Link to="/AdminDashboard/Categories" onClick={() => setOpen(false)}>
            Categories
          </Link>
        </li>

        <li>
          <Link to="/AdminDashboard/Products" onClick={() => setOpen(false)}>
            Products
          </Link>
        </li>

        <li>
          <Link to="/AdminDashboard/HeroContent" onClick={() => setOpen(false)}>
            Hero Content
          </Link>
        </li>

        <li>
          <Link to="/AdminDashboard/Orders" onClick={() => setOpen(false)}>
            Orders
          </Link>
        </li>

        <li>
          <Link to="/AdminDashboard/Settings" onClick={() => setOpen(false)}>
            Settings
          </Link>
        </li>

        <li>
          <Link to="/AdminDashboard/CustomerRequests" onClick={() => setOpen(false)}>
            Customer Requests
          </Link>
        </li>
      </ul>

      <button className="logout" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>

    </div>
  );
}