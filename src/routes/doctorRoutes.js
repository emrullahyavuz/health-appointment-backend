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
    debugDoctorUser,
    fixDoctorUserRelationship
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

// Role-based middleware
const requireRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: `Access denied. ${role} role required.` });
        }
    };
};

// Public routes (no authentication required)
router.get("/", validateBody(doctorQuerySchema, "query"), getAllDoctors); // Get all doctors with filtering
router.get("/debug", debugDoctorUser); // Debug endpoint to check doctor-user relationships
router.post("/fix-relationship", fixDoctorUserRelationship); // Fix doctor-user relationship
router.get("/:id", getDoctorById); // Get specific doctor by ID
router.get("/:id/reviews", getDoctorReviews); // Get doctor's reviews

// Doctor routes (requires doctor role)
router.get("/profile/me", auth, requireRole("doctor"), getDoctorProfile);
router.post("/profile", auth, requireRole("doctor"), validateBody(createDoctorProfileSchema), createDoctorProfile);
router.put("/profile", auth, requireRole("doctor"), validateBody(updateDoctorProfileSchema), updateDoctorProfile);
router.put("/availability", auth, requireRole("doctor"), validateBody(updateAvailabilitySchema), updateAvailability);
router.get("/appointments/me", auth, requireRole("doctor"), getDoctorAppointments);
router.get("/stats/me", auth, requireRole("doctor"), getDoctorStats);
router.delete("/profile", auth, requireRole("doctor"), deleteDoctorProfile);

// Admin routes (requires admin role)
router.get("/admin/all", auth, requireRole("admin"), adminGetAllDoctors);
router.put("/admin/:id/verify", auth, requireRole("admin"), validateBody(adminVerifyDoctorSchema), adminVerifyDoctor);

module.exports = router;
