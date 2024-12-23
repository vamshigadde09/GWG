const mongoose = require("mongoose");

const teacherRequestSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
  },
  interviewRequestId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("TeacherRequest", teacherRequestSchema);
