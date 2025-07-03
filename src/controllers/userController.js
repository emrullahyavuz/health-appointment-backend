const User = require("../models/User");

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

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).select("-password");
        res.status(200).json({ users });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId).select("-password");
        if (!user || user.isDeleted) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Get user by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update user by ID (admin only)
const updateUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, role, isActive } = req.body;

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
        if (role) user.role = role;
        if (typeof isActive === 'boolean') user.isActive = isActive;
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
            message: "User updated successfully", 
            user: userResponse 
        });
    } catch (error) {
        console.error("Update user by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete user by ID (admin only - soft delete)
const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.params;

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
        console.error("Delete user by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}; 