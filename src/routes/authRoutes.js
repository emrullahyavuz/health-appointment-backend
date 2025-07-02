const express = require("express");
const router = express.Router();

// Register a new user
router.post("/register", (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = {name, email, password};
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
    
});

// Login a user
router.post("/login", (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = {email, password};
        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Logout a user
router.post("/logout", (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = {email, password};
        res.status(200).json({ message: "User logged out successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Refresh a token
router.post("/refresh-token", (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }
        const user = {refreshToken};
        res.status(200).json({ message: "Refresh token generated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;