import React, { useEffect, useState } from 'react'
import Navbar from './component/navbar'
import Navbar2 from './component/navbar2';
import { useNavigate } from 'react-router-dom'

export default function Profile() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // ✅ Load user
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/Login");
        }
    }, [navigate]);

    // ✅ Logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/Login");
    };

    // ✅ Delete Account (API call)
    const handleDelete = async () => {

        const confirmDelete = window.confirm("Are you sure you want to delete your account?");
        if (!confirmDelete) return;

        try {
            const res = await fetch("https://ak-unique-enterprise.onrender.com/delete-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: user.Email })
            });

            const data = await res.json();

            alert(data.message);

            localStorage.removeItem("user");
            navigate("/Register");

        } catch (err) {
            alert("Server error");
        }
    };

    // ✅ Navigation
    const changePassword = () => {
        navigate("/resetPassword");
    };

    const handleEditProfile = () => {
        navigate("/updateProfile");
    };

    if (!user) {
        return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
    }

    return (
        <>
            <Navbar />
            <Navbar2 />
            <div className="profile-bg">

                <div className="profile-container">

                    {/* LEFT CARD */}
                    <div className="profile-card">

                        <div className="profile-img">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnVvDx9Kezwg0D77WzdAUzjOEHf1WEqQ3-fA&s"
                                alt="profile"
                            />
                        </div>

                        <h3>{user.Name}</h3>
                        <p>{user.Email}</p>

                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>

                        <button className="delete-btn" onClick={handleDelete}>
                            Delete Account
                        </button>
                    </div>

                    {/* RIGHT DETAILS */}
                    <div className="profile-details">

                        <h2>Account Overview</h2>

                        <div className="profile-info">
                            <p><strong>Full Name:</strong> {user.Name}</p>
                            <p><strong>Email:</strong> {user.Email}</p>
                            <p><strong>Phone:</strong> {user.Mobile}</p>
                            <p><strong>Address:</strong> {user.Address}</p>
                        </div>

                        <div className="profile-actions">
                            <button className="edit-btn" onClick={handleEditProfile}>
                                Edit Profile
                            </button>

                            <button className="secondary-btn" onClick={changePassword}>
                                Change Password
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}