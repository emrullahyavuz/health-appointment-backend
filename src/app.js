const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/cors.config.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
