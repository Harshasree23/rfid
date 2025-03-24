const { getActiveRFIDs, storeRFID, clearRFID } = require("../middleware/rfidMiddleware");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Client connected");

        // Send all active RFID scans to frontend on connection
        socket.emit("updateRFIDs", getActiveRFIDs());

        // Handle new RFID scan event
        socket.on("rfidScan", (rfid) => {
            // console.log("RFID Scanned:", rfid);
            storeRFID(rfid); // Store RFID
            io.emit("updateRFIDs", getActiveRFIDs()); // Notify all clients
        });

        // Handle RFID processing
        socket.on("processRFID", (rfid) => {
            if (getActiveRFIDs().some((entry) => entry.rfid === rfid)) {
                clearRFID(rfid); // Remove from active list
                io.emit("updateRFIDs", getActiveRFIDs()); // Update frontend
            }
        });
    });
};
