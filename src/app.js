const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/cors.config.js");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const doctorRoutes = require("./routes/doctorRoutes.js");
const appointmentRoutes = require("./routes/appointmentRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const morgan = require("morgan");
const rateLimit = require("./middlewares/rateLimit.js");
const errorHandler = require("./middlewares/errorHandler");
const helmet = require("./middlewares/helmetConfig");
const mongoSanitize = require("express-mongo-sanitize")
const path = require("path");

// Middlewares
app.use(morgan("dev"));
app.use(helmet);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Rate limit
app.use(rateLimit);
app.use("/api", rateLimit)

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
// app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Error handler
app.use(errorHandler);

module.exports = app;
