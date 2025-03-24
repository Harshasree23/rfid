const mongoose = require('mongoose');
const argon2 = require('argon2');

const personSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String, // Changed from Number to String
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'staff', 'member'],
        required: true,
    },
    rfid:{
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date(); // Ensures DOB is not in the future
            },
            message: "Date of Birth cannot be in the future!",
        }
    }
}, { timestamps: true });

// Pre-save hook to hash password before storing
personSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await argon2.hash(this.password);
    }
    next();
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
