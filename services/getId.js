const jwt = require('jsonwebtoken');
const Person = require('../models/person');

const getId = async (req,res) => {
    const token = req.cookies.token; // Get JWT from cookies

    // console.log("Received token:", req.cookies.token);

    if (!token) {
        return res.status(401).json({ error: "No token found, please log in" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // console.log(decoded);

        const user = await Person.findOne({ _id : decoded.id });

        // console.log(user);

        if(!user)
            throw "User not found";

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(401).json({ error: error || "Invalid token, please log in again" });
    }
}

module.exports = {
    getId,
}