// const Appointment = require("../models/Appointment")
// const Doctor = require("../models/Doctor")
// const User = require("../models/User")
// const sendEmail = require("../utils/email")


// // create appointment
// const createAppointment = async (req, res) => {
//   try {
//     const { doctorId, date, time, type, symptoms, notes } = req.body

//     // Check if doctor exists and is available
//     const doctor = await Doctor.findById(doctorId)
//     if (!doctor || !doctor.isAvailable) {
//       return res.status(404).json({ message: "Doctor not found or not available" })
//     }

//     // Check if the appointment slot is available
//     const appointmentDate = new Date(date)
//     const dayName = appointmentDate.toLocaleDateString("en-US", { weekday: "long" })

//     const daySchedule = doctor.workingHours.find((schedule) => schedule.day === dayName && schedule.isAvailable)

//     if (!daySchedule) {
//       return res.status(400).json({ message: "Doctor is not available on this day" })
//     }

//     // Check if time slot is within working hours
//     const [appointmentHour, appointmentMinute] = time.split(":").map(Number)
//     const [startHour, startMinute] = daySchedule.startTime.split(":").map(Number)
//     const [endHour, endMinute] = daySchedule.endTime.split(":").map(Number)

//     const appointmentTimeMinutes = appointmentHour * 60 + appointmentMinute
//     const startTimeMinutes = startHour * 60 + startMinute
//     const endTimeMinutes = endHour * 60 + endMinute

//     if (appointmentTimeMinutes < startTimeMinutes || appointmentTimeMinutes >= endTimeMinutes) {
//       return res.status(400).json({ message: "Selected time is outside doctor's working hours" })
//     }

//     // Check if slot is already booked
//     const existingAppointment = await Appointment.findOne({
//       doctor: doctorId,
//       date: appointmentDate,
//       time,
//       status: { $in: ["scheduled", "confirmed", "in-progress"] },
//     })

//     if (existingAppointment) {
//       return res.status(400).json({ message: "This time slot is already booked" })
//     }

//     // Create appointment
//     const appointment = await Appointment.create({
//       patient: req.user.id,
//       doctor: doctorId,
//       date: appointmentDate,
//       time,
//       type,
//       symptoms,
//       notes,
//       consultationFee: doctor.consultationFee,
//       serviceFee: 10,
//       totalAmount: doctor.consultationFee + 10,
//     })

//     // Populate the appointment
//     await appointment.populate([
//       { path: "patient", select: "name email phone" },
//       {
//         path: "doctor",
//         select: "user specialty location",
//         populate: { path: "user", select: "name email phone" },
//       },
//     ])

//     // Send confirmation emails
//     try {
//       // Email to patient
//       await sendEmail({
//         email: appointment.patient.email,
//         subject: "Appointment Confirmation",
//         message: `Your appointment with Dr. ${appointment.doctor.user.name} has been scheduled for ${date} at ${time}.`,
//       })

//       // Email to doctor
//       await sendEmail({
//         email: appointment.doctor.user.email,
//         subject: "New Appointment Booking",
//         message: `You have a new appointment with ${appointment.patient.name} scheduled for ${date} at ${time}.`,
//       })
//     } catch (err) {
//       console.log("Error sending confirmation emails:", err)
//     }

//     res.status(201).json({
//       status: "success",
//       data: {
//         appointment,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" })
//   }
// }

// // get my appointments
// const getMyAppointments = async (req, res) => {
//   try {
//     const query = {}

//     if (req.user.role === "patient") {
//       query.patient = req.user.id
//     } else if (req.user.role === "doctor") {
//       const doctor = await Doctor.findOne({ user: req.user.id })
//       if (!doctor) {
//         return res.status(404).json({ message: "Doctor profile not found" })
//       }
//       query.doctor = doctor._id
//     }

//     const appointments = await Appointment.find(query)
//       .sort({ date: -1, time: -1 })
//       .populate([
//         { path: "patient", select: "name email phone avatar" },
//         {
//           path: "doctor",
//           select: "user specialty location consultationFee",
//           populate: { path: "user", select: "name email phone avatar" },
//         },
//       ])

//     res.status(200).json({
//       status: "success",
//       results: appointments.length,
//       data: {
//         appointments,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" })
//   }
// }

// // get appointment
// const getAppointment = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id).populate([
//       { path: "patient", select: "name email phone avatar" },
//       {
//         path: "doctor",
//         select: "user specialty location consultationFee",
//         populate: { path: "user", select: "name email phone avatar" },
//       },
//     ])

//     if (!appointment) {
//       return res.status(404).json({ message: "No appointment found with that ID" })
//     }

//     // Check if user has access to this appointment
//     const doctor = await Doctor.findOne({ user: req.user.id })
//     const isPatient = appointment.patient._id.toString() === req.user.id
//     const isDoctor = doctor && appointment.doctor._id.toString() === doctor._id.toString()
//     const isAdmin = req.user.role === "admin"

//     if (!isPatient && !isDoctor && !isAdmin) {
//       return res.status(403).json({ message: "You do not have access to this appointment" })
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         appointment,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" })
//   }
// }

// // update appointment
// const updateAppointment = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id)

//     if (!appointment) {
//       return res.status(404).json({ message: "No appointment found with that ID" })
//     }

//     // Check permissions
//     const doctor = await Doctor.findOne({ user: req.user.id })
//     const isPatient = appointment.patient.toString() === req.user.id
//     const isDoctor = doctor && appointment.doctor.toString() === doctor._id.toString()
//     const isAdmin = req.user.role === "admin"

