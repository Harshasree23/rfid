const jwt = require("jsonwebtoken");
const Person = require('../models/person');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies or headers
        const token = req.cookies.token;
        // console.log("Received Token:", token);
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Person.findById(decoded.id).select("-password"); // Exclude password

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        // console.log(req.user);
        next(); // Proceed to the next middleware
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
