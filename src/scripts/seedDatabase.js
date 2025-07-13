const mongoose = require("mongoose")
const dotenv = require("dotenv")


// Load environment variables
dotenv.config()

const User = require("../models/User")
const Doctor = require("../models/Doctor")
const Appointment = require("../models/Appointment")
const Review = require("../models/Review")
const HealthHistory = require("../models/HealthHistory")

// Connect to MongoDB
const DB = process.env.MONGO_URI

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))

// Sample data
const sampleUsers = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    password: "password123",
    phone: "+1234567890",
    role: "doctor",
    isVerified: true,
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@hospital.com",
    password: "password123",
    phone: "+1234567891",
    role: "doctor",
    isVerified: true,
  },
  {
    name: "John Smith",
    email: "john.smith@email.com",
    password: "password123",
    phone: "+1234567892",
    role: "patient",
    isVerified: true,
  },
  {
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    password: "password123",
    phone: "+1234567893",
    role: "patient",
    isVerified: true,
  },
]

const sampleDoctors = [
  {
    specialty: "Cardiology",
    experience: 10,
    education: "MD from Harvard Medical School, Cardiology Fellowship at Mayo Clinic",
    languages: ["English", "Spanish"],
    consultationFee: 150,
    location: "New York, NY",
    about: "Experienced cardiologist specializing in heart disease prevention and treatment.",
    workingHours: [
      { day: "Monday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "Thursday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "Friday", startTime: "09:00", endTime: "15:00", isAvailable: true },
    ],
    rating: 4.8,
    reviewCount: 45,
    isVerified: true,
  },
  {
    specialty: "Neurology",
    experience: 8,
    education: "MD from Johns Hopkins, Neurology Residency at UCLA",
    languages: ["English", "Mandarin"],
    consultationFee: 180,
    location: "Los Angeles, CA",
    about: "Neurologist with expertise in brain disorders and neurological conditions.",
    workingHours: [
      { day: "Monday", startTime: "08:00", endTime: "16:00", isAvailable: true },
      { day: "Tuesday", startTime: "08:00", endTime: "16:00", isAvailable: true },
      { day: "Wednesday", startTime: "08:00", endTime: "16:00", isAvailable: true },
      { day: "Thursday", startTime: "08:00", endTime: "16:00", isAvailable: true },
      { day: "Friday", startTime: "08:00", endTime: "14:00", isAvailable: true },
    ],
    rating: 4.9,
    reviewCount: 32,
    isVerified: true,
  },
]

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Doctor.deleteMany({})
    await Appointment.deleteMany({})
    await Review.deleteMany({})
    await HealthHistory.deleteMany({})

    console.log("Existing data cleared!")

    // Create users
    const users = await User.create(sampleUsers)
    console.log("Sample users created!")

    // Create doctors
    const doctorUsers = users.filter((user) => user.role === "doctor")
    const doctorProfiles = sampleDoctors.map((doctor, index) => ({
      ...doctor,
      user: doctorUsers[index]._id,
    }))

    const doctors = await Doctor.create(doctorProfiles)
    console.log("Sample doctors created!")

    // Create health histories for patients
    const patientUsers = users.filter((user) => user.role === "patient")
    const healthHistories = patientUsers.map((patient) => ({
      patient: patient._id,
      bloodType: "O+",
      emergencyContact: {
        name: "Emergency Contact",
        relationship: "Family",
        phone: "+1234567899",
        email: "emergency@email.com",
      },
    }))

    await HealthHistory.create(healthHistories)
    console.log("Sample health histories created!")

    console.log("Database seeded successfully!")
    process.exit()
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
