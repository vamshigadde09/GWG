const express = require("express");
const {
  getTeacherNotifications,
  updateNotificationStatus,
  updateTeacherAvailability,
  getTeacherAvailability,
  getTeacherDetails,
  feedback,
  attendance,
} = require("../controllers/teacherRequestCtrl");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/notifications", authMiddleware, getTeacherNotifications);

router.put(
  "/notifications/:applicationNumber/status",
  authMiddleware,
  updateNotificationStatus
);

router.put("/availability", authMiddleware, updateTeacherAvailability);

router.get("/availability", authMiddleware, getTeacherAvailability);

router.get("/teacher/:id", authMiddleware, getTeacherDetails);
router.post("/feedback", authMiddleware, feedback);
router.put("/attendance", authMiddleware, attendance);

module.exports = router;
