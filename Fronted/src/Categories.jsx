import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    FaHeart,
    FaShoppingCart,
} from "react-icons/fa";

import axios from "axios";

import Navbar from "./component/navbar";
import Navbar2 from "./component/navbar2";
import Footer from "./component/footer";

export default function CategoryDetailPage() {

    const { categoryName } = useParams();

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const BASE_URL =
        "https://ak-unique-enterprise.onrender.com";

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);

                const res = await axios.get(
                    `${BASE_URL}/get-products`
                );

                const selectedCategory =
                    decodeURIComponent(
                        categoryName
                    )
                        .trim()
                        .toLowerCase();

                const filteredProducts =
                    res.data.products.filter(
                        (product) =>
                            product.category &&
                            product.category
                                .trim()
                                .toLowerCase() ===
                                selectedCategory
                    );

                setProducts(filteredProducts);

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }
        };

        fetchProducts();

    }, [categoryName]);

    return (
        <>
            <Navbar />
            <Navbar2 />

            <div className="category-header">

                <div className="container">

                    {/* Back Button */}
                    <button
                        className="category-back-btn"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        ← Back
                    </button>

                    {/* Heading */}
                    <div>

                        <h1>
                            {decodeURIComponent(
                                categoryName
                            )}
                        </h1>

                        <p>
                            Explore products in this
                            category
                        </p>

                    </div>

                </div>

                {/* Products */}
                {loading ? (

                    <h2 className="text-center">
                        Loading...
                    </h2>

                ) : products.length > 0 ? (

                    <div className="container product-grid-modern">

                        {products.map((item) => (

                            <div
                                key={item._id}
                                className="product-card-modern"
                                onClick={() =>
                                    navigate(
                                        `/product-detail/${item._id}`
                                    )
                                }
                                style={{
                                    cursor:
                                        "pointer",
                                }}
                            >

                                {/* Image */}
                                <div className="card-img">

                                    <img
                                        src={`${BASE_URL}/product/${item.image}`}
                                        alt={item.name}
                                    />

                                </div>

                                {/* Info */}
                                <h5>
                                    {item.name}
                                </h5>

                                <div className="d-flex justify-content-between">

                                    <span>
                                        ₹
                                        {item.salePrice}
                                    </span>

                                    <span>

                                        <FaHeart
                                            style={{
                                                marginRight:
                                                    "10px",
                                                cursor:
                                                    "pointer",
                                            }}
                                        />

                                        <FaShoppingCart
                                            style={{
                                                cursor:
                                                    "pointer",
                                            }}
                                        />

                                    </span>

                                </div>

                            </div>
                        ))}

                    </div>

                ) : (

                    <h2 className="text-center">

                        No products found in{" "}

                        {decodeURIComponent(
                            categoryName
                        )}

                    </h2>

                )}

            </div>

            <Footer />
        </>
    );
}