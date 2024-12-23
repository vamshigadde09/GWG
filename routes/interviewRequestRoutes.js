const express = require("express");
const {
  createInterviewRequest,
  getStudentInterviewRequests,
  notifySelectedTeachers,
  rejectInterviewRequest,
} = require("../controllers/interviewRequestCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createInterviewRequest);
router.get("/studentRequests", authMiddleware, getStudentInterviewRequests);
router.post("/notify", authMiddleware, notifySelectedTeachers);
router.post("/reject", authMiddleware, rejectInterviewRequest);

module.exports = router;
