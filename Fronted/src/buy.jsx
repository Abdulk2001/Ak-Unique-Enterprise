import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaMoneyBillWave,
    FaMapMarkerAlt,
    FaGlobe,
    FaTruck,
    FaReceipt,
} from "react-icons/fa";
import axios from "axios";
import qr from "./asset/img/online.png";

export default function BuyNowPage() {
    const navigate = useNavigate();
    const API = "https://ak-unique-enterprise-production-fe92.up.railway.app";

    const [cart, setCart] = useState([]);
    const [showQR, setShowQR] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        paymentMethod: "cod",
        utrId: "",
    });

    // Charges
    const DELIVERY_CHARGE = 79;
    const COD_CHARGE = 29;
    const GST_PERCENT = 18;
    const FREE_DELIVERY_LIMIT = 999;

    /* =========================
       FETCH CART
    ========================= */
    const fetchCart = useCallback(async () => {
        try {
            const userData = localStorage.getItem("user");
            const users = JSON.parse(userData);

            if (!users?._id) {
                navigate("/Login");
                return;
            }

            const res = await axios.get(`${API}/get-cart/${users._id}`);
            setCart(res.data.cart || []);
        } catch (err) {
            console.log(err);
        }
    }, [navigate]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    /* =========================
       HANDLE INPUT
    ========================= */
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "paymentMethod") {
            setShowQR(value === "online");
        }

        if (name === "phone" || name === "pincode") {
            if (!/^\d*$/.test(value)) return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =========================
       CALCULATIONS
    ========================= */
    const totalAmount = cart.reduce(
        (sum, item) =>
            sum +
            Number(item.salePrice || 0) * Number(item.quantity || 1),
        0
    );

    const deliveryCharge =
        totalAmount >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_CHARGE;

    const codCharge =
        formData.paymentMethod === "cod" ? COD_CHARGE : 0;

    const gstAmount =
        ((totalAmount + deliveryCharge + codCharge) *
            GST_PERCENT) /
        100;

    const grandTotal =
        totalAmount +
        deliveryCharge +
        codCharge +
        gstAmount;

    /* =========================
       PLACE ORDER
    ========================= */
    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            alert("Cart empty");
            return;
        }

        if (!formData.fullName || !formData.address || !formData.city || !formData.state) {
            alert("Please fill all details");
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            alert("Enter valid 10-digit mobile number");
            return;
        }

        if (!/^[0-9]{6}$/.test(formData.pincode)) {
            alert("Enter valid 6-digit pincode");
            return;
        }

        if (formData.paymentMethod === "online" && !formData.utrId) {
            alert("Please enter UTR ID");
            return;
        }

        try {
            const userData = localStorage.getItem("user");
            const users = JSON.parse(userData);

            const payload = {
                userId: users._id,

                MyCart: cart,

                customerInfo: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: users.Email || "",
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                },

                paymentInfo: {
                    method: formData.paymentMethod,
                    status:
                        formData.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : "Paid Online",
                    transactionId: formData.utrId || "N/A",
                },

                pricing: {
                    subtotal: totalAmount,
                    deliveryCharge,
                    codCharge,
                    gstAmount,
                    grandTotal,
                },
            };

            const res = await axios.post(`${API}/order`, payload);

            const order = res.data?.order;

            setCart([]);

            navigate("/OrderSuccess", {
                state: { order },
            });
        } catch (err) {
            console.log("ORDER ERROR:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Order failed");
        }
    };

    return (
        <div className="buy-page">
            <div className="container py-5">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <button
                        className="btn btn-dark rounded-circle back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                    </button>
                    <h2 className="fw-bold m-0">Buy Now</h2>
                </div>

                <div className="row g-4">
                    {/* LEFT */}
                    <div className="col-lg-7">
                        <div className="buy-card">
                            <h4 className="fw-bold mb-4">
                                <FaMapMarkerAlt className="me-2" />
                                Delivery Details
                            </h4>

                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                className="form-control mb-3"
                                onChange={handleChange}
                            />

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                className="form-control mb-3"
                                value={formData.phone}
                                maxLength="10"
                                onChange={handleChange}
                            />

                            <textarea
                                name="address"
                                placeholder="Full Address"
                                className="form-control mb-3"
                                rows="3"
                                onChange={handleChange}
                            />

                            <div className="row">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        className="form-control mb-3"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        className="form-control mb-3"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                className="form-control"
                                value={formData.pincode}
                                maxLength="6"
                                onChange={handleChange}
                            />
                        </div>

                        {/* PAYMENT */}
                        <div className="buy-card mt-4">
                            <h4 className="fw-bold mb-4">Payment Method</h4>

                            <label className="payment-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={formData.paymentMethod === "cod"}
                                    onChange={handleChange}
                                />
                                <FaMoneyBillWave className="ms-2 me-2" />
                                Cash on Delivery (+₹29)
                            </label>

                            <label className="payment-option mt-3">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={formData.paymentMethod === "online"}
                                    onChange={handleChange}
                                />
                                <FaGlobe className="ms-2 me-2" />
                                Online Payment
                            </label>
                        </div>

                        {showQR && (
                            <div className="buy-card mt-4 text-center">
                                <h5 className="mb-3">Scan QR & Pay</h5>

                                <img
                                    src={qr}
                                    alt="QR Code"
                                    className="qr-image"
                                />

                                <input
                                    type="text"
                                    name="utrId"
                                    maxLength="12"
                                    placeholder="Enter UTR ID"
                                    className="form-control mt-4"
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="col-lg-5">
                        <div className="buy-card sticky-top">
                            <h4 className="fw-bold mb-4">Order Summary</h4>

                            {cart.map((item, i) => (
                                <div key={i} className="order-product">
                                    <img
                                        src={`${API}/product/${item.image}`}
                                        alt={item.name}
                                    />

                                    <div className="order-product-details flex-grow-1">
                                        <h6>{item.name}</h6>
                                        <p>
                                            ₹{item.salePrice} × {item.quantity || 1}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <hr />

                            <div className="d-flex justify-content-between">
                                <span>Subtotal</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between mt-2">
                                <span>
                                    <FaTruck className="me-2" />
                                    Delivery
                                </span>
                                <span>
                                    {deliveryCharge === 0
                                        ? "FREE"
                                        : `₹${deliveryCharge}`}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between mt-2">
                                <span>COD Charge</span>
                                <span>₹{codCharge}</span>
                            </div>

                            <div className="d-flex justify-content-between mt-2">
                                <span>
                                    <FaReceipt className="me-2" />
                                    GST (18%)
                                </span>
                                <span>₹{gstAmount.toFixed(2)}</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between align-items-center">
                                <h5>Total</h5>
                                <h4 className="gold-text">
                                    ₹{grandTotal.toFixed(2)}
                                </h4>
                            </div>

                            <button
                                className="btn btn-dark w-100 mt-4"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}