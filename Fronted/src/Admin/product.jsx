import React, { useState, useEffect } from "react";
import axios from "axios";
import "./asset/css/admin_style.css";
import Slidebar from "./component/slidebar";
import Navbar from "./component/navbar";
import { useNavigate } from "react-router-dom";
import { Trash2, PlusCircle, Pencil } from "lucide-react";

const API = "http://localhost:5000";

export default function AdminProduct() {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // ================= DYNAMIC CATEGORY =================
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API}/get-category`);
            setCategories(res.data.categories);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= PRODUCT STATE =================
    const [product, setProduct] = useState({
        name: "",
        category: "",
        salePrice: "",
        originalPrice: "",
        discountBadge: "",
        description: "",
        stock: "In Stock"
    });

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // EDIT
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API}/get-products`);
            setProducts(res.data.products);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= USE EFFECT =================
    useEffect(() => {
        const admin = localStorage.getItem("admin");
        if (!admin) navigate("/AdminLogin");

        fetchProducts();
        fetchCategories(); // ✅ IMPORTANT
    }, [navigate]);

    // ================= HANDLERS =================
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    // ================= RESET =================
    const resetForm = () => {
        setProduct({
            name: "",
            category: "",
            salePrice: "",
            originalPrice: "",
            discountBadge: "",
            description: "",
            stock: "In Stock"
        });
        setImageFile(null);
        setPreview(null);
        setEditMode(false);
        setEditId(null);
    };

    // ================= ADD / UPDATE =================
    const handleSubmit = async () => {

        if (!product.name || !product.category || !product.salePrice) {
            alert("Required fields missing");
            return;
        }

        const formData = new FormData();
        Object.keys(product).forEach(key => {
            formData.append(key, product[key]);
        });

        if (imageFile) formData.append("image", imageFile);

        try {
            setLoading(true);

            if (editMode) {
                await axios.put(`${API}/update-product/${editId}`, formData);
                alert("Product Updated");
            } else {
                if (!imageFile) {
                    alert("Image required");
                    setLoading(false);
                    return;
                }

                await axios.post(`${API}/add-product`, formData);
                alert("Product Added");
            }

            fetchProducts();
            resetForm();

        } catch (err) {
            alert("Error");
        }

        setLoading(false);
    };

    // ================= DELETE =================
    const deleteProduct = async (id) => {
        if (window.confirm("Delete product?")) {
            try {
                await axios.delete(`${API}/delete-product/${id}`);
                fetchProducts();
            } catch {
                alert("Delete failed");
            }
        }
    };

    // ================= EDIT =================
    const editProduct = (item) => {
        setProduct(item);
        setEditMode(true);
        setEditId(item._id);
        setPreview(`${API}/product/${item.image}`); // ✅ FIXED PATH
    };

    return (
        <div className="dashboard">

            <Slidebar open={open} setOpen={setOpen} />

            <div className="main">

                <Navbar toggleSidebar={() => setOpen(!open)} />

                <div className="page-header">
                    <h2>Product Management</h2>
                </div>

                {/* ================= FORM ================= */}
                <div className="product-form-card">

                    <div className="admin-form-grid">

                        <div className="form-left">

                            <input
                                type="text"
                                className="text-dark m-2"
                                name="name"
                                placeholder="Product Name"
                                value={product.name}
                                onChange={handleChange}
                            />

                            {/* CATEGORY FROM DB */}
                            <div className="form-inline">

                                <select
                                    name="category"
                                    className="text-dark m-2 border-black"
                                    value={product.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Category</option>

                                    {categories.map((c) => (
                                        <option key={c._id} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}

                                </select>

                                <select
                                    name="stock"
                                    className="text-dark m-2 border-black"
                                    value={product.stock}
                                    onChange={handleChange}
                                >
                                    <option>In Stock</option>
                                    <option>Out of Stock</option>
                                </select>

                            </div>

                            <div className="form-inline">

                                <input
                                    type="number"
                                    className="text-dark"
                                    name="salePrice"
                                    placeholder="Sale Price"
                                    value={product.salePrice}
                                    onChange={handleChange}
                                />

                                <input
                                    type="number"
                                    className="text-dark"
                                    name="originalPrice"
                                    placeholder="Original Price"
                                    value={product.originalPrice}
                                    onChange={handleChange}
                                />

                                <input
                                    type="text"
                                    className="text-dark"
                                    name="discountBadge"
                                    placeholder="Discount"
                                    value={product.discountBadge}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        <div className="form-right">

                            <textarea
                                name="description"
                                placeholder="Description"
                                className="text-dark"
                                value={product.description}
                                onChange={handleChange}
                            />

                            <input type="file" onChange={handleImage} />

                            {preview && (
                                <img src={preview} alt="preview" className="preview-img" />
                            )}

                        </div>

                    </div>

                    <button
                        className="mt-3 product-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : editMode
                                ? "Update Product"
                                : <><PlusCircle size={18} /> Add Product</>
                        }
                    </button>

                </div>

                {/* ================= PRODUCTS ================= */}
                <div className="product-grid">

                    {products.length === 0 ? (
                        <p className="no-data">No products found</p>
                    ) : (

                        products.map((item) => (
                            <div className="luxury-card" key={item._id}>

                                <div className="card-img-box">
                                    <img
                                        src={`${API}/product/${item.image}`}
                                        alt={item.name}
                                    />
                                    {item.discountBadge && (
                                        <span className="gold-badge">
                                            {item.discountBadge}
                                        </span>
                                    )}
                                </div>

                                <div className="card-info">

                                    <p>{item.category}</p>
                                    <h4>{item.name}</h4>

                                    <div className="price-display">
                                        ₹{item.salePrice}
                                        <span>₹{item.originalPrice}</span>
                                    </div>

                                    <div className="card-actions">

                                        <button onClick={() => editProduct(item)}>
                                            <Pencil size={16} />
                                        </button>

                                        <button onClick={() => deleteProduct(item._id)}>
                                            <Trash2 size={16} />
                                        </button>

                                    </div>

                                </div>

                            </div>
                        ))

                    )}

                </div>

            </div>
        </div>
    );
}