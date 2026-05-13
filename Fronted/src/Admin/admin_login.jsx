import React, { useState } from "react";
import axios from "axios";
import { FaUserShield, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import './asset/css/admin_style.css'

export default function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://ak-unique-enterprise.onrender.com/AdminLogin", {
        email,
        password
      });

      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      alert(res.data.message);

      navigate("/AdminDashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="login-box">

        {/* 🔥 BRAND NAME */}
        <h1 className="brand">AK Unique Enterprise</h1>

        <h2 className="title">Admin Panel</h2>
        <p className="subtitle">Secure Access Only</p>

        <form onSubmit={handleLogin}>

          <div className="input-box">
            <FaUserShield className="icon" />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-box">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}