import React, { useEffect, useState } from 'react'
import Navbar from './component/navbar'
import { useNavigate } from 'react-router-dom'

export default function EditProfile() {

    const [user, setUser] = useState({
        Name: "",
        Email: "",
        Mobile: "",
        Address: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            const data = await res.json();

            if (res.status === 400) {
                alert(data.message);
            } else {
                alert("Profile Updated ✅");

                // update localStorage
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/profile");
            }

        } catch {
            alert("Server error");
        }

        setLoading(false);
    };

    return (
        <>
            <Navbar />

            <div className='login-bg'>
                <div className="main-div-login">

                    <div className="custom-login-div">

                        <h1 className='custom-text'>AK UNIQUE ENTERPRISE</h1>
                        <h2 className='text-center'>Edit Profile</h2>

                        <div className='custom-main-input'>

                            <input
                                type="text"
                                name="Name"
                                className="custom-input"
                                placeholder="Full Name"
                                value={user.Name}
                                onChange={handleChange}
                            />

                            <input
                                type="email"
                                name="Email"
                                className="custom-input"
                                disabled
                                value={user.Email}
                            />

                            <input
                                type="tel"
                                name="Mobile"
                                className="custom-input"
                                placeholder="Phone Number"
                                value={user.Mobile}
                                onChange={handleChange}
                            />

                            <textarea
                                name="Address"
                                className="custom-input"
                                placeholder="Address"
                                value={user.Address}
                                onChange={handleChange}
                            />

                            <button
                                className='custom-btn-login'
                                onClick={handleUpdate}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}