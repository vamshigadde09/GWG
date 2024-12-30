const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    // Linking Feedback to Interview Request
    interviewRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewRequest",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Performance Ratings (1-5 scale)
    communicationSkills: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    technicalKnowledge: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    problemSolvingAbility: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    confidenceAndBodyLanguage: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    timeManagement: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    overallPerformance: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    // Strengths and Areas for Improvement
    strengths: {
      type: String,
      required: true,
      default: "",
    },
    areasForImprovement: {
      type: String,
      required: true,
      default: "",
    },

    // Detailed Feedback Sections
    detailedFeedback: {
      openingStatement: {
        type: String,
        default: "",
      },
      technicalAnalysis: {
        type: String,
        default: "",
      },
      problemSolvingDiscussion: {
        type: String,
        default: "",
      },
      communicationObservations: {
        type: String,
        default: "",
      },
      behavioralAssessment: {
        type: String,
        default: "",
      },
      closingRemarks: {
        type: String,
        default: "",
      },
    },

    // Actionable Suggestions
    actionableSuggestions: {
      type: [String], // Array of specific, actionable points for improvement
      default: [],
    },

    // Additional Comments
    additionalComments: {
      type: String,
      default: "",
    },

    // Recommendation
    recommendation: {
      type: Boolean,
      default: false,
    },

    // Student Feedback Interaction
    studentFeedbackReviewed: {
      type: Boolean,
      default: false,
    },
    studentReflection: {
      type: String,
      default: "",
    },

    // Feedback Status
    feedbackStatus: {
      type: String,
      enum: ["Draft", "Submitted", "Reviewed"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
