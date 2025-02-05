const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    },
    createManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    projectUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    finalDate: {
        type: Date,
        required: true, // Make finalDate required
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
