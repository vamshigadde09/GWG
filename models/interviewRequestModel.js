const mongoose = require("mongoose");

const interviewRequestSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    studentName: { type: String, required: true },
    topic: {
      type: String,
      enum: ["Coding", "Soft Skills", "Problem-Solving", "Behavioral"],
      required: true,
    },
    skills: { type: [String], required: true },
    interviewType: {
      type: String,
      enum: ["Technical", "HR", "Case Study", "Behavioral"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    interviewMode: {
      type: String,
      enum: ["Video Call", "In-Person"],
      required: true,
    },
    driveLink: { type: String, default: "" },
    resourcesLink: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending",
    },
    attendance: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },
    feedback: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    teacher: [
      {
        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "teacherProfile",
          required: true,
        },
        rejectionReason: { type: String, default: "" },
        acceptedResponse: { type: String, default: "" },
        status: {
          type: String,
          enum: ["Accepted", "Rejected", "Pending", "Completed"],
          default: "Pending",
        },
      },
    ],

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    noteacher: { type: Boolean, default: false },
    finalfeedback: { type: Boolean, default: false },

    applicationNumber: { type: Number, unique: true, required: true },
  },

  { timestamps: true }
);

// Ensure applicationNumber is unique
interviewRequestSchema.index(
  { applicationNumber: 1, studentId: 1 },
  { unique: true }
);

module.exports = mongoose.model("InterviewRequest", interviewRequestSchema);
