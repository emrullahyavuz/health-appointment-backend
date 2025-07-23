const User = require("../models/User");

// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;
        if (age !== null && user.age !== age) {
          user.age = age;
          await user.save();
        }
        res.status(200).json({ user: { ...user.toObject(), age } });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email, phone, dateOfBirth, gender,bloodType, address, emergencyContact } = req.body;
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
        if (bloodType) user.bloodType = bloodType;
        if (address) user.address = address;
        if (emergencyContact) user.emergencyContact = emergencyContact;
        if (req.file) {
            user.avatar = `/uploads/avatars/${req.file.filename}`;
        }
        user.updatedAt = Date.now();
        // Age hesapla ve kaydet
        user.age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;
        await user.save();
        const age = user.age;
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            updatedAt: user.updatedAt,
            avatar: user.avatar,
            age
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
        // Age güncellemesi
        for (const user of users) {
          const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;
          if (age !== null && user.age !== age) {
            user.age = age;
            await user.save();
          }
        }
        const usersWithAge = users.map(user => ({ ...user.toObject(), age: user.age }));
        res.status(200).json({ users: usersWithAge });
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
        const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;
        if (age !== null && user.age !== age) {
          user.age = age;
          await user.save();
        }
        res.status(200).json({ user: { ...user.toObject(), age } });
    } catch (error) {
        console.error("Get user by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update user by ID (admin only)
const updateUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, phone, role, isActive, dateOfBirth, gender, bloodType, address, emergencyContact } = req.body;
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
        if (bloodType) user.bloodType = bloodType;
        if (address) user.address = address;
        if (emergencyContact) user.emergencyContact = emergencyContact;
        user.updatedAt = Date.now();
        // Age hesapla ve kaydet
        user.age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;
        await user.save();
        const age = user.age;
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            updatedAt: user.updatedAt,
            age
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

// Yardımcı fonksiyon
function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

module.exports = {
    getProfile,
    updateProfile,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}; 