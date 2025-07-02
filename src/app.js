const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;
