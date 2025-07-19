const Review = require("../models/Review")
const Appointment = require("../models/Appointment")
const Doctor = require("../models/Doctor")

// Create review
const createReview = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, comment, aspects, wouldRecommend, isAnonymous } = req.body

    // Check if appointment exists and belongs to the user
    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only review your own appointments" })
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({ message: "You can only review completed appointments" })
    }

    // Check if review already exists for this appointment
    const existingReview = await Review.findOne({
      patient: req.user.id,
      appointment: appointmentId,
    })

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this appointment" })
    }

    // Create review
    const review = await Review.create({
      patient: req.user.id,
      doctor: doctorId,
      appointment: appointmentId,
      rating,
      comment,
      aspects,
      wouldRecommend,
      isAnonymous,
      isVerified: true, // Since it's linked to a completed appointment
    })

    // Update appointment with rating
    await Appointment.findByIdAndUpdate(appointmentId, {
      rating,
      feedback: comment,
    })

    res.status(201).json({
      status: "success",
      data: {
        review,
      },
    })
  } catch (error) {
    console.error("Create review error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// Get reviews by doctor
const getReviewsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    const reviews = await Review.find({
      doctor: doctorId,
      isHidden: false,
    })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("patient", "name avatar")

    const total = await Review.countDocuments({
      doctor: doctorId,
      isHidden: false,
    })

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { doctor: doctor._id, isHidden: false } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ])

    // Calculate average aspects rating
    const aspectsAverage = await Review.aggregate([
      { $match: { doctor: doctor._id, isHidden: false } },
      {
        $group: {
          _id: null,
          avgCommunication: { $avg: "$aspects.communication" },
          avgProfessionalism: { $avg: "$aspects.professionalism" },
          avgPunctuality: { $avg: "$aspects.punctuality" },
          avgCleanliness: { $avg: "$aspects.cleanliness" },
          avgOverallExperience: { $avg: "$aspects.overallExperience" },
        },
      },
    ])

    res.status(200).json({
      status: "success",
      results: reviews.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        reviews,
        ratingDistribution,
        aspectsAverage: aspectsAverage[0] || {},
      },
    })
  } catch (error) {
    console.error("Get reviews by doctor error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// Get my reviews
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ patient: req.user.id })
      .sort("-createdAt")
      .populate([
        {
          path: "doctor",
          select: "user specialty",
          populate: { path: "user", select: "name avatar" },
        },
        { path: "appointment", select: "date time type" },
      ])

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    })
  } catch (error) {
    console.error("Get my reviews error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// Update review
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    if (review.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own reviews" })
    }

    // Check if review is older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    if (review.createdAt < thirtyDaysAgo) {
      return res.status(400).json({ message: "Reviews can only be updated within 30 days" })
    }

    const allowedFields = ["rating", "comment", "aspects", "wouldRecommend"]
    const updateData = {}

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field]
      }
    })

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: "success",
      data: {
        review: updatedReview,
      },
    })
  } catch (error) {
    console.error("Update review error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    if (review.patient.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own reviews" })
    }

    await Review.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: "success",
      data: null,
    })
  } catch (error) {
    console.error("Delete review error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// Report review
const reportReview = async (req, res) => {
  try {
    const { reason } = req.body
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if user already reported this review
    const alreadyReported = review.reportedBy.some((report) => report.user.toString() === req.user.id)

    if (alreadyReported) {
      return res.status(400).json({ message: "You have already reported this review" })
    }

    review.reportedBy.push({
      user: req.user.id,
      reason,
    })

    await review.save()

    res.status(200).json({
      status: "success",
      message: "Review reported successfully",
    })
  } catch (error) {
    console.error("Report review error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// Respond to review
const respondToReview = async (req, res) => {
  try {
    const { message } = req.body
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if user is the doctor who received the review
    const doctor = await Doctor.findOne({ user: req.user.id })
    if (!doctor || review.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: "You can only respond to reviews about you" })
    }

    review.doctorResponse = {
      message,
      respondedAt: new Date(),
    }

    await review.save()

    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    })
  } catch (error) {
    console.error("Respond to review error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// Vote helpful
const voteHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    review.helpfulVotes += 1
    await review.save()

    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    })
  } catch (error) {
    console.error("Vote helpful error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports = {
  createReview,
  getReviewsByDoctor,
  getMyReviews,
  updateReview,
  deleteReview,
  reportReview,
  respondToReview,
  voteHelpful,
}
