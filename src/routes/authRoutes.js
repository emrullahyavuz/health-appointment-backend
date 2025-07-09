const express = require("express");
const router = express.Router();
const { 
    register, 
    login, 
    updatePassword,
    logout, 
    refreshToken 
} = require("../controllers/authController");
const { registerSchema, loginSchema } = require("../validators/userValidator");
const validateBody = require("../middlewares/validateBody");
const auth = require("../middlewares/auth");
// Authentication routes
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/update-password", auth, updatePassword);
router.post("/logout", auth, logout);
router.post("/refresh-token", auth, refreshToken);

module.exports = router;