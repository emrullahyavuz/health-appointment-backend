const mongoose = require("mongoose")

const workingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  startTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)"],
  },
  endTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
})

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialty: {
      type: String,
      required: [true, "Specialty is required"],
      enum: [
        "Cardiology",
        "Neurology",
        "Pediatrics",
        "Orthopedics",
        "Dermatology",
        "Gastroenterology",
        "Psychiatry",
        "Ophthalmology",
        "General Medicine",
        "Surgery",
        "Gynecology",
        "Urology",
        "Oncology",
        "Radiology",
        "Anesthesiology",
        "Emergency Medicine",
      ],
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
      max: [60, "Experience cannot exceed 60 years"],
    },
    education: {
      type: String,
      required: [true, "Education is required"],
      maxlength: [1000, "Education cannot exceed 1000 characters"],
    },
    languages: [
      {
        type: String,
        enum: [
          "English",
          "Spanish",
          "French",
          "German",
          "Italian",
          "Portuguese",
          "Mandarin",
          "Arabic",
          "Hindi",
          "Turkish",
        ],
      },
    ],
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: [0, "Consultation fee cannot be negative"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    about: {
      type: String,
      maxlength: [2000, "About section cannot exceed 2000 characters"],
    },
    workingHours: [workingHoursSchema],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocuments: [
      {
        type: String, // URLs to uploaded documents
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalPatients: {
      type: Number,
      default: 0,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for next available slot
doctorSchema.virtual("nextAvailableSlot").get(function () {
  const now = new Date()
  const today = now.getDay() // 0 = Sunday, 1 = Monday, etc.
  const currentTime = now.getHours() * 60 + now.getMinutes()

  // Find next available slot
  for (let i = 0; i < 7; i++) {
    const dayIndex = (today + i) % 7
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const daySchedule = this.workingHours.find((wh) => wh.day === dayNames[dayIndex] && wh.isAvailable)

    if (daySchedule) {
      const [startHour, startMin] = daySchedule.startTime.split(":").map(Number)
      const startTimeMinutes = startHour * 60 + startMin

      if (i === 0 && currentTime < startTimeMinutes) {
        return `Today ${daySchedule.startTime}`
      } else if (i === 1) {
        return `Tomorrow ${daySchedule.startTime}`
      } else if (i > 1) {
        return `${dayNames[dayIndex]} ${daySchedule.startTime}`
      }
    }
  }

  return null
})

// Index for better query performance
doctorSchema.index({ specialty: 1, isAvailable: 1, rating: -1 })
doctorSchema.index({ location: 1 })
doctorSchema.index({ user: 1 })

// Populate user data by default
doctorSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phone avatar",
  })
  next()
})

module.exports = mongoose.model("Doctor", doctorSchema)
