const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
        required: true,
        unique: true, // Each person has a single payment account
    },
    balance: {
        type: Number,
        default: 0, // Initial balance
    },
    transactions: [
        {
            amount: {
                type: Number,
                required: true,
            },
            transactionType: {
                type: String,
                enum: ["credited", "debited"],
                required: true,
            },
            from: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Person", // Sender's ID (if credited from another person)
            },
            to: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Person", // Receiver's ID (if debited to another person)
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
