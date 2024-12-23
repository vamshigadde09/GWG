const InterviewRequest = require("../models/interviewRequestModel");
const TeacherProfile = require("../models/teacherporfile");

const generateUniqueApplicationNumber = async () => {
  let isUnique = false;
  let applicationNumber;
  while (!isUnique) {
    applicationNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    const existing = await InterviewRequest.findOne({ applicationNumber });
    if (!existing) isUnique = true;
  }
  return applicationNumber;
};

const createInterviewRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      topic,
      skills,
      interviewType,
      experienceLevel,
      date,
      startTime,
      interviewMode,
      teacher = [],
      driveLink = "",
      resourcesLink = "",
    } = req.body;

    if (!name || !email || !topic || !date || !startTime) {
      return res.status(400).send({
        message: "Required fields are missing.",
        success: false,
      });
    }

    const applicationNumber = await generateUniqueApplicationNumber();
    const studentName = req.user.name;
    const noteacher = teacher.length === 0;

    const newRequest = new InterviewRequest({
      name,
      email,
      topic,
      skills,
      interviewType,
      experienceLevel,
      date,
      startTime,
      interviewMode,
      teacher,
      driveLink,
      resourcesLink,
      applicationNumber,
      studentId: req.user.id,
      studentName,
      noteacher,
    });

    await newRequest.save();

    await notifySelectedTeachers(teacher, {
      name,
      email,
      topic,
      skills,
      interviewType,
      experienceLevel,
      date,
      startTime,
      interviewMode,
      driveLink,
      resourcesLink,
      applicationNumber,
    });

    res.status(201).send({
      message: "Interview request created successfully.",
      success: true,
      data: { applicationNumber },
    });
  } catch (error) {
    console.error("Error creating interview request:", error.message);
    res.status(500).send({
      message: `Server Error: ${error.message}`,
      success: false,
    });
  }
};

const getStudentInterviewRequests = async (req, res) => {
  try {
    const applications = await InterviewRequest.find({ studentId: req.user.id })
      .populate({
        path: "teacher.teacherId",
        select: "name designation skills",
      })
      .exec();

    res.status(200).json({
      message: "Applications fetched successfully",
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

const notifySelectedTeachers = async (teacherObjects, applicationDetails) => {
  try {
    // Extract teacher IDs from the teacher objects
    const teacherIds = teacherObjects.map((teacher) => teacher.teacherId);

    // Fetch the teachers using their IDs
    const teachers = await TeacherProfile.find({ _id: { $in: teacherIds } });

    if (teachers.length === 0) {
      console.error("No teachers found for the provided IDs.");
      return;
    }

    // Add notifications to each teacher
    await Promise.all(
      teachers.map(async (teacher) => {
        teacher.notifications.push({
          type: `New Interview Request by ${applicationDetails.name}`,
          applicationNumber: applicationDetails.applicationNumber,
          details: {
            email: applicationDetails.email,
            topic: applicationDetails.topic,
            skills: applicationDetails.skills,
            interviewType: applicationDetails.interviewType,
            experienceLevel: applicationDetails.experienceLevel,
            date: applicationDetails.date,
            startTime: applicationDetails.startTime,
            interviewMode: applicationDetails.interviewMode,
            driveLink: applicationDetails.driveLink,
            resourcesLink: applicationDetails.resourcesLink,
          },
        });

        await teacher.save();
      })
    );
  } catch (error) {
    console.error("Error notifying teachers:", error.message);
  }
};

const rejectInterviewRequest = async (req, res) => {
  const { applicationNumber, teacherId, reason } = req.body;

  // Validate required fields
  if (!teacherId) {
    console.error("Missing teacherId in request body.");
    return res.status(400).send("Missing teacherId in request body.");
  }

  if (!applicationNumber) {
    console.error("Missing applicationNumber in request body.");
    return res.status(400).send("Missing applicationNumber in request body.");
  }

  if (!reason || reason.trim() === "") {
    console.error("Rejection reason is required.");
    return res.status(400).send("Rejection reason is required.");
  }

  try {
    const interview = await InterviewRequest.findOne({ applicationNumber });
    if (!interview) {
      console.error(
        `Interview request not found for applicationNumber: ${applicationNumber}`
      );
      return res.status(404).send("Application not found.");
    }

    const teacherEntry = interview.teacher.find(
      (t) => t.teacherId.toString() === teacherId
    );

    if (!teacherEntry) {
      console.error(`Teacher ID ${teacherId} not associated with application.`);
      return res
        .status(404)
        .send("Teacher not associated with this application.");
    }

    teacherEntry.rejectionReason = reason;

    const allRejected = interview.teacher.every((t) => t.rejectionReason);
    if (allRejected) {
      interview.status = "Rejected";
    }

    await interview.save();

    const teacher = await TeacherProfile.findOne({ _id: teacherId });
    if (teacher) {
      const notification = teacher.notifications.find(
        (n) => n.applicationNumber === applicationNumber
      );
      if (notification) {
        notification.status = "Rejected";
      } else {
        console.error(
          "Notification not found for application:",
          applicationNumber
        );
      }
      await teacher.save();
    } else {
      console.error(`Teacher profile not found for ID: ${teacherId}`);
    }

    res.status(200).send({ message: "Rejection reason updated successfully." });
  } catch (error) {
    console.error("Error rejecting interview request:", error.message);
    res.status(500).send({ message: "Server error: " + error.message });
  }
};

module.exports = {
  createInterviewRequest,
  getStudentInterviewRequests,
  notifySelectedTeachers,
  rejectInterviewRequest,
};
