import React, { useState } from "react";
import axios from "axios";
import Navbar from "./component/navbar";
import Navbar2 from "./component/navbar2";
import Footer from "./component/footer";

export default function SupportPage() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("https://ak-unique-enterprise.onrender.comsupport-request", form);

            alert("Your request has been sent successfully!");

            setForm({
                name: "",
                email: "",
                subject: "",
                message: ""
            });

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />
            <Navbar2 />

            <div className="support-wrapper">
                <div className="support-card">

                    {/* LEFT INFO */}
                    <div className="support-info">
                        <h2>Customer Support</h2>
                        <p>
                            Need help? Our support team is available 24/7.
                        </p>

                        <div className="info-box">
                            <p>📧 AbdulcodeKarim.com</p>
                            <p>📞 +91 7414852091</p>
                            <p>⏰ 24/7 Support</p>
                        </div>
                    </div>

                    {/* FORM */}
                    <form className="support-form" onSubmit={handleSubmit}>

                        <h3>Send Request</h3>

                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="message"
                            placeholder="Write your issue..."
                            value={form.message}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">Send Message</button>

                    </form>

                </div>
            </div>

            <Footer />
        </>
    );
}