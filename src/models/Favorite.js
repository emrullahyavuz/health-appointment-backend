const mongoose = require("mongoose")

const favoriteSchema = new mongoose.Schema(
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
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    tags: [
      {
        type: String,
        maxlength: [50, "Tag cannot exceed 50 characters"],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Ensure unique favorite per patient-doctor pair
favoriteSchema.index({ patient: 1, doctor: 1 }, { unique: true })
favoriteSchema.index({ patient: 1, createdAt: -1 })

// Populate doctor data
favoriteSchema.pre(/^find/, function (next) {
  this.populate({
    path: "doctor",
    select: "user specialty location rating reviewCount consultationFee",
    populate: {
      path: "user",
      select: "name avatar",
    },
  })
  next()
})

module.exports = mongoose.model("Favorite", favoriteSchema)
