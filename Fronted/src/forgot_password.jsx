    import React, { useState } from 'react'
    import { useNavigate } from 'react-router-dom'
    import Navbar from './component/navbar'
    import Navbar2 from './component/navbar2';

    export default function ForgotPassword() {

        const [email, setEmail] = useState("");
        const [error, setError] = useState("");
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();

        const handleSendOTP = async () => {

            if (!email) {
                setError("Email required");
                return;
            }

            setLoading(true);

            try {
                const res = await fetch("http://localhost:5000/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });

                const data = await res.json();

                if (res.status === 400) {
                    setError(data.message);
                } else {
                    alert("OTP sent ✅");

                    localStorage.setItem("resetEmail", email);
                    navigate("/otpGenrater");
                }

            } catch {
                setError("Server error");
            }

            setLoading(false);
        };

        return (
            <>
                <Navbar />
                <Navbar2 />

                <div className='forgot-password-bg'>
                    <div className="main-div-login">

                        <div className="custom-login-div">

                            <h1 className='custom-text'>AK UNIQUE ENTERPRISE</h1>
                            <br />

                            <h2 className='text-center'>Email Verification</h2>

                            <div className='custom-main-input'>

                                <input
                                    type="email"
                                    className="custom-input"
                                    placeholder="EMAIL ADDRESS"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                {error && (
                                    <p style={{ color: "red", fontSize: "14px" }}>
                                        {error}
                                    </p>
                                )}

                                <button
                                    className='custom-btn-login'
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "SEND OTP"}
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            </>
        )
    }