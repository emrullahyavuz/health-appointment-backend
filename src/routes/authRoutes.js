const express = require("express");
const router = express.Router();
const { 
    register, 
    login, 
    updatePassword,
    logout, 
    refreshToken,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");
const { registerSchema, loginSchema } = require("../validators/userValidator");
const validateBody = require("../middlewares/validateBody");
const auth = require("../middlewares/auth");

// Authentication routes
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/update-password", auth, updatePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", auth, logout);
router.post("/refresh-token", auth, refreshToken);

// Email verification routes
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

module.exports = router;