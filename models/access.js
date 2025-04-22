const mongoose = require("mongoose");

const accessSchema = new mongoose.Schema({
    modelName: {
        type: String,
        required: true,
    },
    recordId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
    accessedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person", // Assuming you have a User model
        required: true,
    },
});

const Access = mongoose.model("Access", accessSchema);

module.exports = Access;
