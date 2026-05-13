import React, { useState } from 'react'
import axios from 'axios'
import Navbar from './component/navbar'
import Navbar2 from './component/navbar2'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = () => {

        axios.post("https://ak-unique-enterprise.onrender.com/login", { email, password })
            .then((res) => {

                const userData = res.data.user;

                // console.log(userData);

                localStorage.setItem("user", JSON.stringify(userData));
                // localStorage.setItem("user",userData);



                alert(res.data.message);
                navigate("/");
            })
            .catch((err) => {
                alert(err.response?.data?.message || "Server error");
            });
    }

    return (
        <>
            <Navbar />
            <Navbar2 />

            <div className='login-bg'>
                <div className="main-div-login">
                    <div className="custom-login-div">

                        <h1 className='custom-text'>AK UNIQUE ENTERPRISE</h1>

                        <h2 className='text-center'>LOGIN</h2>
                        <p className='text-center'>Access Your Premium Collection</p>

                        <div className='custom-main-input'>

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

                            <button
                                className='custom-btn-login'
                                onClick={handleLogin}
                            >
                                LOGIN
                            </button>

                        </div>

                        <div className='custom-link-div'>
                            <Link to='/forgotPassword'>Forget Password?</Link>
                            <Link to='/Register'>Create Account</Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}