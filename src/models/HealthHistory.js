const mongoose = require("mongoose")

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dosage: String,
  frequency: String,
  startDate: Date,
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
})

const allergySchema = new mongoose.Schema({
  allergen: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ["mild", "moderate", "severe"],
    required: true,
  },
  reaction: String,
  diagnosedDate: Date,
})

const vitalSignsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number,
  },
  heartRate: Number,
  temperature: Number,
  weight: Number,
  height: Number,
  bmi: Number,
  bloodSugar: Number,
  oxygenSaturation: Number,
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

const medicalConditionSchema = new mongoose.Schema({
  condition: {
    type: String,
    required: true,
  },
  diagnosedDate: Date,
  status: {
    type: String,
    enum: ["active", "resolved", "chronic", "monitoring"],
    default: "active",
  },
  severity: {
    type: String,
    enum: ["mild", "moderate", "severe"],
  },
  notes: String,
  diagnosedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
})

const labResultSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
  },
  testDate: {
    type: Date,
    required: true,
  },
  results: [
    {
      parameter: String,
      value: String,
      unit: String,
      referenceRange: String,
      status: {
        type: String,
        enum: ["normal", "abnormal", "critical"],
      },
    },
  ],
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  labName: String,
  fileUrl: String, // URL to uploaded lab report
})

const healthHistorySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
      unique: true,
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },
    medications: [medicationSchema],
    allergies: [allergySchema],
    medicalConditions: [medicalConditionSchema],
    vitalSigns: [vitalSignsSchema],
    labResults: [labResultSchema],
    surgicalHistory: [
      {
        procedure: {
          type: String,
          required: true,
        },
        date: Date,
        hospital: String,
        surgeon: String,
        notes: String,
        complications: String,
      },
    ],
    familyHistory: [
      {
        relationship: {
          type: String,
          required: true,
        },
        condition: {
          type: String,
          required: true,
        },
        ageOfOnset: Number,
        notes: String,
      },
    ],
    socialHistory: {
      smoking: {
        status: {
          type: String,
          enum: ["never", "former", "current"],
        },
        packsPerDay: Number,
        yearsSmoked: Number,
        quitDate: Date,
      },
      alcohol: {
        status: {
          type: String,
          enum: ["never", "occasional", "regular", "heavy"],
        },
        drinksPerWeek: Number,
      },
      exercise: {
        frequency: {
          type: String,
          enum: ["never", "rarely", "sometimes", "regularly", "daily"],
        },
        type: String,
        duration: Number, // minutes per session
      },
      diet: {
        type: {
          type: String,
          enum: ["omnivore", "vegetarian", "vegan", "pescatarian", "other"],
        },
        restrictions: [String],
        notes: String,
      },
    },
    immunizations: [
      {
        vaccine: {
          type: String,
          required: true,
        },
        date: Date,
        provider: String,
        lotNumber: String,
        nextDueDate: Date,
      },
    ],
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      groupNumber: String,
      subscriberId: String,
      effectiveDate: Date,
      expirationDate: Date,
    },
    preferences: {
      preferredPharmacy: String,
      preferredHospital: String,
      languagePreference: String,
      communicationPreference: {
        type: String,
        enum: ["email", "sms", "phone", "mail"],
      },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for current BMI
healthHistorySchema.virtual("currentBMI").get(function () {
  const latestVitals = this.vitalSigns.sort((a, b) => b.date - a.date)[0]

  if (latestVitals && latestVitals.weight && latestVitals.height) {
    const heightInMeters = latestVitals.height / 100
    return Math.round((latestVitals.weight / (heightInMeters * heightInMeters)) * 10) / 10
  }
  return null
})

// Virtual for active medications
healthHistorySchema.virtual("activeMedications").get(function () {
  return this.medications.filter((med) => med.isActive)
})

// Virtual for active conditions
healthHistorySchema.virtual("activeConditions").get(function () {
  return this.medicalConditions.filter((condition) => condition.status === "active" || condition.status === "chronic")
})

// Update lastUpdated before saving
healthHistorySchema.pre("save", function (next) {
  this.lastUpdated = new Date()
  next()
})

// Populate references
healthHistorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "patient",
    select: "name email phone dateOfBirth gender",
  })
  next()
})

module.exports = mongoose.model("HealthHistory", healthHistorySchema)
