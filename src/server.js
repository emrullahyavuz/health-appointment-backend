require("dotenv").config();
const app = require("./app.js");
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db.config.js");

connectDB();

app.get("/api/test", (req, res) => {
  res.send("Welcome to the Health Appointment API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
