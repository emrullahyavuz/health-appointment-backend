const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.cookies.accessToken || req.header["Authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    let token;
    if (req.header("Authorization")) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
    }else{
      token = req.cookies.accessToken;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    // Check if user exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || user.isDeleted || !user.isActive) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found or inactive." });
    }

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = auth;
