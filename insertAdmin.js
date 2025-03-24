const mongoose = require('mongoose');
const argon2 = require('argon2');
require('dotenv').config();
const { makeConnection } = require('./connect'); // Ensure correct path
const Person = require('./models/person'); // Ensure correct path to model

async function insertAdmin() {
    try {
        // Connect to MongoDB
        await makeConnection("rfid"); // Ensure "rfid" is your DB name
        console.log("Connected to MongoDB");

        // Check if an admin already exists (to prevent duplicates)
        const existingAdmin = await Person.findOne({ email: "marvelavengersharsha@gmail.com" });
        if (existingAdmin) {
            console.log("Admin already exists. Skipping insertion.");
            return;
        }

        // Hash the password before inserting
        const hashedPassword = await argon2.hash("23082004");

        // Create the admin user
        const adminUser = new Person({
            firstName,
            lastName ,
            email ,
            password , // Store hashed password
            rollNo ,
            phone,
            address ,
            role ,
            rfid ,
            dob 
        });

        await adminUser.save();
        console.log("✅ Admin user inserted successfully!");

    } catch (error) {
        console.error("❌ Error inserting admin:", error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
        console.log("Database connection closed.");
    }
}

// Run the function
insertAdmin();
