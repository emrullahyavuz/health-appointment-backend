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
const requireRole = require("../middlewares/requireRole");
const ROLES = require("../constants/roles");

// User profile routes (authenticated users)
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("avatar"), updateProfile);
router.delete("/profile", auth, deleteUser);

// Admin routes (admin only)
router.get("/", auth, requireRole(ROLES.ADMIN), getAllUsers);
router.get("/:userId", auth, requireRole(ROLES.ADMIN), getUserById);
router.put("/:userId", auth, requireRole(ROLES.ADMIN), updateUserById);
router.delete("/:userId", auth, requireRole(ROLES.ADMIN), deleteUserById);

module.exports = router; 