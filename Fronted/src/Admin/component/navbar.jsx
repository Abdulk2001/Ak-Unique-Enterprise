import React, { useEffect, useState } from 'react'
import { FaBars } from "react-icons/fa";
import '../asset/css/admin_style.css'

export default function Navbar({ toggleSidebar }) {

    const [adminName, setAdminName] = useState("");

    useEffect(() => {
        const adminData = JSON.parse(localStorage.getItem("admin"));

        if (adminData && adminData.Name) {
            const firstName = adminData.Name.split(" ")[0];
            setAdminName(firstName);
        }
    }, []);

    return (
        <div className="topbar">

            {/* MENU BUTTON */}
            <FaBars
                className="menu-btn"
                onClick={toggleSidebar}
            />

            {/* TITLE */}
            <div className="topbar-text">
                <h2>Dashboard</h2>
                <h4>Welcome Back, {adminName}</h4>
            </div>

        </div>
    )
}