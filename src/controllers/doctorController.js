const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Review = require("../models/Review");

// Get all doctors with filtering and pagination
const getAllDoctors = async (req, res) => {
    try {
        const {
            specialty,
            location,
            rating,
            minRating,
            maxFee,
            isAvailable,
            page = 1,
            limit = 10,
            sortBy = "rating",
            sortOrder = "desc"
        } = req.query;

        // Build filter object
        const filter = {};
        if (specialty) filter.specialty = specialty;
        if (location) filter.location = { $regex: location, $options: "i" };
        if (rating) filter.rating = parseFloat(rating);
        if (minRating) filter.rating = { $gte: parseFloat(minRating) };
        if (maxFee) filter.consultationFee = { $lte: parseFloat(maxFee) };
        if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const doctors = await Doctor.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate({
                path: "user",
                select: "name email phone avatar",
                model: "User"
            });

        // Get total count for pagination
        const total = await Doctor.countDocuments(filter);

        res.status(200).json({
            message: "Doctors retrieved successfully",
            doctors,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalDoctors: total,
                hasNext: skip + doctors.length < total,
                hasPrev: parseInt(page) > 1,
                avarageRating: doctors.reduce((sum, doctor) => sum + doctor.rating, 0) / doctors.length
            }
        });
    } catch (error) {
        console.error("Get all doctors error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findById(id)
            .populate({
                path: "user",
                select: "name email phone avatar",
                model: "User"
            });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({
            message: "Doctor retrieved successfully",
            doctor
        });
    } catch (error) {
        console.error("Get doctor by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get doctor profile (for logged-in doctor)
const getDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const doctor = await Doctor.findOne({ user: userId })
            .populate({
                path: "user",
                select: "name email phone avatar",
                model: "User"
            });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        res.status(200).json({
            message: "Doctor profile retrieved successfully",
            doctor
        });
    } catch (error) {
        console.error("Get doctor profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create doctor profile
const createDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            specialty,
            experience,
            education,
            languages,
            consultationFee,
            location,
            about,
            workingHours
        } = req.body;

        // Check if doctor profile already exists
        const existingDoctor = await Doctor.findOne({ user: userId });
        if (existingDoctor) {
            return res.status(400).json({ message: "Doctor profile already exists" });
        }

        // Validate user role
        const user = await User.findById(userId);
        if (!user || user.role !== "doctor") {
            return res.status(403).json({ message: "Only users with doctor role can create doctor profiles" });
        }

        // Create new doctor profile
        const newDoctor = new Doctor({
            user: userId,
            specialty,
            experience,
            education,
            languages,
            consultationFee,
            location,
            about,
            workingHours
        });

        await newDoctor.save();

        // Populate user data
        await newDoctor.populate("user", "name email phone");

        res.status(201).json({
            message: "Doctor profile created successfully",
            doctor: newDoctor
        });
    } catch (error) {
        console.error("Create doctor profile error:", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData.user;
        delete updateData.isVerified;
        delete updateData.verificationDocuments;
        delete updateData.rating;
        delete updateData.reviewCount;
        delete updateData.totalPatients;
        delete updateData.joinedDate;

        const doctor = await Doctor.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true, runValidators: true }
        ).populate("user", "name email phone");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        res.status(200).json({
            message: "Doctor profile updated successfully",
            doctor
        });
    } catch (error) {
        console.error("Update doctor profile error:", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update doctor availability
const updateAvailability = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { isAvailable, workingHours } = req.body;

        const updateData = {};
        if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
        if (workingHours) updateData.workingHours = workingHours;

        const doctor = await Doctor.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true, runValidators: true }
        ).populate("user", "name email phone");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        res.status(200).json({
            message: "Doctor availability updated successfully",
            doctor
        });
    } catch (error) {
        console.error("Update availability error:", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { status, page = 1, limit = 10 } = req.query;

        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        // Build filter
        const filter = { doctor: doctor._id };
        if (status) filter.status = status;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const appointments = await Appointment.find(filter)
            .populate("patient", "name email phone")
            .populate("doctor", "specialty consultationFee")
            .sort({ appointmentDate: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Appointment.countDocuments(filter);

        res.status(200).json({
            message: "Appointments retrieved successfully",
            appointments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalAppointments: total
            }
        });
    } catch (error) {
        console.error("Get doctor appointments error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get doctor's reviews
const getDoctorReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const reviews = await Review.find({ doctor: id })
            .populate("patient", "name avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Review.countDocuments({ doctor: id });

        res.status(200).json({
            message: "Reviews retrieved successfully",
            reviews,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalReviews: total
            }
        });
    } catch (error) {
        console.error("Get doctor reviews error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get doctor statistics
const getDoctorStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        // Get appointment statistics
        const totalAppointments = await Appointment.countDocuments({ doctor: doctor._id });
        const completedAppointments = await Appointment.countDocuments({ 
            doctor: doctor._id, 
            status: "completed" 
        });
        const pendingAppointments = await Appointment.countDocuments({ 
            doctor: doctor._id, 
            status: "pending" 
        });
        const cancelledAppointments = await Appointment.countDocuments({ 
            doctor: doctor._id, 
            status: "cancelled" 
        });

        // Get review statistics
        const totalReviews = await Review.countDocuments({ doctor: doctor._id });
        const averageRating = await Review.aggregate([
            { $match: { doctor: doctor._id } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);

        // Get monthly appointments (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyAppointments = await Appointment.aggregate([
            { $match: { doctor: doctor._id, appointmentDate: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$appointmentDate" },
                        month: { $month: "$appointmentDate" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.status(200).json({
            message: "Doctor statistics retrieved successfully",
            stats: {
                totalAppointments,
                completedAppointments,
                pendingAppointments,
                cancelledAppointments,
                totalReviews,
                averageRating: averageRating.length > 0 ? averageRating[0].avgRating : 0,
                monthlyAppointments
            }
        });
    } catch (error) {
        console.error("Get doctor stats error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete doctor profile
const deleteDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const doctor = await Doctor.findOneAndDelete({ user: userId });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        res.status(200).json({
            message: "Doctor profile deleted successfully"
        });
    } catch (error) {
        console.error("Delete doctor profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Admin: Get all doctors (for admin use)
const adminGetAllDoctors = async (req, res) => {
    try {
        const { page = 1, limit = 10, isVerified } = req.query;

        const filter = {};
        if (isVerified !== undefined) filter.isVerified = isVerified === "true";

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const doctors = await Doctor.find(filter)
            .populate("user", "name email phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Doctor.countDocuments(filter);

        res.status(200).json({
            message: "All doctors retrieved successfully",
            doctors,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalDoctors: total
            }
        });
    } catch (error) {
        console.error("Admin get all doctors error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Admin: Verify doctor
const adminVerifyDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;

        const doctor = await Doctor.findByIdAndUpdate(
            id,
            { isVerified },
            { new: true, runValidators: true }
        ).populate("user", "name email phone");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({
            message: `Doctor ${isVerified ? "verified" : "unverified"} successfully`,
            doctor
        });
    } catch (error) {
        console.error("Admin verify doctor error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Debug function to check doctor-user relationship
const debugDoctorUser = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).lean();
        
        const doctorsWithUserInfo = await Promise.all(
            doctors.map(async (doctor) => {
                const user = await User.findById(doctor.user).select('name email phone');
                return {
                    doctorId: doctor._id,
                    userId: doctor.user,
                    user: user,
                    hasUser: !!user
                };
            })
        );

        // Get all users to see what's available
        const allUsers = await User.find({}).select('_id name email phone role').lean();

        res.status(200).json({
            message: "Debug info retrieved",
            doctors: doctorsWithUserInfo,
            allUsers: allUsers,
            totalUsers: allUsers.length
        });
    } catch (error) {
        console.error("Debug error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Fix doctor-user relationship
const fixDoctorUserRelationship = async (req, res) => {
    try {
        // Get the first doctor record
        const doctor = await Doctor.findOne({});
        if (!doctor) {
            return res.status(404).json({ message: "No doctor found" });
        }

        // Get the first user with doctor role
        const user = await User.findOne({ role: "doctor" });
        if (!user) {
            return res.status(404).json({ message: "No doctor user found" });
        }

        // Update the doctor's user reference
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctor._id,
            { user: user._id },
            { new: true }
        ).populate({
            path: "user",
            select: "name email phone avatar",
            model: "User"
        });

        res.status(200).json({
            message: "Doctor-user relationship fixed",
            doctor: updatedDoctor
        });
    } catch (error) {
        console.error("Fix doctor-user relationship error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    getDoctorProfile,
    createDoctorProfile,
    updateDoctorProfile,
    updateAvailability,
    getDoctorAppointments,
    getDoctorReviews,
    getDoctorStats,
    deleteDoctorProfile,
    adminGetAllDoctors,
    adminVerifyDoctor,
    debugDoctorUser,
    fixDoctorUserRelationship
};
