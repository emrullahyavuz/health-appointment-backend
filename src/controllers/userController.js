const User = require("../models/User");

// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
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
        const { name, email, phone, dateOfBirth, gender, address, emergencyContact, avatar } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email is already taken" });
            }
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (gender) user.gender = gender;
        if (address) user.address = address;
        if (emergencyContact) user.emergencyContact = emergencyContact;
        if (avatar) user.avatar = avatar;
        user.updatedAt = Date.now();
        await user.save();
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
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
        const users = await User.find({}).select("-password");
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
        if (!user) {
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
        const { name, email, phone, role, isActive, dateOfBirth, gender, address, emergencyContact, avatar } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email is already taken" });
            }
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (role) user.role = role;
        if (typeof isActive === 'boolean') user.isActive = isActive;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (gender) user.gender = gender;
        if (address) user.address = address;
        if (emergencyContact) user.emergencyContact = emergencyContact;
        if (avatar) user.avatar = avatar;
        user.updatedAt = Date.now();
        await user.save();
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
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