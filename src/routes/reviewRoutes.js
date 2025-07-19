const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsByDoctor,
  getMyReviews,
  updateReview,
  deleteReview,
  reportReview,
  respondToReview,
  voteHelpful,
} = require("../controllers/reviewController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const ROLES = require("../constants/roles");

// Public routes
router.get("/doctor/:doctorId", getReviewsByDoctor);

// Protected routes
router.use(auth);

router.post("/", requireRole(ROLES.PATIENT), createReview);
router.get("/me", getMyReviews);

router
  .route("/:id")
  .patch(requireRole(ROLES.PATIENT), updateReview)
  .delete(deleteReview);

router.post("/:id/report", reportReview);
router.post("/:id/respond", requireRole(ROLES.DOCTOR), respondToReview);
router.post("/:id/helpful", voteHelpful);

module.exports = router;
