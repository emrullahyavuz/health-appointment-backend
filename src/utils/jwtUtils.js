const jwt = require("jsonwebtoken");

// Create Access Token
const createAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "24h" }
    );
};

// Create Refresh Token
const createRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d" }
    );
};

// Verify Access Token
const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}; 