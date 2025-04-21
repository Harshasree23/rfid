const express = require('express');
const { storeRFID, getActiveRFIDs } = require("../middleware/rfidMiddleware");
const Person = require('../models/person');

const router = express.Router();

module.exports =  (io) => {
    // Route to scan RFID and notify frontend
    router.post("/rfid", async (req, res) => {
        const { rfid } = req.body;

        console.log(rfid);
        if (!rfid) {
            return res.status(400).json({ error: "RFID is required" });
        }

        const user = await Person.findOne({rfid:rfid});
        
        // Store RFID scan in memory
        if(user)
            storeRFID(rfid,user.firstName+" "+user.lastName,user.rollNo,user._id);
        else
            storeRFID(rfid,"new user");
        // Emit updated RFID list to all connected clients
        io.emit("updateRFIDs", getActiveRFIDs());

        return res.status(200).json({ message: "RFID scanned successfully", rfid });
    });

    return router;
};
