import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./component/navbar";
import Navbar2 from "./component/navbar2";
import Footer from "./component/footer";

export default function CartPage() {
    const navigate = useNavigate();
    const API = "https://ak-unique-enterprise-production-fe92.up.railway.app";

    const [MyCart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    // Fetch logged-in user's cart
    useEffect(() => {
        if (!user) {
            navigate("/Login");
            return;
        }

        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${API}/get-cart/${user._id}`);
            setCart(res.data.cart || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Update quantity in frontend + backend
    const updateQty = async (cartId, type) => {
        try {
            const item = MyCart.find((p) => p._id === cartId);
            if (!item) return;

            const currentQty = item.quantity || 1;

            const newQty =
                type === "inc"
                    ? currentQty + 1
                    : currentQty > 1
                    ? currentQty - 1
                    : 1;

            // Backend update
            await axios.put(`${API}/update-cart/${cartId}`, {
                quantity: newQty,
            });

            // Frontend instant update
            const updatedCart = MyCart.map((cartItem) =>
                cartItem._id === cartId
                    ? { ...cartItem, quantity: newQty }
                    : cartItem
            );

            setCart(updatedCart);
        } catch (err) {
            console.log(err);
        }
    };

    // Remove item
    const removeItem = async (cartId) => {
        try {
            await axios.delete(`${API}/delete-cart/${cartId}`);

            const updatedCart = MyCart.filter(
                (item) => item._id !== cartId
            );

            setCart(updatedCart);
        } catch (err) {
            console.log(err);
        }
    };

    // Total price
    const total = MyCart.reduce((sum, item) => {
        return sum + Number(item.salePrice || 0) * (item.quantity || 1);
    }, 0);

    // Total quantity
    const totalItems = MyCart.reduce((sum, item) => {
        return sum + (item.quantity || 1);
    }, 0);

    return (
        <>
            <Navbar />
            <Navbar2 />

            <div className="cart-page">
                <div className="cart-header">
                    <button
                        className="back-btn2"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                    </button>

                    <h1 className="cart-title">Your Cart</h1>
                </div>

                <div className="cart-container">
                    <div className="cart-list">
                        {loading ? (
                            <h2 className="empty-cart">Loading...</h2>
                        ) : MyCart.length > 0 ? (
                            MyCart.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="cart-card"
                                >
                                    <img
                                        src={`${API}/product/${item.image}`}
                                        alt={item.name}
                                    />

                                    <div className="cart-info">
                                        <h3>{item.name}</h3>

                                        <div className="cart-price">
                                            <h3>₹{item.salePrice}</h3>

                                            {item.originalPrice && (
                                                <s>₹{item.originalPrice}</s>
                                            )}
                                        </div>

                                        <div className="qty-box">
                                            <button
                                                className="qty-btn"
                                                onClick={() =>
                                                    updateQty(
                                                        item._id,
                                                        "dec"
                                                    )
                                                }
                                            >
                                                <FaMinus />
                                            </button>

                                            <span>{item.quantity || 1}</span>

                                            <button
                                                className="qty-btn"
                                                onClick={() =>
                                                    updateQty(
                                                        item._id,
                                                        "inc"
                                                    )
                                                }
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() =>
                                            removeItem(item._id)
                                        }
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <h2 className="empty-cart">
                                Your cart is empty
                            </h2>
                        )}
                    </div>

                    <div className="summary-box">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Total Items</span>
                            <span>{totalItems}</span>
                        </div>

                        <div className="summary-row">
                            <span>Total Price</span>
                            <strong>₹{total}</strong>
                        </div>

                        <button
                            className="checkout-btn"
                            onClick={() => navigate("/Buy")}
                            disabled={MyCart.length === 0}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}