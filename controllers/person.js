const Attendance = require("../models/attendace");
const Payment = require("../models/payment");
const Person = require("../models/person");
const argon2 = require("argon2");

const getUsers = async (req, res) => {
    try {
        const role = req.cookies.role;
        
        if (!role) {
            return res.status(401).json({ error: "Unauthorized: No role found" });
        }

        let users;
        if (role === "admin") {
            users = await Person.find({});
        } else if (role === "staff") {
            users = await Person.find({ role: "member" });
        } else {
            return res.status(403).json({ error: "Forbidden: Not Authorized" });
        }

        return res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const addUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, rollNo, phone, address, role,rfid, dob } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !rollNo || !phone || !address || !role || !dob) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check for existing user (Prevent duplicate email, rollNo, phone)
        const existingUser = await Person.findOne({ 
            $or: [{ email }, { rollNo }, { phone },{ rfid }] 
        });

        if (existingUser) {
            return res.status(409).json({ error: "User already exists with this email, rollNo, or phone" });
        }


        // Create new user
        const user = await Person.create({
            firstName,
            lastName,
            email,
            password,
            rollNo,
            phone,
            address,
            role,
            rfid,
            dob : new Date(dob),
        });

        const payment = await  Payment.create({ person: user._id, balance: 0, transactions: [] });
        const attendance = await Attendance.create({ person: user._id, attendance: [{ date: new Date(), status: "present" }] });

        return res.status(201).json({ success: "User added successfully", userId: user._id });

    } catch (error) {
        console.error("Error adding user:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const update = async (req,res) => {
    try {
        const userId = req.user.id; // Ensure authentication middleware provides the user ID
        const updateData = req.body;

        // Exclude fields that should not be updated
        const excludedFields = ["_id", "__v", "password", "rfid", "createdAt", "updatedAt"];
        excludedFields.forEach(field => delete updateData[field]);

        const updatedUser = await Person.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getUsers,
    addUser,
    update,
};
