import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingBag, FaClipboardList } from "react-icons/fa";
import "./asset/css/admin_style.css";
import Slidebar from "./component/slidebar";
import Navbar from "./component/navbar";

export default function UserDashboard() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  // password visibility
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchOrdersCount();
  }, []);

  // GET USERS
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get-users");
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  // GET ORDERS COUNT
  const fetchOrdersCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get-orders");
      setTotalOrders(res.data.orders?.length || 0);
    } catch (err) {
      console.log(err);
    }
  };

  // STATUS TOGGLE
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "active" ? "inactive" : "active";

      await axios.put(`http://localhost:5000/user-status/${id}`, {
        status: newStatus,
      });

      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  // PASSWORD TOGGLE
  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="user-dashboard">
      <Slidebar open={open} setOpen={setOpen} />

      <div className="user-main">
        <Navbar toggleSidebar={() => setOpen(!open)} />

        {/* CARDS */}
        <div className="cards">
          <div className="card">
            <FaShoppingBag className="card-icon" />
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>

          <div className="card">
            <FaClipboardList className="card-icon" />
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
        </div>

        {/* USER TABLE */}
        <div className="table-box">
          <div className="table-header">
            <h3>User Details</h3>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Password</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.Name}</td>
                  <td>{user.Email}</td>
                  <td>{user.Mobile}</td>

                  <td className="password-cell">
                    {visiblePasswords[user._id]
                      ? user.Password
                      : "*".repeat(user.Password?.length || 6)}

                    <button
                      className="eye-btn"
                      onClick={() => togglePassword(user._id)}
                    >
                      {visiblePasswords[user._id] ? "Hide" : "Show"}
                    </button>
                  </td>

                  <td>
                    <span
                      className={`badge1 ${
                        user.status === "active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {user.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <button
                      className={
                        user.status === "active"
                          ? "btn-deactivate"
                          : "btn-activate"
                      }
                      onClick={() =>
                        toggleStatus(user._id, user.status)
                      }
                    >
                      {user.status === "active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}