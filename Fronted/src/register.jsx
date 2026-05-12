import React, { useState } from 'react'
import axios from 'axios'
import Navbar from './component/navbar'
import Navbar2 from './component/navbar2'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = () => {

        if (!name || !email || !password || !phone || !address) {
            setError("All fields are required");
            return;
        }

        setError("");
        setLoading(true);

        axios.post("https://ak-unique-enterprise.onrender.comregister", {
            name,
            email,
            password,
            phone,
            address
        })
        .then((res) => {
            alert(res.data.message);
            navigate("/Login");
        })
        .catch((err) => {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError("Server not responding");
            }
        })
        .finally(() => setLoading(false));
    }

    return (
        <>
            <Navbar />
            <Navbar2 />
            <div className='register-bg'>
                <div className="main-div-login register">
                    <div className="custom-login-div">

                        <h1 className='custom-text'>AK UNIQUE ENTERPRISE</h1>

                        <h2 className='text-center'>Create Account</h2>
                        <p className='text-center'>Join Premium Shopping Experience</p>

                        <div className='custom-main-input'>

                            <input
                                type="text"
                                className="custom-input"
                                placeholder="FULL NAME"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <input
                                type="email"
                                className="custom-input"
                                placeholder="EMAIL ADDRESS"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                className="custom-input"
                                placeholder="PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <input
                                type="tel"
                                className="custom-input"
                                placeholder="PHONE NUMBER"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                maxLength={10}
                            />

                            <textarea
                                className='custom-input'
                                placeholder='ADDRESS'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />

                            {error && <p style={{ color: "red" }}>{error}</p>}

                            <button
                                className='custom-btn-login'
                                onClick={handleRegister}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "REGISTER"}
                            </button>

                        </div>

                        <div className='custom-link-div'>
                            <p>Already have an account?</p>
                            <Link to='/Login'>Login</Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}