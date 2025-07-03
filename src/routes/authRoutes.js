const express = require("express");
const router = express.Router();
const { 
    register, 
    login, 
    logout, 
    refreshToken, 
    getProfile, 
    updateProfile, 
    deleteUser 
} = require("../controllers/authController");
const auth = require("../middlewares/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// Protected routes (require authentication)
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.delete("/profile", auth, deleteUser);

module.exports = router;