const express = require("express");
const router = express.Router();
const {
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
    
} = require("../controllers/doctorController");

const auth = require("../middlewares/auth");
const validateBody = require("../middlewares/validateBody");
const {
    createDoctorProfileSchema,
    updateDoctorProfileSchema,
    updateAvailabilitySchema,
    adminVerifyDoctorSchema,
    doctorQuerySchema
} = require("../validators/doctorValidator");
const requireRole = require("../middlewares/requireRole");
const ROLES = require("../constants/roles");


// Public routes (no authentication required)
router.get("/", validateBody(doctorQuerySchema, "query"), getAllDoctors); // Get all doctors with filtering
router.get("/:id", getDoctorById); // Get specific doctor by ID
router.get("/:id/reviews", getDoctorReviews); // Get doctor's reviews

// Doctor routes (requires doctor role)
router.get("/profile/me", auth, requireRole(ROLES.DOCTOR), getDoctorProfile);
router.post("/profile", auth, requireRole(ROLES.DOCTOR), validateBody(createDoctorProfileSchema), createDoctorProfile);
router.put("/profile", auth, requireRole(ROLES.DOCTOR), validateBody(updateDoctorProfileSchema), updateDoctorProfile);
router.put("/availability", auth, requireRole(ROLES.DOCTOR), validateBody(updateAvailabilitySchema), updateAvailability);
router.get("/appointments/me", auth, requireRole(ROLES.DOCTOR), getDoctorAppointments);
router.get("/stats/me", auth, requireRole(ROLES.DOCTOR), getDoctorStats);
router.delete("/profile", auth, requireRole(ROLES.DOCTOR), deleteDoctorProfile);

// Admin routes (requires admin role)
router.get("/admin/all", auth, requireRole(ROLES.ADMIN), adminGetAllDoctors);
router.put("/admin/:id/verify", auth, requireRole(ROLES.ADMIN), validateBody(adminVerifyDoctorSchema), adminVerifyDoctor);

module.exports = router;
