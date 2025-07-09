const Joi = require('joi');

// Working hours schema
const workingHoursSchema = Joi.object({
    day: Joi.string().valid(
        "Monday", "Tuesday", "Wednesday", "Thursday", 
        "Friday", "Saturday", "Sunday"
    ).required(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    isAvailable: Joi.boolean().default(true)
});

// Create doctor profile schema
const createDoctorProfileSchema = Joi.object({
    specialty: Joi.string().valid(
        "Cardiology", "Neurology", "Pediatrics", "Orthopedics",
        "Dermatology", "Gastroenterology", "Psychiatry", "Ophthalmology",
        "General Medicine", "Surgery", "Gynecology", "Urology",
        "Oncology", "Radiology", "Anesthesiology", "Emergency Medicine"
    ).required(),
    experience: Joi.number().min(0).max(60).required(),
    education: Joi.string().max(1000).required(),
    languages: Joi.array().items(
        Joi.string().valid(
            "English", "Spanish", "French", "German", "Italian",
            "Portuguese", "Mandarin", "Arabic", "Hindi", "Turkish"
        )
    ).min(1).required(),
    consultationFee: Joi.number().min(0).required(),
    location: Joi.string().max(200).required(),
    about: Joi.string().max(2000).optional(),
    workingHours: Joi.array().items(workingHoursSchema).min(1).required()
});

// Update doctor profile schema
const updateDoctorProfileSchema = Joi.object({
    specialty: Joi.string().valid(
        "Cardiology", "Neurology", "Pediatrics", "Orthopedics",
        "Dermatology", "Gastroenterology", "Psychiatry", "Ophthalmology",
        "General Medicine", "Surgery", "Gynecology", "Urology",
        "Oncology", "Radiology", "Anesthesiology", "Emergency Medicine"
    ).optional(),
    experience: Joi.number().min(0).max(60).optional(),
    education: Joi.string().max(1000).optional(),
    languages: Joi.array().items(
        Joi.string().valid(
            "English", "Spanish", "French", "German", "Italian",
            "Portuguese", "Mandarin", "Arabic", "Hindi", "Turkish"
        )
    ).min(1).optional(),
    consultationFee: Joi.number().min(0).optional(),
    location: Joi.string().max(200).optional(),
    about: Joi.string().max(2000).optional(),
    workingHours: Joi.array().items(workingHoursSchema).min(1).optional()
});

// Update availability schema
const updateAvailabilitySchema = Joi.object({
    isAvailable: Joi.boolean().optional(),
    workingHours: Joi.array().items(workingHoursSchema).min(1).optional()
});

// Admin verify doctor schema
const adminVerifyDoctorSchema = Joi.object({
    isVerified: Joi.boolean().required()
});

// Query parameters schema for filtering doctors
const doctorQuerySchema = Joi.object({
    specialty: Joi.string().valid(
        "Cardiology", "Neurology", "Pediatrics", "Orthopedics",
        "Dermatology", "Gastroenterology", "Psychiatry", "Ophthalmology",
        "General Medicine", "Surgery", "Gynecology", "Urology",
        "Oncology", "Radiology", "Anesthesiology", "Emergency Medicine"
    ).optional(),
    location: Joi.string().optional(),
    minRating: Joi.number().min(0).max(5).optional(),
    maxFee: Joi.number().min(0).optional(),
    isAvailable: Joi.boolean().optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
    sortBy: Joi.string().valid('rating', 'consultationFee', 'experience', 'joinedDate').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional()
});

module.exports = {
    createDoctorProfileSchema,
    updateDoctorProfileSchema,
    updateAvailabilitySchema,
    adminVerifyDoctorSchema,
    doctorQuerySchema
}; 