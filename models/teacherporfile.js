const mongoose = require("mongoose");

const teacherProfile = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    profilePicture: {
      type: String,
      default:
        "D:Projects_GWGGROW-WITH-GURU-mainGROW-WITH-GURU-mainimgprofile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
    },

    contactDetails: String,
    designation: {
      type: String,
      enum: ["Professor", "Research Scholar", "Industry Professional"],
      required: true,
    },
    skills: [
      {
        skillName: { type: String, required: true },
        experienceLevel: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced"],
          required: true,
        },
      },
    ],
    availability: {
      type: [
        {
          day: { type: String, required: true }, // e.g., "Day 5"
          freeSlots: { type: [Number], required: true }, // Array of free slot numbers
        },
      ],
      default: [],
    },
    availabilityNotes: { type: String, default: "" },
    studentHistory: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        interviewDate: Date,
        feedbackGiven: { type: Boolean, default: false },
      },
    ],

    department: {
      type: String,
      enum: ["Technical", "HR", "Case Study", "Behavioral"],
      required: true,
    },
    areasOfExpertise: {
      type: String,
      enum: ["Coding", "Soft Skills", "Problem-Solving", "Behavioral"],
      required: true,
    },
    preferredNotificationMethod: {
      type: String,
      enum: ["Email", "WhatsApp", "In person"],
      required: true,
    },
    publications: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    otherProfessionalLinks: [{ type: String, default: "" }],
    isteacherProfileUpdated: { type: Boolean, default: false },

    feedback: {
      type: String,
      default: "",
    },

    notifications: [
      {
        type: { type: String, required: true },
        applicationNumber: { type: Number, required: true },
        status: { type: String, default: "Pending" },
        details: {
          email: String,
          topic: String,
          skills: [String],
          interviewType: String,
          experienceLevel: String,
          date: Date,
          startTime: String,
          interviewMode: String,
          driveLink: String,
          resourcesLink: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("teacherProfile", teacherProfile);
