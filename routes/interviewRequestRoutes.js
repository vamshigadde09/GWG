const express = require("express");
const {
  createInterviewRequest,
  getStudentInterviewRequests,
  notifySelectedTeachers,
  rejectInterviewRequest,
  getAcceptedRequests,
  acceptInterviewRequest,
  submitFeedback,
  updateAttendance,
  getFeedbackForStudent,
  deleteStudentInterviewRequest,
} = require("../controllers/interviewRequestCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createInterviewRequest);
router.get("/studentRequests", authMiddleware, getStudentInterviewRequests);
router.post("/notify", authMiddleware, notifySelectedTeachers);
router.post("/reject", authMiddleware, rejectInterviewRequest);
router.post("/accept", authMiddleware, acceptInterviewRequest);
router.put("/attendance", authMiddleware, updateAttendance);
router.post("/submitFeedback", authMiddleware, submitFeedback);
router.get("/acceptedRequests", authMiddleware, getAcceptedRequests);
router.get("/studentFeedback", authMiddleware, getFeedbackForStudent);
router.delete("/studentRequests/:applicationId", deleteStudentInterviewRequest);

module.exports = router;
