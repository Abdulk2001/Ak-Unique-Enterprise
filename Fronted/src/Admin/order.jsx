import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FaBoxOpen,
    FaUser,
    FaMapMarkerAlt,
    FaRupeeSign,
    FaCheckCircle,
    FaClock,
    FaArrowLeft,
    FaMoneyBillWave,
    FaGlobe,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const API = "https://ak-unique-enterprise.onrender.com";
    const navigate = useNavigate();

    // ================= FETCH ORDERS =================
    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${API}/get-orders`);

            console.log("Orders Response:", res.data);

            setOrders(res.data.orders || res.data || []);
        } catch (err) {
            console.log("Fetch Orders Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ================= UPDATE STATUS =================
    const updateStatus = async (id, orderStatus) => {
        try {
            await axios.put(`${API}/update-order/${id}`, {
                orderStatus,
            });

            fetchOrders();
        } catch (err) {
            console.log("Update Status Error:", err);
        }
    };

    return (
        <div className="admin-orders-page">
            {/* HEADER */}
            <div className="orders-header">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <button
                        className="btn btn-light rounded-circle"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                    </button>

                    <div>
                        <h1 className="m-0">Admin Orders Dashboard</h1>
                        <p className="m-0">
                            Manage customer orders efficiently
                        </p>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="orders-grid">
                {loading ? (
                    <h2>Loading orders...</h2>
                ) : orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order._id} className="order-card">
                            {/* TOP */}
                            <div className="order-top">
                                <h3>
                                    <FaBoxOpen /> Order #
                                    {order._id?.slice(-6)}
                                </h3>

                                <span
                                    className={`status-badge ${
                                        order.orderStatus
                                            ?.toLowerCase() || "pending"
                                    }`}
                                >
                                    {order.orderStatus || "Pending"}
                                </span>
                            </div>

                            {/* INFO */}
                            <div className="order-info">
                                <p>
                                    <FaUser />{" "}
                                    {order.customerInfo?.fullName ||
                                        "No Name"}
                                </p>

                                <p>
                                    📞{" "}
                                    {order.customerInfo?.phone ||
                                        "No Phone"}
                                </p>

                                <p>
                                    <FaMapMarkerAlt />{" "}
                                    {order.customerInfo?.address},
                                    {order.customerInfo?.city},
                                    {order.customerInfo?.state} -
                                    {order.customerInfo?.pincode}
                                </p>

                                <p>
                                    <FaRupeeSign /> ₹
                                    {order.pricing?.grandTotal ||
                                        0}
                                </p>

                                <p>
                                    {order.paymentInfo?.method ===
                                    "cod" ? (
                                        <>
                                            <FaMoneyBillWave /> Cash
                                            on Delivery
                                        </>
                                    ) : (
                                        <>
                                            <FaGlobe /> Online
                                            Payment
                                        </>
                                    )}
                                </p>

                                {order.paymentInfo?.method ===
                                    "online" && (
                                    <p>
                                        <strong>UTR:</strong>{" "}
                                        {order.paymentInfo?.utrId ||
                                            "N/A"}
                                    </p>
                                )}
                            </div>

                            {/* PRODUCTS */}
                            <div className="products-box">
                                <h4>Products</h4>

                                {order.MyCart?.length > 0 ? (
                                    order.MyCart.map((item, i) => (
                                        <div
                                            key={i}
                                            className="product-row"
                                        >
                                            <span>
                                                {item.name}
                                            </span>
                                            <span>
                                                x
                                                {item.quantity ||
                                                    1}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No products</p>
                                )}
                            </div>

                            {/* ACTIONS */}
                            <div className="action-btns">
                                <button
                                    onClick={() =>
                                        updateStatus(
                                            order._id,
                                            "Processing"
                                        )
                                    }
                                >
                                    <FaClock /> Processing
                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus(
                                            order._id,
                                            "Completed"
                                        )
                                    }
                                >
                                    <FaCheckCircle /> Complete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <h2>No orders found</h2>
                )}
            </div>
        </div>
    );
}