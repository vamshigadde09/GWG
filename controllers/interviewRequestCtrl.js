const InterviewRequest = require("../models/interviewRequestModel");
const TeacherProfile = require("../models/teacherporfile");
const Feedback = require("../models/feedbackModel");
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
      noteacher,
    } = req.body;

    if (!name || !email || !topic || !date || !startTime) {
      return res.status(400).send({
        message: "Required fields are missing.",
        success: false,
      });
    }

    const applicationNumber = await generateUniqueApplicationNumber();
    const studentName = req.user.name;
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

    if (!noteacher) {
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
    }
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

const notifySelectedTeachers = async (teacherObjects, applicationDetails) => {
  try {
    const teacherIds = teacherObjects.map((teacher) => teacher.teacherId);

    const teachers = await TeacherProfile.find({ _id: { $in: teacherIds } });

    if (teachers.length === 0) {
      console.error("No teachers found for the provided IDs.");
      return;
    }

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

const rejectInterviewRequest = async (req, res) => {
  const { applicationNumber, teacherId, reason } = req.body;

  if (!reason || reason.trim() === "") {
    return res.status(400).send("Rejection reason is required.");
  }

  try {
    const interview = await InterviewRequest.findOne({ applicationNumber });

    const teacherEntry = interview.teacher.find(
      (t) => t.teacherId.toString() === teacherId
    );

    if (!teacherEntry) {
      return res
        .status(404)
        .send("Teacher not associated with this application.");
    }

    teacherEntry.rejectionReason = reason;
    teacherEntry.status = "Rejected";

    // Check if all teacher statuses are either Rejected or Accepted
    const allRejected = interview.teacher.every((t) => t.status === "Rejected");

    if (allRejected) {
      interview.status = "Rejected"; // Update global status
    }

    await interview.save();
    res.status(200).send({ message: "Rejection reason updated successfully." });
  } catch (error) {
    res.status(500).send({ message: "Server error: " + error.message });
  }
};

const acceptInterviewRequest = async (req, res) => {
  const { applicationNumber, teacherId, acceptedResponse } = req.body;

  try {
    const interview = await InterviewRequest.findOne({ applicationNumber });
    const teacherEntry = interview.teacher.find(
      (t) => t.teacherId.toString() === teacherId
    );

    teacherEntry.status = "Accepted";
    teacherEntry.acceptedResponse = acceptedResponse;

    interview.status = "Accepted";

    // Update teacher notifications
    const teacher = await TeacherProfile.findById(teacherId);
    const notificationIndex = teacher.notifications.findIndex(
      (n) => n.applicationNumber === applicationNumber
    );
    if (notificationIndex >= 0) {
      teacher.notifications[notificationIndex].status = "Accepted";
    }

    await teacher.save();
    await interview.save();

    res
      .status(200)
      .send({ message: "Acceptance response updated successfully." });
  } catch (error) {
    res.status(500).send({ message: "Server error: " + error.message });
  }
};

const getAcceptedRequests = async (req, res) => {
  try {
    const acceptedRequests = await InterviewRequest.find({
      status: { $in: ["Accepted"] },
    });
    res.status(200).json({ success: true, data: acceptedRequests });
  } catch (error) {
    console.error("Error fetching accepted requests:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAttendance = async (req, res) => {
  const { applicationNumber, attendance } = req.body;
  try {
    const interview = await InterviewRequest.findOneAndUpdate(
      { applicationNumber },
      { attendance },
      { new: true }
    );
    if (!interview) {
      return res.status(404).json({ message: "Interview request not found." });
    }
    res.status(200).json({ message: "Attendance updated.", data: interview });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const submitFeedback = async (req, res) => {
  const { applicationNumber, feedback } = req.body;

  try {
    // Step 1: Find the interview request

    const interview = await InterviewRequest.findOne({ applicationNumber });

    if (!interview) {
      console.log("Interview request not found.");
      return res.status(404).json({ message: "Interview request not found." });
    }

    // Step 2: Validate feedback fields
    const {
      interviewRequestId,
      studentId,
      teacherId,
      communicationSkills,
      technicalKnowledge,
      problemSolvingAbility,
      confidenceAndBodyLanguage,
      timeManagement,
      overallPerformance,
      strengths,
      areasForImprovement,
      detailedFeedback,
      actionableSuggestions,
      additionalComments,
      recommendation,
    } = feedback;

    if (
      !interviewRequestId ||
      !studentId ||
      !teacherId ||
      !communicationSkills ||
      !technicalKnowledge ||
      !problemSolvingAbility ||
      !confidenceAndBodyLanguage ||
      !timeManagement ||
      !overallPerformance ||
      !strengths ||
      !areasForImprovement
    ) {
      return res
        .status(400)
        .json({ message: "Missing required feedback fields." });
    }

    // Step 3: Check attendance status
    if (interview.attendance !== "Present") {
      console.log("Attendance is not marked as Present.", {
        attendance: interview.attendance,
      });
      return res.status(400).json({
        message:
          "Feedback can only be submitted if attendance is marked as Present.",
      });
    }

    // Step 4: Save feedback in the Feedback model
    const newFeedback = new Feedback({
      ...feedback,
      studentId: interview.studentId,
      interviewRequestId: interview._id,
    });
    await newFeedback.save(``);

    // Step 5: Update interview request with feedback details
    interview.feedbackId = newFeedback._id;
    interview.isFeedbackSubmitted = true;
    interview.status = "Completed";
    interview.teacher.forEach((teacher) => {
      if (teacher.status === "Accepted") {
        teacher.status = "Completed";
      }
    });
    await interview.save();

    // Step 6: Notify teacher
    const teacher = await TeacherProfile.findById(teacherId);
    if (teacher) {
      teacher.notifications.push({
        type: "Feedback Submitted",
        applicationNumber: applicationNumber,
        details: {
          studentName: interview.studentName,
          email: interview.email,
          feedbackSummary: `Overall Performance: ${overallPerformance}`,
        },
      });
      await teacher.save();
    }

    res.status(200).json({
      message: "Feedback submitted successfully.",
      data: { interview, feedbackId: newFeedback._id, status: "Completed" },
    });
  } catch (error) {
    console.error("Error in submitFeedback:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const getFeedbackForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;

    const feedbacks = await Feedback.find({ studentId })
      .populate("interviewRequestId", "applicationNumber topic date")
      .exec();

    res.status(200).json({
      message: "Feedback fetched successfully",
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const deleteStudentInterviewRequest = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const deletedRequest = await InterviewRequest.findByIdAndDelete(
      applicationId
    );
    if (!deletedRequest) {
      return res.status(404).json({ message: "Application not found." });
    }
    res.status(200).json({ message: "Application deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

module.exports = {
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
};
