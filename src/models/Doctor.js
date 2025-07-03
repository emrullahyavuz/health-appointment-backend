const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
        required: true,
    },
    workingHours: [{
        day: { type: String, required: true }, // Ör: 'Monday'
        start: { type: String, required: true }, // Ör: '09:00'
        end: { type: String, required: true },   // Ör: '17:00'
    }],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment"
    }],
});

module.exports = mongoose.model("Doctor", doctorSchema);