const cron = require("node-cron");
const Attendance = require("../models/attendace");
const Person = require("../models/person");

const markDailyAttendance = async () => {
    try {
        console.log("Running daily attendance check...");

        // Get all users
        const users = await Person.find();

        for (const user of users) {
            // Check if today's attendance is already recorded
            const today = new Date().setHours(0, 0, 0, 0);
            const existingAttendance = await Attendance.findOne({
                person: user._id,
                "attendance.date": today,
            });

            if (!existingAttendance) {
                // Add an absent record for today
                await Attendance.updateOne(
                    { person: user._id },
                    { $push: { attendance: { date: new Date(), status: "absent" } } },
                    { upsert: true } // Create record if not exists
                );
                console.log(`Marked absent for user: ${user._id}`);
            }
        }

        console.log("Daily attendance update completed.");
    } catch (error) {
        console.error("Error updating attendance:", error);
    }
};

// Schedule the cron job to run at midnight every day
cron.schedule("0 0 * * *", markDailyAttendance);

// Exporting for potential manual testing
module.exports = markDailyAttendance;
