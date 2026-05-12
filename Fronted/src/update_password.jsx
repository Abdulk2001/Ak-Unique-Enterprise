import React, { useState } from 'react'
import Navbar from './component/navbar'
import Navbar2 from './component/navbar2'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleReset = async () => {

        if (!password || !confirm) {
            setError("All fields required");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        const email = localStorage.getItem("resetEmail");

        setLoading(true);

        try {
            const res = await fetch("https://ak-unique-enterprise-production-fe92.up.railway.app/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword: password })
            });

            const data = await res.json();

            if (res.status === 400) {
                setError(data.message);
            } else {
                alert("Password Updated ✅");
                navigate("/login");
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
            <div className="reset-bg">

                <div className="reset-card">

                    <div className="reset-header">
                        <h1>Reset Password</h1>
                        <p>Create a strong new password</p>
                    </div>

                    <div className="reset-form">

                        <input
                            type="password"
                            placeholder="Enter New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />

                        {error && <p className="error-text">{error}</p>}

                        <button onClick={handleReset} disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>

                    </div>

                </div>

            </div>
        </>
    )
}