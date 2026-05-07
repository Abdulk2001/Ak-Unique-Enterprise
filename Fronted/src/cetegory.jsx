import React, { useEffect, useState } from 'react'
import Navbar from './component/navbar'
import Navbar2 from './component/navbar2'
import Footer from './component/footer'
import './asset/css/style.css'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRightLong } from "react-icons/fa6";
import axios from 'axios'

export default function Category() {

    const [categories, setCategories] = useState([]);
    const BASE_URL = "http://localhost:5000";
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    },);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/get-category`);
            setCategories(res.data.categories);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Navbar />
            <Navbar2 />

            {/* HEADER */}
            <div className="category-header py-5 bg-light">
                <div className="container">

                    {/* BACK BUTTON */}

                    {/* Breadcrumb */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <nav aria-label="breadcrumb">
                                <p className="mb-0 d-flex flex-wrap align-items-center gap-2">
                                    <Link to="/" className="text-decoration-none text-secondary">
                                        Home
                                    </Link>

                                    <span>/</span>

                                    <Link to="/category" className="text-decoration-none text-secondary">
                                        Categories
                                    </Link>

                                    <span>/</span>

                                    <span className="fw-bold text-dark">
                                        All Collections
                                    </span>
                                </p>
                            </nav>
                        </div>
                    </div>

                    {/* HERO */}
                    <div className="row align-items-center">

                        <div className="col-lg-4 d-none d-lg-block"></div>

                        <div className="col-lg-4 col-md-12 text-center mb-4 mb-lg-0">
                            <h1 className="fw-bold display-5 mb-0">
                                Our Collections
                            </h1>
                        </div>

                        <div className="col-lg-4 col-md-12 text-center text-lg-start">
                            <p className="lead text-secondary mb-0">
                                Browse our complete collection of premium products crafted
                                for quality and style.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
                    <button
                        className="category-back-btn2 mb-3"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

            {/* CATEGORY GRID */}
            <div className='main-cetegory py-5'>
                <div className='container custom-cetegory-grid'>

                    {categories.length === 0 ? (
                        <div className="text-center w-100 py-5">
                            <h5>No categories available</h5>
                        </div>
                    ) : (
                        categories.map((item) => (
                            <div className='custom-card' key={item._id}>

                                <img
                                    src={
                                        item.image
                                            ? `${BASE_URL}/category/${item.image}`
                                            : "https://via.placeholder.com/400x500"
                                    }
                                    alt={item.name}
                                />

                                <div className='custom-inner-card'>
                                    <h2>{item.name}</h2>
                                    <p>{item.desc}</p>

                                    <Link to={`/category/${item.name}`}>
                                        Explore Now{" "}
                                        <FaArrowRightLong className='move-right' />
                                    </Link>
                                </div>

                            </div>
                        ))
                    )}

                </div>
            </div>

            <Footer />
        </>
    )
}