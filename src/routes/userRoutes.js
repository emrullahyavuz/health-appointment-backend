const express = require("express");
const router = express.Router();
const { 
    getProfile, 
    updateProfile, 
    deleteUser, 
    getAllUsers, 
    getUserById, 
    updateUserById, 
    deleteUserById 
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// User profile routes (authenticated users)
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("avatar"), updateProfile);
router.delete("/profile", auth, deleteUser);

// Admin routes (admin only)
router.get("/", auth, getAllUsers);
router.get("/:userId", auth, getUserById);
router.put("/:userId", auth, updateUserById);
router.delete("/:userId", auth, deleteUserById);

module.exports = router; 