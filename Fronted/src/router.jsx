import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import NoPage from './NoPage'
import Login from './login'
import Register from './register'
import ForgotPassword from './forgot_password'
import OtpGenrater from './otp_genrater'
import Profile from './profile'
import Cetegory from './cetegory'
import Adminlogin from './Admin/admin_login'
import AdminDashboard from './Admin/admin_deshboard'
import UserData from './Admin/users'
import AdminCategory from './Admin/category'
import AdminProduct from './Admin/product'
import UpdatePassword from './update_password'
import UpdateProfile from './update_profile'
import AdminSettings from './Admin/admin_setting'
import HeroContent from './Admin/hero_content'
import ProductDetail from './product_detail'
import ContactSupport from './contact_support'
import CustomerRequests from './Admin/customer_request'
import CartPage from './cart'
import ShopPage from './shop'
import Categories from './Categories'
import BuyNowPage from './buy'
import OrderSuccess from './order'
import { useEffect } from 'react'
import AdminOrdersPage from './Admin/order'
import OrderHistory from './order_history'

export default function Router() {
    const [MyCart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Auto save cart whenever updated
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(MyCart));
    }, [MyCart]);

    // Add to Cart
    const addtocart = (product) => {
        const user = localStorage.getItem("user");

        if (!user) {
            alert("Please login first");
            return;
        }

        const exists = MyCart.find(
            (item) => item._id === product._id
        );

        let updatedCart;

        if (exists) {
            updatedCart = MyCart.map((item) =>
                item._id === product._id
                    ? {
                        ...item,
                        qty: (item.qty || 1) + 1,
                    }
                    : item
            );
        } else {
            updatedCart = [
                ...MyCart,
                {
                    ...product,
                    qty: 1,
                },
            ];
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        alert("Product added to cart");
    };

return (
    <BrowserRouter>
        <Routes>
            <Route index element={<Home />} />
            <Route path='*' element={<NoPage />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Register' element={<Register />} />
            <Route path='/forgotPassword' element={<ForgotPassword />} />
            <Route path='/otpGenrater' element={<OtpGenrater />} />
            <Route path='/resetPassword' element={<UpdatePassword />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/Category' element={<Cetegory />} />
            <Route path='/AdminLogin' element={<Adminlogin />} />
            <Route path='/AdminDashboard' element={<AdminDashboard />} />
            <Route path='/AdminDashboard/Users' element={<UserData />} />
            <Route path='/AdminDashboard/Categories' element={<AdminCategory />} />
            <Route path='/AdminDashboard/Products' element={<AdminProduct />} />
            <Route path='/updateProfile' element={<UpdateProfile />} />
            <Route path='/AdminDashboard/Settings' element={<AdminSettings />} />
            <Route path='/AdminDashboard/HeroContent' element={<HeroContent />} />
            <Route path='/product-detail/:id' element={<ProductDetail AddToCart={addtocart} />} />
            <Route path='/contact-support' element={<ContactSupport />} />
            <Route path='/AdminDashboard/CustomerRequests' element={<CustomerRequests />} />
            <Route path='/shop' element={<ShopPage />} />
            <Route path='/cart' element={<CartPage MyCart={MyCart} setCart={setCart} />} />
            <Route path='/Category/:categoryName' element={<Categories />} />
            <Route path='/Buy' element={<BuyNowPage MyCart={MyCart} setCart={setCart} />} />
            <Route path='/OrderSuccess' element={<OrderSuccess setCart={setCart} />} />
            <Route path='/AdminDashboard/Orders' element={<AdminOrdersPage />} />
            <Route path='/OrderHistory' element={<OrderHistory />} />
        </Routes>
    </BrowserRouter>
);
}