//     if (!isPatient && !isDoctor && !isAdmin) {
//       return res.status(403).json({ message: "You do not have access to this appointment" })
//     }

//     // Patients can only update certain fields
//     let allowedFields = []
//     if (isPatient) {
//       allowedFields = ["symptoms", "notes"]
//     } else if (isDoctor) {
//       allowedFields = ["status", "doctorNotes", "prescription", "diagnosis", "followUpRequired", "followUpDate"]
//     } else if (isAdmin) {
//       allowedFields = Object.keys(req.body)
//     }

//     const updateData = {}
//     allowedFields.forEach((field) => {
//       if (req.body[field] !== undefined) {
//         updateData[field] = req.body[field]
//       }
//     })

//     const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//       runValidators: true,
//     }).populate([
//       { path: "patient", select: "name email phone avatar" },
//       {
//         path: "doctor",
//         select: "user specialty location consultationFee",
//         populate: { path: "user", select: "name email phone avatar" },
//       },
//     ])

//     res.status(200).json({
//       status: "success",
//       data: {
//         appointment: updatedAppointment,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" })
//   }
// }

// // cancel appointment
// const cancelAppointment = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id)

//     if (!appointment) {
//       return res.status(404).json({ message: "No appointment found with that ID" })
//     }

//     // Check if appointment can be cancelled
//     if (appointment.status === "completed" || appointment.status === "cancelled") {
//       return res.status(400).json({ message: "This appointment cannot be cancelled" })
//     }

//     // Check permissions
//     const doctor = await Doctor.findOne({ user: req.user.id })
//     const isPatient = appointment.patient.toString() === req.user.id
//     const isDoctor = doctor && appointment.doctor.toString() === doctor._id.toString()
//     const isAdmin = req.user.role === "admin"

//     if (!isPatient && !isDoctor && !isAdmin) {
//       return res.status(403).json({ message: "You do not have access to this appointment" })
//     }

//     // Update appointment status
//     appointment.status = "cancelled"
//     appointment.cancelledBy = req.user.id
//     appointment.cancellationReason = req.body.reason || "No reason provided"
//     appointment.cancelledAt = new Date()

//     await appointment.save()

//     // Send cancellation emails
//     try {
//       await appointment.populate([
//         { path: "patient", select: "name email phone" },
//         {
//           path: "doctor",
//           select: "user specialty location",
//           populate: { path: "user", select: "name email phone" },
//         },
//       ])

//       const appointmentDate = appointment.date.toLocaleDateString()

//       // Email to patient
//       await sendEmail({
//         email: appointment.patient.email,
//         subject: "Appointment Cancelled",
//         message: `Your appointment with Dr. ${appointment.doctor.user.name} on ${appointmentDate} at ${appointment.time} has been cancelled.`,
//       })

//       // Email to doctor
//       await sendEmail({
//         email: appointment.doctor.user.email,
//         subject: "Appointment Cancelled",
//         message: `Your appointment with ${appointment.patient.name} on ${appointmentDate} at ${appointment.time} has been cancelled.`,
//       })
//     } catch (err) {
//       console.log("Error sending cancellation emails:", err)
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         appointment,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" })
//   }
// }

// // get doctor appointments
// const getDoctorAppointments = async (req, res) => {
//   try {
//     const doctor = await Doctor.findOne({ user: req.user.id })

//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor profile not found" })
//     }

//     const { status, date, page = 1, limit = 10 } = req.query

//     const query = { doctor: doctor._id }

//     if (status) {
//       query.status = status
//     }

//     if (date) {
//       const searchDate = new Date(date)
//       const nextDay = new Date(searchDate)
//       nextDay.setDate(nextDay.getDate() + 1)

//       query.date = {
//         $gte: searchDate,
//         $lt: nextDay,
//       }
//     }

//     const appointments = await Appointment.find(query)
//       .sort({ date: 1, time: 1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .populate("patient", "name email phone avatar")

//     const total = await Appointment.countDocuments(query)

//     res.status(200).json({
//       status: "success",
//       results: appointments.length,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       data: {
//         appointments,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" })
//   }
// }

// // get appointment stats
// const getAppointmentStats = async (req, res) => {
//   try {
//     const matchQuery = {}

//     if (req.user.role === "doctor") {
//       const doctor = await Doctor.findOne({ user: req.user.id })
//       if (!doctor) {
//         return res.status(404).json({ message: "Doctor profile not found" })
//       }
//       matchQuery.doctor = doctor._id
//     } else if (req.user.role === "patient") {
//       matchQuery.patient = req.user.id
//     }

//     const stats = await Appointment.aggregate([
//       { $match: matchQuery },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//           totalRevenue: { $sum: "$totalAmount" },
//         },
//       },
//     ])

//     const monthlyStats = await Appointment.aggregate([
//       {
//         $match: {
//           ...matchQuery,
//           createdAt: {
//             $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: { $dayOfMonth: "$date" },
//           count: { $sum: 1 },
//           revenue: { $sum: "$totalAmount" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ])

//     res.status(200).json({
//       status: "success",
//       data: {
//         stats,
//         monthlyStats,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" })
//   }
// }

// module.exports = {
//   createAppointment,
//   getMyAppointments,
//   getAppointment,
//   updateAppointment,
//   cancelAppointment,
//   getDoctorAppointments,
//   getAppointmentStats,
// }
