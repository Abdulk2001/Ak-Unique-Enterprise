import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './component/navbar'
import Navbar2 from './component/navbar2';

export default function OTPGenerator() {

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const email = localStorage.getItem("resetEmail");

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleVerify = async () => {

        const finalOtp = otp.join("");

        if (finalOtp.length !== 6) {
            setError("Enter full OTP");
            return;
        }

        try {
            const res = await fetch("https://ak-unique-enterprise.onrender.comverify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: finalOtp })
            });

            const data = await res.json();

            if (res.status === 400) {
                setError(data.message);
            } else {
                alert("OTP Verified ✅");

                // 🔥 IMPORTANT: next page redirect
                navigate("/resetPassword");
            }

        } catch {
            setError("Server error");
        }
    };

    return (
        <>
            <Navbar />
            <Navbar2 />

            <div className='otp-bg'>
                <div className="main-div-login">
                    <div className="custom-login-div">

                        <h1 className='custom-text'>AK UNIQUE ENTERPRISE</h1>

                        <h2 className='text-center'>Email Verification</h2>

                        <p className='text-center text-secondary'>
                            Enter the 6-digit code sent to your email.
                        </p>

                        <div className='custom-otp-main-input'>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    className="otp-input"
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                />
                            ))}
                        </div>

                        {error && <p style={{ color: "red" }}>{error}</p>}

                        <div className='d-flex justify-content-center mt-3'>
                            <button
                                className='custom-btn-login px-5'
                                onClick={handleVerify}
                            >
                                VERIFY
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}