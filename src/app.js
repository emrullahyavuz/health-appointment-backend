const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/cors.config.js");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const morgan = require("morgan");
const rateLimit = require("./middlewares/rateLimit.js");

// Middlewares
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
