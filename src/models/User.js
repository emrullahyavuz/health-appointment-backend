const mongoose = require("mongoose");


// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telephone: {
        type: String,
        required: true,
        match: [/^[0-9]{10,15}$/, "Please enter valid phone number"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "patient", "doctor"],
        default: "patient"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);    