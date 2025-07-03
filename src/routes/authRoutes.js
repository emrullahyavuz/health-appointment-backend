const express = require("express");
const router = express.Router();
const { 
    register, 
    login, 
    logout, 
    refreshToken 
} = require("../controllers/authController");
const { registerSchema, loginSchema } = require("../validator/userValidator");
const validateBody = require("../middlewares/validateBody");

// Authentication routes
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

module.exports = router;