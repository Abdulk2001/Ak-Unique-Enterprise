import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FaBoxOpen,
    FaMapMarkerAlt,
    FaRupeeSign,
    FaClock,
    FaArrowLeft,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import Navbar from "./component/navbar";
import Navbar2 from "./component/navbar2";

export default function OrderHistory() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const API =
        "https://ak-unique-enterprise-production-fe92.up.railway.app";

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                if (!user?._id) {
                    navigate("/Login");
                    return;
                }

                const res = await axios.get(
                    `${API}/user-orders/${user._id}`
                );

                setOrders(res.data.orders || []);

            } catch (err) {

                console.log(
                    "ORDER ERROR:",
                    err.message
                );

            } finally {

                setLoading(false);

            }
        };

        if (user?._id) {

            fetchOrders();

        } else {

            setLoading(false);

        }

    }, [user?._id, navigate]);

    if (loading) {
        return <h2>Loading orders...</h2>;
    }

    return (
        <>
            <Navbar />
            <Navbar2 />

            <div className="order-history-page">

                {/* Back Button */}
                <button
                    className="back-history-btn"
                    onClick={() => navigate("/")}
                >
                    <FaArrowLeft />
                    {" "}Back to Home
                </button>

                <h1>My Orders</h1>

                {orders.length === 0 ? (

                    <h2>No orders found</h2>

                ) : (

                    orders.map((order) => (

                        <div
                            key={order._id}
                            className="history-card"
                        >

                            <h3>
                                <FaBoxOpen />
                                {" "}Order #
                                {order._id?.slice(-6)}
                            </h3>

                            <span
                                className={`status-${(
                                    order.orderStatus ||
                                    "pending"
                                ).toLowerCase()}`}
                            >
                                {order.orderStatus ||
                                    "Pending"}
                            </span>

                            <p>
                                <FaMapMarkerAlt />
                                {" "}
                                {order.customerInfo?.address},
                                {" "}
                                {order.customerInfo?.city}
                            </p>

                            <p>
                                <FaRupeeSign />
                                {" "}₹{order.totalAmount}
                            </p>

                            <p>
                                <FaClock />
                                {" "}
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString()}
                            </p>

                            <div className="products-list">

                                <h4>Products</h4>

                                {order.MyCart?.map(
                                    (item, i) => (

                                        <div
                                            key={i}
                                            className="product-item"
                                        >

                                            <img
                                                src={`${API}/product/${item.image}`}
                                                alt={item.name}
                                                className="product-img"
                                            />

                                            <div className="product-details">

                                                <h5>
                                                    {item.name}
                                                </h5>

                                                <p>
                                                    Qty:{" "}
                                                    {item.quantity || 1}
                                                </p>

                                                <span>
                                                    ₹{item.salePrice}
                                                </span>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>
                    ))
                )}

            </div>
        </>
    );
}