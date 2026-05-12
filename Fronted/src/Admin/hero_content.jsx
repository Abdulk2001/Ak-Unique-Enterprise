import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import axios from 'axios';
import './asset/css/admin_style.css';

const AdminHeroManager = () => {
  const navigate = useNavigate();

  // ================= AUTH =================
  useEffect(() => {
    const admin = localStorage.getItem("admin");

    if (!admin) {
      navigate("/AdminLogin");
    }

  },);

  const [heroData, setHeroData] = useState({
    headerText: "",
    headline: "",
    subHeadline: "",
    discountTag: ""
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await axios.get("https://ak-unique-enterprise.onrender.comget-hero");

      if (res.data.hero) {
        setHeroData({
          headerText: res.data.hero.headerText || "",
          headline: res.data.hero.headline || "",
          subHeadline: res.data.hero.subHeadline || "",
          discountTag: res.data.hero.discountTag || ""
        });

        if (res.data.hero.image) {
          setImagePreview(`https://ak-unique-enterprise.onrender.comheroSection/${res.data.hero.image}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setHeroData({ ...heroData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("headerText", heroData.headerText);
    formData.append("headline", heroData.headline);
    formData.append("subHeadline", heroData.subHeadline);
    formData.append("discountTag", heroData.discountTag);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.post("https://ak-unique-enterprise.onrender.comsave-hero", formData);
      alert("Hero Updated ✅");
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Error ❌");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">

        {/* HEADER */}
        <div className="admin-header">
          <button className="back-nav-btn" onClick={() => navigate("/AdminDashboard")}>
            <ArrowLeft size={18} /> Back
          </button>
          <h2>Update Hero Section</h2>
        </div>

        <div className="form-grid">

          {/* LEFT */}
          <div className="inputs-section">

            {/* TOP HEADER TEXT */}
            <div className="form-group">
              <label>Top Header Text</label>
              <input
                name="headerText"
                value={heroData.headerText}
                onChange={handleChange}
                placeholder="e.g. Free shipping on all orders"
              />
            </div>

            <div className="form-group">
              <label>Main Headline</label>
              <input
                name="headline"
                value={heroData.headline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Sub-Headline</label>
              <textarea
                name="subHeadline"
                value={heroData.subHeadline}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Discount Tag</label>
              <input
                name="discountTag"
                value={heroData.discountTag}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* RIGHT */}
          <div className="upload-section">
            <label>Hero Image</label>

            <div className="image-upload-box">

              {imagePreview ? (
                <div className="preview-container">
                  <img src={imagePreview} alt="preview" />
                  <button
                    className="remove-img"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="upload-placeholder">
                  <Upload size={30} />
                  <span>Click to upload</span>
                  <input type="file" onChange={handleImageChange} hidden />
                </label>
              )}

            </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="admin-actions">
          <button className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>

          <button className="save-btn" onClick={handleSave}>
            Update Hero Section
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminHeroManager;