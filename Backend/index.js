require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const { type } = require("os");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ================= STATIC =================
app.use("/category", express.static("category"));
app.use("/heroSection", express.static("heroSection"));
app.use("/product", express.static("product"));

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));



// ================= USER MODEL =================
const userSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    Mobile: String,
    Address: String,
    otp: String,
    status: {
        type: String,
        default: "active"
    }
});

const userCollection = mongoose.model("user", userSchema, "users");

// ================= PRODUCT MODEL =================
const productsSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    salePrice: { type: Number, required: true },
    originalPrice: Number,
    discountBadge: { type: String, default: "" },
    description: { type: String, trim: true },

    image: { type: String, required: true },

    stock: {
        type: String,
        enum: ["In Stock", "Out of Stock"],
        default: "In Stock"
    },

    status: { type: String, default: "active" }

}, { timestamps: true });

const productsCollection = mongoose.model("products", productsSchema, "products");


// ================= HERO MODEL =================
const heroSchema = new mongoose.Schema({
    headerText: String,
    headline: String,
    subHeadline: String,
    discountTag: String,
    image: String
}, { timestamps: true });

const heroCollection = mongoose.model("hero", heroSchema, "HeroSection");

// ================= ADMIN MODEL =================
const adminSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    Role: String,
    status: {
        type: String,
        default: "active"
    }
});

// 🔥 IMPORTANT FIX
const adminCollection = mongoose.model("admin", adminSchema, "admin");

// ================= CATEGORY MODEL =================
const categorySchema = new mongoose.Schema({
    name: String,
    desc: String,
    image: String
}, { timestamps: true });

const categoryCollection = mongoose.model("category", categorySchema, "categories");

// ================= CUSTOMER SUPPORT MODEL =================

const customerSupportSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const customerSupportCollection = mongoose.model(
    "CustomerSupport",
    customerSupportSchema,
    "CustomerSupport"
);

// ================= CART MODEL =================
const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    productId: {
        type: String,
        required: true
    },

    name: String,
    salePrice: Number,
    originalPrice: Number,
    image: String,
    category: String,
    description: String,

    quantity: {
        type: Number,
        default: 1
    }

}, { timestamps: true });

const cartCollection = mongoose.model("cart", cartSchema, "cart");


// ================= ORDER MODEL  =================

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },

        MyCart: [
            {
                productId: String,
                name: String,
                salePrice: Number,
                originalPrice: Number,
                quantity: Number,
                image: String,
                category: String,
                description: String,
            },
        ],

        customerInfo: {
            fullName: String,
            phone: String,
            email: String,
            address: String,
            city: String,
            state: String,
            pincode: String,
        },

        paymentInfo: {
            method: String,
            status: String,
            transactionId: String,
        },

        pricing: {
            subtotal: Number,
            deliveryCharge: Number,
            codCharge: Number,
            gstAmount: Number,
            grandTotal: Number,
        },

        orderStatus: {
            type: String,
            default: "Processing",
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const orders =
    mongoose.models.orders || mongoose.model("orders", orderSchema);


// ================= MULTER (PRODUCT) - FIXED =================
const productStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "product/"), // ✅ FIXED FOLDER NAME
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const productUpload = multer({ storage: productStorage });


// ================= MULTER =================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "category/"); // folder name small
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.get("/", (req, res) => {
    console.log("Server is working...");
});

// ================= ADD CATEGORY =================
app.post("/add-category", upload.single("image"), async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: "Image required" });
        }

        const newCategory = new categoryCollection({
            name: req.body.name,
            desc: req.body.desc,
            image: req.file.filename
        });

        await newCategory.save();

        res.status(200).json({
            message: "Category Added",
            category: newCategory
        });

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});

