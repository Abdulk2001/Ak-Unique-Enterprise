import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import "./asset/css/admin_style.css";

export default function AdminSettings() {

  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));

    if (!storedAdmin) {
      navigate("/AdminLogin");
    } else {
      setAdmin(storedAdmin);
      setName(storedAdmin.Name);
      setEmail(storedAdmin.Email);
    }
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const res = await axios.post("https://ak-unique-enterprise-production-fe92.up.railway.app/admin-update", {
        Email: admin.Email,   // old email (find record)
        Name: name,
        NewEmail: email,      // 🔥 new email added
        Password: password
      });

      setMessage(res.data.message);

      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      setAdmin(res.data.admin);
      setEmail(res.data.admin.Email);
      setName(res.data.admin.Name);

    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  if (!admin) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="admin-settings-container">

      <div className="settings-box">

        {/* BACK */}
        <div className="back-btn" onClick={() => navigate("/AdminDashboard")}>
          <FaArrowLeft /> <span>Back</span>
        </div>

        {/* PROFILE */}
        <div className="profile-header">
          <FaUserCircle className="profile-icon" />
          <h3>{name}</h3>
          <p>{email}</p>
        </div>

        <h2>Account Settings</h2>

        {/* NAME */}
        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* EMAIL (EDITABLE) */}
        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="input-group password-box">
          <label>New Password</label>
          <div className="password-field">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {message && <p className="msg">{message}</p>}

        <button onClick={handleUpdate} className="update-btn">
          Save Changes
        </button>

      </div>

    </div>
  );
}