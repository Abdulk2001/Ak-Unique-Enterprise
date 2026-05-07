import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Star, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./component/navbar";
import Navbar2 from "./component/navbar2";
import Footer from "./component/footer";
import { FaArrowLeft, } from "react-icons/fa";

export default function ShopPage() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const API = "https://ak-unique-enterprise-production-fe92.up.railway.app";

    useEffect(() => {
        fetchProducts();
    },);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API}/get-products`);
            setProducts(res.data.products);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <Navbar2 />

            <div className="shop-container">

                {/* HEADER */}
                <div className="shop-header">

                    <button className="back-btn" onClick={() => navigate(-1)}>
                     <FaArrowLeft size={20} />
                    </button>

                    <h2>Shop</h2>

                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                </div>

                {/* PRODUCTS */}
                {loading ? (
                    <h3 className="loading">Loading...</h3>
                ) : (
                    <div className="product-grid">

                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((item) => (
                                <Link
                                    to={`/product-detail/${item._id}`}
                                    key={item._id}
                                    className="product-card"
                                >

                                    <div className="img-box">
                                        <img
                                            src={`${API}/product/${item.image}`}
                                            alt={item.name}
                                        />
                                        <span className="badge">
                                            {item.discountBadge || "New"}
                                        </span>
                                    </div>

                                    <h3>{item.name}</h3>

                                    <div className="price-row">
                                        <span className="price">₹{item.salePrice}</span>
                                        <span className="rating">
                                            <Star size={14} fill="gold" /> 4.5
                                        </span>
                                    </div>

                                    <p className={`stock ${item.stock === "In Stock" ? "in" : "out"}`}>
                                        {item.stock}
                                    </p>

                                </Link>
                            ))
                        ) : (
                            <h3 className="loading">No Products Found</h3>
                        )}

                    </div>
                )}

            </div>

            <Footer />
        </>
    );
}