// ================= GET CATEGORY =================
app.get("/get-category", async (req, res) => {
    try {
        const categories = await categoryCollection.find().sort({ createdAt: -1 });
        res.status(200).json({ categories });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ================= DELETE CATEGORY =================
app.delete("/delete-category/:id", async (req, res) => {
    try {
        await categoryCollection.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= PRODUCT APIs =================
app.post("/add-product", productUpload.single("image"), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: "Image required" });
        }

        const newProduct = new productsCollection({
            ...req.body,
            image: req.file.filename
        });

        await newProduct.save();

        res.json({
            message: "Product Added",
            product: newProduct
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= GET PRODUCTS (IMPORTANT - ADD THIS) =================
app.get("/get-products", async (req, res) => {
    try {
        const products = await productsCollection.find().sort({ createdAt: -1 });
        res.json({ products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ================= DELETE PRODUCT (IMPORTANT - ADD THIS) =================
app.delete("/delete-product/:id", async (req, res) => {
    try {
        await productsCollection.findByIdAndDelete(req.params.id);
        res.json({ message: "Product Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ================= UPDATE PRODUCT =================
app.put("/update-product/:id", productUpload.single("image"), async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        await productsCollection.findByIdAndUpdate(req.params.id, updateData);

        res.json({ message: "Product Updated" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ================= EMAIL CONFIG =================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// ================= REGISTER =================
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const exists = await userCollection.findOne({
            $or: [{ Email: email }, { Mobile: phone }]
        });

        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new userCollection({
            Name: name,
            Email: email,
            Password: password,
            Mobile: phone,
            Address: address
        });

        await user.save();

        res.status(200).json({ message: "Register Success" });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= USER LOGIN =================
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userCollection.findOne({
            Email: { $regex: new RegExp("^" + email + "$", "i") }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.status === "deleted") {
            return res.status(400).json({
                message: "Account is deactivated"
            });
        }

        if (user.Password !== password) {
            return res.status(400).json({ message: "Wrong password" });
        }

        res.status(200).json({
            message: "Login Success",
            user: {
                _id: user._id.toString(),
                Name: user.Name,
                Email: user.Email,
                Mobile: user.Mobile,
                Address: user.Address
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ================= ADMIN LOGIN =================
app.post("/AdminLogin", async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await adminCollection.findOne({
            Email: { $regex: new RegExp("^" + email + "$", "i") }
        });

        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        if (admin.status === "deleted") {
            return res.status(400).json({ message: "Admin account disabled" });
        }

        if (admin.Password !== password) {
            return res.status(400).json({ message: "Wrong password" });
        }

        res.status(200).json({
            message: "Admin Login Success",
            admin: {
                Name: admin.Name,
                Email: admin.Email,
                Role: admin.Role
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= UPDATE PROFILE =================
app.post("/update-profile", async (req, res) => {
    try {
        const { Name, Email, Mobile, Address } = req.body;

        const user = await userCollection.findOne({ Email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        user.Name = Name;
        user.Mobile = Mobile;
        user.Address = Address;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= DELETE ACCOUNT =================
app.post("/delete-account", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userCollection.findOne({ Email: email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        user.status = "deleted";
        await user.save();

        res.status(200).json({
            message: "Account deactivated successfully"
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= ADMIN UPDATE =================
app.post("/admin-update", async (req, res) => {
    try {
        const { Email, NewEmail, Name, Password } = req.body;

        const admin = await adminCollection.findOne({ Email });

        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        admin.Name = Name;

        // 🔥 email update
        if (NewEmail) {
            admin.Email = NewEmail;
        }

        if (Password) {
            admin.Password = Password;
        }

        await admin.save();

        res.status(200).json({
            message: "Admin updated successfully",
            admin
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= HERO MULTER =================
const heroStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "heroSection/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const heroUpload = multer({ storage: heroStorage }); // ✅ ADD THIS


// ================= SAVE / UPDATE HERO =================
app.post("/save-hero", heroUpload.single("image"), async (req, res) => {
    try {

        let hero = await heroCollection.findOne();

        if (hero) {
            hero.headerText = req.body.headerText;
            hero.headline = req.body.headline;
            hero.subHeadline = req.body.subHeadline;
            hero.discountTag = req.body.discountTag;

            if (req.file) {
                hero.image = req.file.filename;
            }

            await hero.save();
            return res.json({ message: "Hero Updated", hero });
        }

        const newHero = new heroCollection({
            headerText: req.body.headerText,
            headline: req.body.headline,
            subHeadline: req.body.subHeadline,
            discountTag: req.body.discountTag,
            image: req.file ? req.file.filename : ""
        });

        await newHero.save();

        res.json({ message: "Hero Created", hero: newHero });

    } catch (err) {
        console.log("HERO ERROR 👉", err);
        res.status(500).json({ message: err.message });
    }
});


// ================= GET HERO =================
app.get("/get-hero", async (req, res) => {
    try {
        const hero = await heroCollection.findOne();
        res.json({ hero });
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= GET SINGLE PRODUCT =================
app.get("/get-product/:id", async (req, res) => {
    try {
        const product = await productsCollection.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ product });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/support-request", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newRequest = new customerSupportCollection({
            name,
            email,
            subject,
            message
        });

        await newRequest.save();

        res.status(200).json({
            message: "Support request submitted successfully"
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.get("/get-support-requests", async (req, res) => {
    try {
        const requests = await customerSupportCollection
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json({ requests });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.put("/support-request/:id", async (req, res) => {
    try {
        const { status } = req.body;

        await customerSupportCollection.findByIdAndUpdate(
            req.params.id,
            { status }
        );

        res.status(200).json({
            message: "Status updated"
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.delete("/support-request/:id", async (req, res) => {
    try {
        await customerSupportCollection.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Request deleted successfully"
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


app.put("/user-status/:id", async (req, res) => {
    try {
        const { status } = req.body;

        const user = await userCollection.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.status(200).json({
            message: "User status updated",
            user
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.get("/get-users", async (req, res) => {
    try {
        const users = await userCollection.find().sort({ _id: -1 });

        res.status(200).json({ users });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ================= FORGOT PASSWORD =================
app.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userCollection.findOne({ Email: email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // OTP generate
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        await user.save();

        // Email send
        const mailOptions = {
            from: "abdultutorstation@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is: ${otp}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Email not sent" });
            }

            res.status(200).json({
                message: "OTP sent successfully"
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await userCollection.findOne({
            Email: { $regex: new RegExp("^" + email + "$", "i") }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // ❌ WRONG OTP
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // ✅ OTP MATCH
        user.otp = ""; // clear OTP after success
        await user.save();

        res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await userCollection.findOne({
            Email: { $regex: new RegExp("^" + email + "$", "i") }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // OPTIONAL: OTP check safety (recommended)
        if (user.otp !== "") {
            return res.status(400).json({ message: "OTP not verified" });
        }

        user.Password = newPassword;
        await user.save();

        res.status(200).json({
            message: "Pa    ssword updated successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});




// ================= PLACE ORDER API (REPLACE OLD /order API) =================

// ================= PLACE ORDER API =================

app.post("/order", async (req, res) => {
    try {

        const {
            userId,
            MyCart,
            customerInfo,
            paymentInfo,
            pricing
        } = req.body;

        // ================= VALIDATION =================
        if (
            !userId ||
            !Array.isArray(MyCart) ||
            MyCart.length === 0 ||
            !customerInfo
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // ================= SAFE NUMBERS =================
        const subtotal = Number(pricing?.subtotal || 0);

        const deliveryCharge = Number(
            pricing?.deliveryCharge || 0
        );

        const codCharge = Number(
            pricing?.codCharge || 0
        );

        const gstAmount = Number(
            pricing?.gstAmount || 0
        );

        const grandTotal = Number(
            pricing?.grandTotal || 0
        );

        // ================= CREATE ORDER =================
        const newOrder = new orders({
            userId,

            MyCart,

            customerInfo,

            paymentInfo: {
                method:
                    paymentInfo?.method || "cod",

                status:
                    paymentInfo?.status ||
                    "Pending",

                transactionId:
                    paymentInfo?.transactionId ||
                    "N/A"
            },

            pricing: {
                subtotal,
                deliveryCharge,
                codCharge,
                gstAmount,
                grandTotal
            },

            orderStatus: "Pending"
        });

        // ================= SAVE ORDER =================
        const savedOrder = await newOrder.save();

        // ================= CLEAR CART =================
        await cartCollection.deleteMany({
            userId
        });

        // ================= SEND SUCCESS RESPONSE =================
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: savedOrder
        });

        // =====================================================
        // EMAIL SEND (BACKGROUND)
        // =====================================================

        try {

            if (customerInfo?.email) {

                const itemRows = MyCart.map(
                    (item) => `
<tr>
    <td style="padding:8px;border:1px solid #ddd;">
        ${item.name}
    </td>

    <td style="padding:8px;border:1px solid #ddd;">
        ${item.quantity}
    </td>

    <td style="padding:8px;border:1px solid #ddd;">
        ₹${item.salePrice}
    </td>
</tr>
`
                ).join("");

                await transporter.sendMail({

                    from: process.env.EMAIL_USER,

                    to: customerInfo.email,

                    subject: "Order Confirmation",

                    html: `
<div style="font-family:Arial;padding:20px;">

    <h2>
        Thank You For Your Order
    </h2>

    <p>
        Hello ${customerInfo.fullName},
    </p>

    <p>
        Your order has been placed successfully.
    </p>

    <h3>
        Order Details
    </h3>

    <table
        style="
            border-collapse:collapse;
            width:100%;
        "
    >
        <tr>
            <th style="padding:10px;border:1px solid #ddd;">
                Product
            </th>

            <th style="padding:10px;border:1px solid #ddd;">
                Qty
            </th>

            <th style="padding:10px;border:1px solid #ddd;">
                Price
            </th>
        </tr>

        ${itemRows}

    </table>

    <h3 style="margin-top:20px;">
        Pricing
    </h3>

    <p>
        Subtotal:
        ₹${subtotal}
    </p>

    <p>
        Delivery Charge:
        ₹${deliveryCharge}
    </p>

    <p>
        COD Charge:
        ₹${codCharge}
    </p>

    <p>
        GST:
        ₹${gstAmount}
    </p>

    <h2>
        Grand Total:
        ₹${grandTotal}
    </h2>

    <p>
        Order ID:
        ${savedOrder._id}
    </p>

</div>
`
                });

                console.log(
                    "Order email sent successfully"
                );
            }

        } catch (emailErr) {

            console.log(
                "EMAIL ERROR:",
                emailErr.message
            );

        }

    } catch (err) {

        console.log(
            "ORDER ERROR:",
            err
        );

        res.status(500).json({
            success: false,
            message: "Order failed",
            error: err.message
        });
    }
});

app.get("/get-orders", async (req, res) => {
    try {
        const allOrders = await orders
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders: allOrders
        });

    } catch (err) {
        console.log("Get Orders Error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
});

/* =========================
   GET ORDERS BY USER
========================= */
app.get("/orders/:userId", async (req, res) => {
    try {
        const userOrders = await orders
            .find({ userId: req.params.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders: userOrders,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
});


// ================= USER ORDERS =================
app.get("/user-orders/:id", async (req, res) => {
    try {
        const userOrders = await orders.find({
            userId: req.params.id
        });

        res.json({ orders: userOrders });

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

// ================= UPDATE ORDER STATUS =================
app.put("/update-order/:id", async (req, res) => {
    try {
        const { orderStatus } = req.body;

        // Update order in DB
        const updatedOrder = await orders.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Send premium email only when completed
        if (orderStatus === "Completed") {
            const customerEmail =
                updatedOrder.customerInfo?.email;

            if (customerEmail) {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: customerEmail,
                    subject:
                        "✨ Your Order Has Been Completed",
                    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background:#0f172a; font-family:Arial, sans-serif;">

    <div style="max-width:700px; margin:40px auto; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.25);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#111827,#312e81,#7c3aed); padding:40px 30px; text-align:center; color:white;">
            <h1 style="margin:0; font-size:32px; letter-spacing:1px;">
                ✨ Order Completed
            </h1>
            <p style="margin-top:12px; font-size:16px; opacity:0.9;">
                Your premium shopping experience has been fulfilled
            </p>
        </div>

        <!-- Body -->
        <div style="padding:35px; color:#1f2937;">
            <h2 style="margin-top:0; font-size:26px;">
                Hello ${updatedOrder.customerInfo
                            ?.fullName || "Customer"
                        },
            </h2>

            <p style="font-size:16px; line-height:1.8; color:#4b5563;">
                We are delighted to inform you that your order has been
                <strong style="color:#16a34a;">successfully completed</strong>.
                Thank you for choosing our store.
            </p>

            <!-- Order Card -->
            <div style="margin:30px 0; background:#f9fafb; border:1px solid #e5e7eb; border-radius:18px; padding:25px;">
                <h3 style="margin-top:0; color:#111827;">Order Details</h3>

                <p style="margin:8px 0; font-size:15px;">
                    <strong>Order ID:</strong> #${updatedOrder._id
                        }
                </p>

                <p style="margin:8px 0; font-size:15px;">
                    <strong>Status:</strong> 
                    <span style="color:#16a34a; font-weight:bold;">
                        Completed
                    </span>
                </p>

                <p style="margin:8px 0; font-size:15px;">
                    <strong>Total Amount:</strong> ₹${updatedOrder.pricing
                            ?.grandTotal ||
                        updatedOrder.totalAmount ||
                        0
                        }
                </p>
            </div>

            <p style="font-size:15px; line-height:1.7; color:#6b7280;">
                We appreciate your trust in us and look forward to serving you again.
                Your satisfaction is our highest priority.
            </p>
        </div>

        <!-- Footer -->
        <div style="background:#111827; color:#d1d5db; text-align:center; padding:25px;">
            <h3 style="margin:0; color:white;">AK Unique Enterprise</h3>
            <p style="margin:8px 0 0; font-size:14px;">
                Premium Quality • Trusted Service • Elegant Experience
            </p>
        </div>

    </div>

</body>
</html>
                    `,
                });
            }
        }

        res.status(200).json({
            success: true,
            message:
                "Order updated successfully",
            order: updatedOrder,
        });
    } catch (err) {
        console.error(
            "Update Order Error:",
            err
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// ================= ADD TO CART =================
app.post("/add-to-cart", async (req, res) => {
    try {
        const {
            userId,
            productId,
            name,
            salePrice,
            originalPrice,
            image,
            category,
            description
        } = req.body;

        const existing = await cartCollection.findOne({
            userId,
            productId
        });

        if (existing) {
            existing.quantity += 1;
            await existing.save();

            return res.status(200).json({
                message: "Cart quantity updated",
                cart: existing
            });
        }

        const newCart = new cartCollection({
            userId,
            productId,
            name,
            salePrice,
            originalPrice,
            image,
            category,
            description
        });

        await newCart.save();

        res.status(200).json({
            message: "Added to cart",
            cart: newCart
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});


// ================= GET USER CART =================
app.get("/get-cart/:userId", async (req, res) => {
    try {
        const cart = await cartCollection.find({
            userId: req.params.userId
        });

        res.status(200).json({ cart });

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

// ================= UPDATE CART QUANTITY =================
app.put("/update-cart/:id", async (req, res) => {
    try {
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const updatedCart = await cartCollection.findByIdAndUpdate(
            req.params.id,
            { quantity },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        res.status(200).json({
            message: "Cart quantity updated successfully",
            cart: updatedCart
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});


// ================= DELETE CART ITEM =================
app.delete("/delete-cart/:id", async (req, res) => {
    try {
        const deletedCart = await cartCollection.findByIdAndDelete(
            req.params.id
        );

        if (!deletedCart) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        res.status(200).json({
            message: "Cart item removed successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});



app.get("/test-email", async (req, res) => {

    try {

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: "Test Email",

            html: "<h1>Email Working Successfully</h1>"

        });

        res.send("Email Sent");

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});