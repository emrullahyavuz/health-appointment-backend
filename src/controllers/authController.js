const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils");
const { createAccessToken, createRefreshToken } = require("../utils/jwtUtils");
const RefreshToken = require("../models/RefreshToken");

// Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email, isDeleted: false });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash password using utility function
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "patient"
        });

        await newUser.save();

        // Remove password from response
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            isActive: newUser.isActive,
            createdAt: newUser.createdAt
        };

        res.status(201).json({ 
            message: "User created successfully", 
            user: userResponse 
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email, isDeleted: false });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ message: "Account is deactivated" });
        }

        // Verify password using utility function
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Delete old refresh token
        await RefreshToken.deleteOne({ userId: user._id });

        // Generate JWT tokens
        const accessToken = createAccessToken({
             userId: user._id ,
             email: user.email,
             role: user.role
            });
        const refreshToken = createRefreshToken({ userId: user._id, email: user.email, role: user.role });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            path: "/"
        };

        // Save refresh token to database
        const newRefreshToken = new RefreshToken({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
        await newRefreshToken.save();



        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions, 
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.cookie("accessToken", accessToken, {
            ...cookieOptions, 
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        // Remove password from response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        };

        res.status(200).json({ 
            message: "User logged in successfully", 
            user: userResponse,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Logout a user
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }
        await RefreshToken.deleteOne({ token: refreshToken });
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Refresh a token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
        
        // Find user
        const user = await User.findById(decoded.userId);
        if (!user || user.isDeleted || !user.isActive) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN}
        );

        res.status(200).json({ 
            message: "Access token refreshed successfully", 
            accessToken: newAccessToken 
        });
    } catch (error) {
        console.error("Token refresh error:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // From JWT middleware
        
        const user = await User.findById(userId).select("-password");
        if (!user || user.isDeleted) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email } = req.body;

        const user = await User.findById(userId);
        if (!user || user.isDeleted) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email, isDeleted: false });
            if (existingUser) {
                return res.status(400).json({ message: "Email is already taken" });
            }
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        user.updatedAt = Date.now();

        await user.save();

        // Remove password from response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            updatedAt: user.updatedAt
        };

        res.status(200).json({ 
            message: "Profile updated successfully", 
            user: userResponse 
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete user (soft delete)
const deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user || user.isDeleted) {
            return res.status(404).json({ message: "User not found" });
        }

        // Soft delete
        user.isDeleted = true;
        user.isActive = false;
        user.updatedAt = Date.now();

        await user.save();

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshToken,
    getProfile,
    updateProfile,
    deleteUser
};
