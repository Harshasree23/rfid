const Attendance = require("../models/attendace");
const Person = require("../models/person");

const markAttendance = async (req, res) => {
    try {
        const { rfid } = req.body;

        const user = await Person.findOne({ rfid: rfid });
        const personId = user._id;

        if (!personId ) return res.status(400).json({ error: "Missing data" });

        // Find person’s attendance document
        let attendanceRecord = await Attendance.findOne({ person: personId });

        if (!attendanceRecord) {
            // Create new record if not found
            attendanceRecord = new Attendance({ person: personId, attendance: [] });
        }

        // Check if an entry for today already exists
        const today = new Date().setHours(0, 0, 0, 0);
        const existingEntry = attendanceRecord.attendance.find(a => new Date(a.date).setHours(0, 0, 0, 0) === today);

        if (existingEntry) {
            return res.status(400).json({ error: "Attendance already marked for today" });
        }

        // Add new attendance entry
        attendanceRecord.attendance.push({ status:"present", date: new Date() });

        await attendanceRecord.save();
        res.status(200).json({ success: "Attendance marked successfully", attendance: attendanceRecord });

    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const singleAttendance = async(req,res) => {
    try {
        console.log(req.user);
        const personId  = req.user._id;
        const attendance = await Attendance.findOne({ person: personId }).populate("person", "firstName lastName");

        if (!attendance) {
            return res.status(404).json({ error: "Attendance record not found" });
        }

        res.status(200).json(attendance);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


const groupAttendance = async(req,res) => {
    try {
        const role  = req.body.role;

        //  Find all people with the given role
        const people = await Person.find({ role }, "_id firstName lastName");

        if (!people.length) {
            return res.status(404).json({ error: "No people found with this role" });
        }

        //  Extract person IDs
        const personIds = people.map(person => person._id);

        //  Fetch attendance for the people
        const attendanceRecords = await Attendance.find({ person: { $in: personIds } })
            .populate("person", "firstName lastName role");

        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = {
    markAttendance,
    singleAttendance,
    groupAttendance,
}