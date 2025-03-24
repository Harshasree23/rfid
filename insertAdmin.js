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
            console.log( await argon2.verify(existingAdmin.password , "23082004"));
            console.log("Admin already exists. Skipping insertion.");
            return;
        }

        // Create the admin user
        const adminUser = new Person({
            firstName:"Sree Harsha",
            lastName:"Munimadugu",
            email:"marvelavengersharsha@gmail.com",
            password: "23082004" , // Store hashed password
            rollNo:"1" ,
            phone:"8106978379",
            address:"Krishhna nagar , Kurnool , Andhra Pradesh" ,
            role:"admin" ,
            rfid:"123" ,
            dob: new Date("2004-08-23"),  // YYYY-MM-DD format
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
