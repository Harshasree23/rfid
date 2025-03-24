const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
        required: true,
        unique:true,
    },
    attendance: [
        {
            status: {
                type: String,
                enum: ["present", "absent"],
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
                unique: true, // Ensures only one entry per day
            },
        },
    ],
});

// Ensure a person has only one attendance record per day
attendanceSchema.index({ person: 1, "attendance.date": 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
