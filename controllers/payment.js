const Payment = require("../models/payment");
const Person = require("../models/person");
const jwt = require("jsonwebtoken");

const addAmount = async (req, res) => {
    try {
        const { rfid, fromId, amount } = req.body;

        // Convert amount to a number
        const numericAmount = Number(amount);

        if (!rfid || isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ error: "Invalid RFID or amount" });
        }

        let user = await Person.findOne({ rfid });

        if (!user) return res.status(400).json({ error: "No such user exists" });

        let payment = await Payment.findOne({ person: user._id });

        if (!payment) {
            // Create a new payment account if not found
            payment = await Payment.create({ person: user._id, balance: numericAmount, transactions: [] });
        } else {
            // Update balance
            payment.balance += numericAmount;
        }

        // Add transaction record
        payment.transactions.push({
            amount: numericAmount, // Store amount as a number
            transactionType: "credited",
            from: fromId,
            to: user._id,
        });

        await payment.save();

        return res.status(200).json({ success: "Amount added successfully", balance: payment.balance });

    } catch (error) {
        console.error("Error adding amount:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const payAmount = async(req,res) => {
    try {
        const { rfid, toId, amount } = req.body;

        if (!rfid || !toId || !amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid transaction details" , rfid , toId , amount});
        }

        const numericAmount = parseFloat(amount);

        const user = await Person.findOne({ rfid : rfid });
        const userAcc = await Payment.findOne({ person : user._id });

        if(!userAcc)
            userAcc = await Payment.create({ person: user._id, balance: 0, transactions: [] });
        if(!user)
            return res.status(400).json({ error : "No such user exists" });

        const fromId = user._id;

        if (fromId === toId) {
            return res.status(400).json({ error: "Cannot transfer to the same account" });
        }

        const receiver = await Payment.findOne({ person: toId });

        if (!user || !receiver) {
            return res.status(404).json({ error: "Sender or receiver account not found" });
        }

        if (userAcc.balance < numericAmount) {
            return res.status(400).json({ error: "Insufficient funds" });
        }

        // Deduct from sender
        userAcc.balance -= numericAmount;
        userAcc.transactions.push({
            amount : numericAmount,
            transactionType: "debited",
            from: fromId,
            to: toId,
        });

        // Add to receiver
        receiver.balance += numericAmount;
        receiver.transactions.push({
            amount: numericAmount,
            transactionType: "credited",
            from: fromId,
            to: toId,
        });

        await userAcc.save();
        await receiver.save();

        return res.status(200).json({ success: "Transaction successful", balance: user.balance });

    } catch (error) {
        console.error("Error processing payment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const getHistory = async(req,res) =>{
    try {
        const decoded = jwt.verify(req.cookies.token,process.env.JWT_SECRET);
        const userId  = decoded.id;

        const paymentRecord = await Payment.findOne({ person: userId })
            .populate("transactions.from", "firstName lastName")
            .populate("transactions.to", "firstName lastName");

        if (!paymentRecord) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            balance: paymentRecord.balance,
            transactions: paymentRecord.transactions,
        });
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    addAmount,
    payAmount,
    getHistory,
}