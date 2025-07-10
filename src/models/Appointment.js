const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required"],
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: (value) => value > new Date(),
        message: "Appointment date must be in the future",
      },
    },
    time: {
      type: String,
      required: [true, "Appointment time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)"],
    },
    type: {
      type: String,
      required: [true, "Appointment type is required"],
      enum: [
        "General Consultation",
        "Follow-up Visit",
        "Emergency Consultation",
        "Routine Check-up",
        "Second Opinion",
        "Vaccination",
        "Health Screening",
      ],
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "in-progress", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    symptoms: {
      type: String,
      required: [true, "Symptoms or reason for visit is required"],
      maxlength: [1000, "Symptoms description cannot exceed 1000 characters"],
    },
    notes: {
      type: String,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
    doctorNotes: {
      type: String,
      maxlength: [2000, "Doctor notes cannot exceed 2000 characters"],
    },
    prescription: {
      type: String,
      maxlength: [2000, "Prescription cannot exceed 2000 characters"],
    },
    diagnosis: {
      type: String,
      maxlength: [1000, "Diagnosis cannot exceed 1000 characters"],
    },
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: [0, "Consultation fee cannot be negative"],
    },
    serviceFee: {
      type: Number,
      default: 10,
      min: [0, "Service fee cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "cash", "insurance"],
    },
    paymentId: String, // Payment gateway transaction ID
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancellationReason: String,
    cancelledAt: Date,
    reminderSent: {
      type: Boolean,
      default: false,
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: Date,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for appointment duration
appointmentSchema.virtual("duration").get(() => {
  return 30 // Default 30 minutes
})

// Virtual for full appointment datetime
appointmentSchema.virtual("appointmentDateTime").get(function () {
  const [hours, minutes] = this.time.split(":")
  const appointmentDate = new Date(this.date)
  appointmentDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
  return appointmentDate
})

// Calculate total amount before saving
appointmentSchema.pre("save", function (next) {
  if (this.isModified("consultationFee") || this.isModified("serviceFee")) {
    this.totalAmount = (this.consultationFee || 0) + (this.serviceFee || 0)
  }
  next()
})

// Indexes for better query performance
appointmentSchema.index({ patient: 1, date: -1 })
appointmentSchema.index({ doctor: 1, date: -1 })
appointmentSchema.index({ date: 1, time: 1 })
appointmentSchema.index({ status: 1 })

// Populate patient and doctor data
appointmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "patient",
    select: "name email phone avatar",
  }).populate({
    path: "doctor",
    select: "user specialty location consultationFee",
    populate: {
      path: "user",
      select: "name email phone avatar",
    },
  })
  next()
})

module.exports = mongoose.model("Appointment", appointmentSchema)
