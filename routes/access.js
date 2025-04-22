const express = require("express");
const mongoose = require("mongoose");
const Access = require("../models/access");
const accessRouter = express.Router();

// POST: Create access log with server-generated recordId
accessRouter.post("/", async (req, res) => {
    try {
        const { modelName, accessedBy } = req.body;

        // Validate input
        if (!modelName || !accessedBy) {
            return res.status(400).json({ message: "modelName and accessedBy are required." });
        }

        // Generate a fresh ObjectId to use as recordId
        const generatedRecordId = new mongoose.Types.ObjectId();

        const newAccess = new Access({
            modelName,
            recordId: generatedRecordId,
            accessedBy,
        });

        const savedAccess = await newAccess.save();
        res.status(201).json(savedAccess);
    } catch (error) {
        console.error("Error saving access log:", error);
        res.status(500).json({ message: "Something went wrong while saving access log." });
    }
});

accessRouter.get("/" , async(req,res) => {
    try{
        const details = await Access.find({})
        .populate("accessedBy", "firstName lastName")  // This will populate firstName and lastName
        .exec();  // .exec() to ensure the query is executed

        res.status(200).json(details);
    }
    catch(err)
    {
        res.status(500).json({ message: err });
    }
});

module.exports = accessRouter;
