const jwtUtils = require("../utils/jwtUtils");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    let token;

    // Önce Authorization header'ı kontrol et
    const authHeader = req.headers.authorization || req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Token doğrulama
    let decoded;
    try {
      decoded = jwtUtils.verifyAccessToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired." });
      }
      return res.status(401).json({ message: "Invalid token." });
    }

    // Kullanıcı kontrolü
    const user = await User.findById(decoded.userId);
    if (!user || user.isDeleted || !user.isActive) {
      return res.status(401).json({ message: "Invalid token. User not found or inactive." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = auth;
