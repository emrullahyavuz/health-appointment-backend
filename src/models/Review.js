const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      maxlength: [1000, "Review comment cannot exceed 1000 characters"],
      minlength: [10, "Review comment must be at least 10 characters"],
    },
    aspects: {
      communication: {
        type: Number,
        min: 1,
        max: 5,
      },
      professionalism: {
        type: Number,
        min: 1,
        max: 5,
      },
      punctuality: {
        type: Number,
        min: 1,
        max: 5,
      },
      cleanliness: {
        type: Number,
        min: 1,
        max: 5,
      },
      overallExperience: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    wouldRecommend: {
      type: Boolean,
      default: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    reportedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: String,
        reportedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isHidden: {
      type: Boolean,
      default: false,
    },
    doctorResponse: {
      message: String,
      respondedAt: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Ensure one review per appointment
reviewSchema.index({ patient: 1, appointment: 1 }, { unique: true })
reviewSchema.index({ doctor: 1, createdAt: -1 })
reviewSchema.index({ rating: -1 })

// Populate patient and doctor data
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "patient",
    select: "name avatar",
  }).populate({
    path: "doctor",
    select: "user specialty",
    populate: {
      path: "user",
      select: "name",
    },
  })
  next()
})

// Update doctor's rating after review is saved
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRating(this.doctor)
})

// Update doctor's rating after review is removed
reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRating(this.doctor)
})

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function (doctorId) {
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId, isHidden: false },
    },
    {
      $group: {
        _id: "$doctor",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ])

  if (stats.length > 0) {
    await mongoose.model("Doctor").findByIdAndUpdate(doctorId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].numReviews,
    })
  } else {
    await mongoose.model("Doctor").findByIdAndUpdate(doctorId, {
      rating: 0,
      reviewCount: 0,
    })
  }
}

module.exports = mongoose.model("Review", reviewSchema)
