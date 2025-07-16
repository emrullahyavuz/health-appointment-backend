const express = require("express");
const {
  getAppointment,
  getMyAppointments,
  createAppointment,
  getAppointmentStats,
  getDoctorAppointments,
  updateAppointment,
  cancelAppointment,
} = require("../controllers/appointmentController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const ROLES = require("../constants/roles");

const router = express.Router();

// Tüm rotaları koru
router.use(auth);

router.route("/").get(getMyAppointments).post(createAppointment);

router.get("/stats", getAppointmentStats);
router.get("/doctor", requireRole(ROLES.DOCTOR), getDoctorAppointments);

router.route("/:id").get(getAppointment).patch(updateAppointment);

router.put("/:id/cancel", cancelAppointment);

module.exports = router;
