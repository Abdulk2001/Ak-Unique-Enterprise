import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaHome,
  FaReceipt,
  FaArrowLeft,
  FaTruck,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function OrderSuccess({ setCart }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let finalOrder = null;

    if (location.state?.order) {
      finalOrder = location.state.order;
      localStorage.setItem("lastOrder", JSON.stringify(finalOrder));
    } else {
      const savedOrder = localStorage.getItem("lastOrder");

      if (savedOrder) {
        try {
          finalOrder = JSON.parse(savedOrder);
        } catch (err) {
          console.log("Invalid localStorage data");
        }
      }
    }

    if (finalOrder) {
      setOrderData(finalOrder);
      if (setCart) setCart([]);
    }

    setLoading(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.state, navigate, setCart]);

  if (loading) {
    return (
      <div className="success-container">
        <h2>Loading order details...</h2>
      </div>
    );
  }

  // ==============================
  // PRICING DETAILS
  // ==============================
  const subtotal = Number(orderData?.pricing?.subtotal || 0);
  const deliveryCharge = Number(orderData?.pricing?.deliveryCharge || 0);
  const codCharge = Number(orderData?.pricing?.codCharge || 0);
  const gstAmount = Number(orderData?.pricing?.gstAmount || 0);

  const grandTotal = Number(
    orderData?.pricing?.grandTotal ||
    subtotal + deliveryCharge + codCharge + gstAmount
  );

  return (
    <>
      <div className="success-wrapper">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="icon-wrapper"
        >
          <FaCheckCircle className="success-icon" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="success-title"
        >
          Order Placed Successfully 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="success-subtitle"
        >
          Redirecting to Home in {countdown} seconds...
        </motion.p>

        <motion.div
          className="order-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>
            <FaReceipt /> Order Details
          </h3>

          <div className="row">
            <span>Order ID:</span>
            <strong>#{orderData?._id?.slice(-8) || "N/A"}</strong>
          </div>

          <div className="row">
            <span>Status:</span>
            <strong>{orderData?.orderStatus || "Processing"}</strong>
          </div>

          <div className="row">
            <span>Payment:</span>
            <strong>{orderData?.paymentInfo?.status || "N/A"}</strong>
          </div>

          <div className="row">
            <span>Name:</span>
            <strong>{orderData?.customerInfo?.fullName || "N/A"}</strong>
          </div>

          <div className="row">
            <span>Phone:</span>
            <strong>{orderData?.customerInfo?.phone || "N/A"}</strong>
          </div>

          <div className="row address">
            <span>Address:</span>
            <strong>
              {orderData?.customerInfo?.address || ""},{" "}
              {orderData?.customerInfo?.city || ""},{" "}
              {orderData?.customerInfo?.state || ""} -{" "}
              {orderData?.customerInfo?.pincode || ""}
            </strong>
          </div>

          <hr />

          <h4 className="mt-3">Pricing Summary</h4>

          <div className="row">
            <span>Subtotal:</span>
            <strong>₹{subtotal.toFixed(2)}</strong>
          </div>

          <div className="row">
            <span>
              <FaTruck /> Delivery Charge:
            </span>
            <strong>
              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge.toFixed(2)}`}
            </strong>
          </div>

          <div className="row">
            <span>
              <FaMoneyBillWave /> COD Charge:
            </span>
            <strong>₹{codCharge.toFixed(2)}</strong>
          </div>

          <div className="row">
            <span>GST (18%):</span>
            <strong>₹{gstAmount.toFixed(2)}</strong>
          </div>

          <hr />

          <div className="row total-row">
            <span>Total Paid:</span>
            <strong>₹{grandTotal.toFixed(2)}</strong>
          </div>
        </motion.div>

        <motion.div
          className="success-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            className="back-btn-order"
            onClick={() => navigate("/OrderHistory")}
          >
            <FaArrowLeft /> View Orders
          </button>

          <button
            className="home-btn"
            onClick={() => navigate("/")}
          >
            <FaHome /> Home
          </button>
        </motion.div>
      </div>
    </>
  );
}