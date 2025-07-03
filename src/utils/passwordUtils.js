const bcrypt = require("bcryptjs");

// Hash password
const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Password hashing error:", error);
        throw new Error("Password hashing failed");
    }
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
    try {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        return isPasswordValid;
    } catch (error) {
        console.error("Password verification error:", error);
        throw new Error("Password verification failed");
    }
};

// Generate salt
const generateSalt = async (rounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(rounds);
        return salt;
    } catch (error) {
        console.error("Salt generation error:", error);
        throw new Error("Salt generation failed");
    }
};

module.exports = {
    hashPassword,
    verifyPassword,
    generateSalt
}; 