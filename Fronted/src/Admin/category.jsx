import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./asset/css/admin_style.css";
import Slidebar from "./component/slidebar";
import Navbar from "./component/navbar";

const API = "https://ak-unique-enterprise-production-fe92.up.railway.app";

export default function AdminCategory() {

    const [open, setOpen] = useState(false);

    const [category, setCategory] = useState({
        name: "",
        desc: "",
        image: null
    });

    const [imagePreview, setImagePreview] = useState("");
    const [categories, setCategories] = useState([]);

    const fileRef = useRef(); // 🔥 file reset ke liye

    const navigate = useNavigate();

    // ================= AUTH =================
    useEffect(() => {
        const admin = localStorage.getItem("admin");

        if (!admin) {
            navigate("/AdminLogin");
        }

        fetchCategories();
    }, []);

    // ================= FETCH =================
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API}/get-category`);
            setCategories(res.data.categories);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= INPUT =================
    const handleChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    };

    // ================= IMAGE =================
    const handleImage = (e) => {
        const file = e.target.files[0];

        if (file) {
            setCategory({ ...category, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // ================= ADD CATEGORY =================
    const addCategory = async (e) => {

    if (e) e.preventDefault();

    if (!category.name || !category.desc || !category.image) {
        alert("All fields required");
        return;
    }

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("desc", category.desc);
    formData.append("image", category.image);

    try {
        await axios.post(`${API}/add-category`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        alert("Category Added ✅");

        setCategory({
            name: "",
            desc: "",
            image: null
        });

        setImagePreview("");

        if (fileRef.current) {
            fileRef.current.value = "";
        }

        fetchCategories();

    } catch (err) {
        console.log("FULL ERROR:", err.response?.data || err.message);
        alert("Error adding category ❌");
    }
};

    // ================= DELETE =================
    const deleteCategory = async (id) => {
        if (window.confirm("Delete category?")) {
            try {
                await axios.delete(`${API}/delete-category/${id}`);
                fetchCategories();
            } catch (err) {
                console.log(err);
                alert("Delete failed ❌");
            }
        }
    };

    return (
        <div className="dashboard">

            <Slidebar open={open} setOpen={setOpen} />

            <div className="main">

                <Navbar toggleSidebar={() => setOpen(!open)} />

                <h2>Category Management</h2>

                {/* ================= FORM ================= */}
                <div className="category-form-advanced">

                    <input
                        type="text"
                        name="name"
                        placeholder="Category Name"
                        className="text-black"
                        value={category.name}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="desc"
                        placeholder="Description"
                        className="text-black"
                        value={category.desc}
                        onChange={handleChange}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        onChange={handleImage}
                    />

                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="preview"
                            className="preview-img"
                        />
                    )}

                    <button onClick={addCategory}>
                        + Add Category
                    </button>

                </div>

                {/* ================= GRID ================= */}
                <div className="category-grid">

                    {categories.length === 0 ? (
                        <p>No categories added</p>
                    ) : (
                        categories.map((item) => (
                            <div className="category-card-admin" key={item._id}>

                                <img
                                    src={
                                        item.image
                                            ? `${API}/category/${item.image}` // 🔥 FIXED PATH
                                            : "https://via.placeholder.com/150"
                                    }
                                    alt="category"
                                />

                                <h4>{item.name}</h4>
                                <p>{item.desc}</p>

                                <button
                                    className="delete-btn"
                                    onClick={() => deleteCategory(item._id)}
                                >
                                    Delete
                                </button>

                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
}