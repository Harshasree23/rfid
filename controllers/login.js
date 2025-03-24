const jwt = require("jsonwebtoken");
const Person = require("../models/person");
const argon2 = require("argon2");

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user by email
        const user = await Person.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify password
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Set secure cookies
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.cookie("role", user.role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        return res.status(200).json({ success: "User logged in successfully", role: user.role });

    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const autologin = (req,res) => {
    const token = req.cookies.token; // Get JWT from cookies

    if (!token) {
        return res.status(401).json({ error: "No token, please log in" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ success: "User authenticated", user: decoded });
    } catch (error) {
        return res.status(401).json({ error: "Invalid token, please log in again" });
    }
}

module.exports = { login , autologin };
