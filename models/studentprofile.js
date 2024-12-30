const mongoose = require("mongoose");

const Studentprofile = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profilePicture: { type: String, default: "" },
  name: String,
  phone: { type: String },
  department: { type: String, required: true },
  batch: { type: String, required: true },
  program: { type: String, required: true },
  specialization: { type: String, required: true },
  branch: { type: String, required: true },
  linkedIn: { type: String, default: "" },
  languages: [{ type: String }],
  careerGoals: { type: String, default: "" },
  projects: [
    {
      title: String,
      description: String,
      technologiesUsed: [String],
      link: String,
    },
  ],
  gpa: { type: Number },

  mockInterviewHistory: [
    {
      interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MockInterview",
      },
      date: Date,
      topic: String,
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
      feedback: String,
    },
  ],
  teacherFeedback: [
    {
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
      topic: String,
      feedback: String,
      date: Date,
    },
  ],
  additionalNotes: { type: String, default: "" },

  isProfileUpdated: { type: Boolean, default: false },
});

module.exports = mongoose.model("Studentprofile", Studentprofile);
