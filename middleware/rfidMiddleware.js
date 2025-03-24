const activeRFIDScans = new Map(); // Store active scans

// Store a new RFID scan
const storeRFID = (rfid, name, rollNo,id) => {
    activeRFIDScans.set(rfid, { rfid, name, rollNo, timestamp: Date.now(),id });
};

// Get all scanned RFIDs
const getActiveRFIDs = () => {
    return Array.from(activeRFIDScans.values());
};

// Clear RFID from active list after processing
const clearRFID = (rfid) => {
    activeRFIDScans.delete(rfid);
};

module.exports = { storeRFID, getActiveRFIDs, clearRFID };
