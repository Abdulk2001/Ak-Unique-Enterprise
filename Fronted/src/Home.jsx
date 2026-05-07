import React, { useEffect, useState } from "react";
import Navbar from "./component/navbar";
import Navbar2 from "./component/navbar2";
import Footer from "./component/footer";
import AiSidebar from "./component/AiSidebar";
import axios from "axios";
import "./asset/css/style.css";
import { Link } from "react-router-dom";
import { FaArrowRightLong, FaStar, FaEquals } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import { LiaShippingFastSolid } from "react-icons/lia";
import { RiSecurePaymentLine } from "react-icons/ri";

import img from "./asset/img/shoe-img.jpg";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [hero, setHero] = useState({});
  const [products, setProducts] = useState([]);

  const API = "http://localhost:5000";

  useEffect(() => {
    fetchCategories();
    fetchHero();
    fetchProducts();
  }, []); // fixed infinite loop

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/get-category`);
      setCategories(res.data.categories);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchHero = async () => {
    try {
      const res = await axios.get(`${API}/get-hero`);
      setHero(res.data.hero);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/get-products`);
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const getBadgeClass = (badge) => {
    if (!badge) return "";
    const value = badge.toLowerCase();

    if (value.includes("new")) return "badge-new";
    if (value.includes("bestseller")) return "badge-bestseller";
    if (value.includes("sale") || value.includes("%")) return "badge-discount";

    return "badge-default";
  };

  return (
    <>
      <div className="header">
        <p className="my-0">
          {hero?.headerText || "Free shipping on orders over $75"}
        </p>
      </div>

      <Navbar />
      <Navbar2 />
      <AiSidebar />

      {/* HERO */}
      <div className="hero-royal">
        <div className="container hero-royal-container">
          <div className="hero-royal-text">
            <div className="royal-tag">
              {hero?.headerText || "PREMIUM COLLECTION"}
            </div>

            <h1 className="royal-title">
              {hero?.headline || "Step Into"} <br />
              <span>Royal Comfort</span>
            </h1>

            <p className="royal-desc">
              {hero?.subHeadline ||
                "Luxury footwear crafted for performance."}
            </p>

            <div className="royal-btns">
              <Link to="/shop">
                <button className="royal-btn-primary">
                  Explore Collection
                </button>
              </Link>

              <Link to="/Category">
                <button className="royal-btn-outline">
                  Browse Categories
                </button>
              </Link>
            </div>
          </div>

          <div className="hero-royal-image">
            <img
              src={hero?.image ? `${API}/heroSection/${hero.image}` : img}
              alt="hero"
              className="royal-img"
            />

            <div className="hero-badge">
              <span>{hero?.discountTag || "40% OFF"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY */}
      <div className="container mt-5 d-flex justify-content-between">
        <h2 className="fs-2 fw-bold">Shop by Category</h2>
        <Link to="/Category">
          View All <FaAngleRight />
        </Link>
      </div>

      <div className="container category-grid">
        {categories.slice(0, 3).map((item) => (
          <Link
            to={`/Category/${item.name}`}
            key={item._id}
            className="category-card-link"
          >
            <div className="category-card">
              <img
                src={`${API}/category/${item.image}`}
                alt={item.name}
                className="category-img"
              />

              <div className="category-overlay">
                <h2>{item.name}</h2>
                <p>{item.desc}</p>

                <span className="shop-now-btn">
                  Shop Now <FaArrowRightLong />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* FEATURED */}
      <div className="container mt-5 d-flex justify-content-between">
        <h2 className="fw-bold">Featured Products</h2>
        <Link to="/shop">
          View All Featured <FaAngleRight />
        </Link>
      </div>

      <div className="container product-grid-modern">
        {products.slice(0, 4).map((item) => (
          <Link
            to={`/product-detail/${item._id}`}
            key={item._id}
            className="product-card-link"
          >
            <div className="product-card-modern">
              <div className="card-img">
                {item.discountBadge && (
                  <span
                    className={`custom-badge ${getBadgeClass(
                      item.discountBadge
                    )}`}
                  >
                    {item.discountBadge}
                  </span>
                )}

                <img src={`${API}/product/${item.image}`} alt={item.name} />
              </div>

              <h5>{item.name}</h5>

              <div className="d-flex justify-content-between">
                <span>₹{item.salePrice}</span>
                <span>
                  <FaStar className="text-warning" /> 4.5
                </span>
              </div>

              <p
                className={
                  item.stock === "In Stock" ? "stock-in" : "stock-out"
                }
              >
                {item.stock}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* FEATURES */}
      <div className="container section-3 mt-5">
        <div>
          <LiaShippingFastSolid />
          <h5>Free Shipping</h5>
          <p className="feature-text">Fast delivery above ₹999</p>
        </div>

        <div>
          <FaEquals />
          <h5>Size Guarantee</h5>
          <p className="feature-text">Easy exchange available</p>
        </div>

        <div>
          <RiSecurePaymentLine />
          <h5>Secure Payment</h5>
          <p className="feature-text">100% safe checkout system</p>
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <div className="container mt-5">
        <h2 className="fw-bold">New Arrivals</h2>
      </div>

      <div className="container product-grid-modern">
        {sortedProducts.slice(-4).map((item) => (
          <Link
            to={`/product-detail/${item._id}`}
            key={item._id}
            className="product-card-link"
          >
            <div className="product-card-modern">
              <div className="card-img">
                {item.discountBadge && (
                  <span
                    className={`custom-badge ${getBadgeClass(
                      item.discountBadge
                    )}`}
                  >
                    {item.discountBadge}
                  </span>
                )}

                <img src={`${API}/product/${item.image}`} alt={item.name} />
              </div>

              <h5>{item.name}</h5>

              <div className="d-flex justify-content-between">
                <span>₹{item.salePrice}</span>
                <FaStar className="text-warning" />
              </div>

              <p
                className={
                  item.stock === "In Stock" ? "stock-in" : "stock-out"
                }
              >
                {item.stock}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <br />
      <Footer />
    </>
  );
}