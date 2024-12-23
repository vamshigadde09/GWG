const express = require("express");
const {
  loginController,
  registerController,
  authController,
  updateProfile,
  updateTeacherProfile,
  searchTeachers,
  getTeacherDetails,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/getUserData", authMiddleware, authController);
router.put("/updateProfile", authMiddleware, updateProfile);
router.put("/updateTeacherProfile", authMiddleware, updateTeacherProfile);
router.get("/searchTeachers", authMiddleware, searchTeachers);
router.get("/teacher/:id", authMiddleware, getTeacherDetails);

module.exports = router;
