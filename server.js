const express = require("express");
const app = express();

const PORT = 3000;

app.get("/api/test", (req, res) => {
    res.send("Welcome to the Health Appointment API");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





