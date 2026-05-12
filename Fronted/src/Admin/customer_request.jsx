import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerRequests() {

    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    // 📦 GET ALL REQUESTS
    const fetchData = async () => {
        try {
            const res = await axios.get("https://ak-unique-enterprise.onrender.comget-support-requests");
            setRequests(res.data.requests);
        } catch (error) {
            console.log(error);
        }
    };

    // 🔄 UPDATE STATUS
    const updateStatus = async (id, status) => {
        try {
            await axios.put(`https://ak-unique-enterprise.onrender.comsupport-request/${id}`, { status });
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    // 🗑 DELETE REQUEST
    const deleteRequest = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this request?");

        if (!confirmDelete) return;

        try {
            await axios.delete(`https://ak-unique-enterprise.onrender.comsupport-request/${id}`);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="admin-wrapper light">

            {/* 🔙 BACK BUTTON */}
            <div style={{ padding: "10px" }}>
                <button onClick={() => navigate("/AdminDashboard")} className="back-btn">
                    ⬅ Back
                </button>
            </div>

            {/* TITLE */}
            <h2 className="page-title">Customer Requests</h2>

            {/* TABLE */}
            <div className="table-container">
                <table>

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.length > 0 ? (
                            requests.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.subject}</td>
                                    <td>{item.message}</td>

                                    {/* STATUS */}
                                    <td>
                                        <span className={`status ${item.status}`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    {/* ACTION BUTTONS */}
                                    <td>

                                        <button
                                            className="accept"
                                            onClick={() => updateStatus(item._id, "resolved")}
                                        >
                                            Resolve
                                        </button>

                                        <button
                                            className="reject"
                                            onClick={() => updateStatus(item._id, "rejected")}
                                        >
                                            Reject
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteRequest(item._id)}
                                        >
                                            Delete
                                        </button>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                    No Requests Found
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}