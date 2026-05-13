import React, { useState, useEffect } from "react";
import { FaUser, FaBox, FaShoppingCart } from "react-icons/fa";
import "./asset/css/admin_style.css";

import Slidebar from "./component/slidebar";
import Navbar from "./component/navbar";
import AiSidebar from "../component/AiSidebar";

import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function AdminDashboard() {

    const [open, setOpen] = useState(false);

    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);

    const [recentOrders, setRecentOrders] = useState([]);

    const navigate = useNavigate();

    // Fetch Dashboard Data
    const fetchDashboardData = async () => {

        try {

            const [
                usersRes,
                productsRes,
                ordersRes
            ] = await Promise.all([
                axios.get(
                    "https://ak-unique-enterprise.onrender.com/get-users"
                ),

                axios.get(
                    "https://ak-unique-enterprise.onrender.com/get-products"
                ),

                axios.get(
                    "https://ak-unique-enterprise.onrender.com/get-orders"
                ),
            ]);

            const allOrders =
                ordersRes.data.orders?.map(
                    (order) => ({
                        ...order,
                        orderStatus:
                            order.orderStatus ||
                            "Pending",
                    })
                ) || [];

            setUserCount(
                usersRes.data.users?.length || 0
            );

            setProductCount(
                productsRes.data.products?.length || 0
            );

            setOrderCount(allOrders.length);

            setRecentOrders(
                allOrders.slice(0, 5)
            );

        } catch (err) {

            console.log(
                "Dashboard Error:",
                err
            );

        }
    };

    useEffect(() => {

        const admin =
            localStorage.getItem("admin");

        if (!admin) {

            navigate("/AdminLogin");
            return;

        }

        fetchDashboardData();

    }, [navigate]);

    return (
        <div className="dashboard">

            <Slidebar
                open={open}
                setOpen={setOpen}
            />

            <div className="main">

                <Navbar
                    toggleSidebar={() =>
                        setOpen(!open)
                    }
                />

                <AiSidebar />

                {/* Cards */}
                <div className="cards">

                    {/* Users */}
                    <div
                        className="card clickable-card"
                        onClick={() =>
                            navigate(
                                "/AdminDashboard/Users"
                            )
                        }
                    >

                        <FaUser className="card-icon" />

                        <h3>Users</h3>

                        <p>{userCount}</p>

                    </div>

                    {/* Products */}
                    <div
                        className="card clickable-card"
                        onClick={() =>
                            navigate(
                                "/AdminDashboard/Products"
                            )
                        }
                    >

                        <FaBox className="card-icon" />

                        <h3>Products</h3>

                        <p>{productCount}</p>

                    </div>

                    {/* Orders */}
                    <div
                        className="card clickable-card"
                        onClick={() =>
                            navigate(
                                "/AdminDashboard/Orders"
                            )
                        }
                    >

                        <FaShoppingCart className="card-icon" />

                        <h3>Orders</h3>

                        <p>{orderCount}</p>

                    </div>

                </div>

                {/* Recent Orders */}
                <div className="table-box">

                    <div className="table-header">

                        <h3>Recent Orders</h3>

                        <button
                            className="view-all"
                            onClick={() =>
                                navigate(
                                    "/AdminDashboard/Orders"
                                )
                            }
                        >
                            View All
                        </button>

                    </div>

                    <table>

                        <thead>

                            <tr>
                                <th>#ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>

                        </thead>

                        <tbody>

                            {recentOrders.length > 0 ? (

                                recentOrders.map(
                                    (order) => (

                                        <tr
                                            key={order._id}
                                        >

                                            <td>
                                                #
                                                {order._id?.slice(
                                                    -6
                                                )}
                                            </td>

                                            <td>
                                                {order
                                                    .customerInfo
                                                    ?.fullName ||
                                                    "Unknown"}
                                            </td>

                                            <td>
                                                ₹
                                                {order
                                                    .pricing
                                                    ?.grandTotal ||
                                                    order.totalAmount ||
                                                    0}
                                            </td>

                                            <td>

                                                <span
                                                    className={`status-badge ${order.orderStatus.toLowerCase()}`}
                                                >
                                                    {
                                                        order.orderStatus
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                {order.createdAt
                                                    ? new Date(
                                                          order.createdAt
                                                      ).toLocaleDateString()
                                                    : "-"}

                                            </td>

                                        </tr>
                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        style={{
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        No Orders Found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}