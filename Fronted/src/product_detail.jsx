import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "./component/navbar";
import Navbar2 from "./component/navbar2";
import Footer from "./component/footer";

import { FaStar } from "react-icons/fa";
import { IoBag } from "react-icons/io5";

const API =
    "https://ak-unique-enterprise.onrender.com";

export default function ProductDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch Product
    useEffect(() => {

        const fetchProduct = async () => {
            try {

                const res = await axios.get(
                    `${API}/get-product/${id}`
                );

                setProduct(res.data.product);

            } catch (err) {
                console.log(err);
            }
        };

        fetchProduct();

    }, [id]);

    // Add To Cart
    const addToCart = async () => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user) {
            alert("Please login first");
            navigate("/Login");
            return;
        }

        if (!product) return;

        try {

            setLoading(true);

            const res = await axios.post(
                `${API}/add-to-cart`,
                {
                    userId: user._id,
                    productId: product._id,
                    name: product.name,
                    salePrice: product.salePrice,
                    originalPrice: product.originalPrice,
                    image: product.image,
                    category: product.category,
                    description: product.description
                }
            );

            alert(res.data.message);

        } catch (err) {

            console.log(err);
            alert("Failed to add cart");

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <Navbar />
            <Navbar2 />

            {/* Back Button */}
            <button
                className="back-btn"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            {product && (

                <div className="container product-detail">

                    {/* Left Image */}
                    <div className="detail-left">

                        <img
                            src={`${API}/product/${product.image}`}
                            alt={product.name}
                        />

                    </div>

                    {/* Right Info */}
                    <div className="detail-right">

                        <h2>{product.name}</h2>

                        <p className="category">
                            {product.category}
                        </p>

                        {/* Rating */}
                        <div className="rating">

                            <FaStar className="text-warning" />
                            <FaStar className="text-warning" />
                            <FaStar className="text-warning" />
                            <FaStar className="text-warning" />
                            <FaStar className="text-warning" />

                            <span>
                                {" "}
                                4.8 (120 reviews)
                            </span>

                        </div>

                        {/* Price */}
                        <div className="price">

                            <h3>
                                ₹{product.salePrice}
                            </h3>

                            {product.originalPrice && (
                                <s>
                                    ₹{product.originalPrice}
                                </s>
                            )}

                        </div>

                        {/* Description */}
                        <h2>Product Description:</h2>

                        <p className="desc">
                            {product.description}
                        </p>

                        {/* Stock */}
                        <p
                            className={`stock ${
                                product.stock === "In Stock"
                                    ? "in"
                                    : "out"
                            }`}
                        >
                            {product.stock}
                        </p>

                        {/* Action Button */}
                        <div className="action-buttons">

                            <button
                                className="add-cart-btn"
                                onClick={addToCart}
                                disabled={loading}
                            >

                                <IoBag />

                                {" "}

                                {loading
                                    ? "Adding..."
                                    : "Add to Cart"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

            <Footer />
        </>
    );
}