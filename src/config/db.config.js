const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/health-appointment";
        
        if (!mongoURI) {
            throw new Error("MONGO_URI environment variable is not set. Please check your .env file.");
        }
        
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        console.log("Please ensure:");
        console.log("1. Your .env file exists in the project root");
        console.log("2. MONGO_URI is properly set in your .env file");
        console.log("3. MongoDB is running and accessible");
        process.exit(1);
    }
};

module.exports = connectDB;