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

    if (!name || !email || !topic || !date || !startTime || !teacher) {
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

    if (teacher.length === 0) {
      return res.status(400).send({
        message: "No teacher selected. Please select a teacher.",
        success: false,
      });
    }

    const noteacher = teacher.length === 0;

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
      status: "Accepted",
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

  console.log("Received submitFeedback request:", {
    applicationNumber,
    feedback,
  });

  try {
    // Step 1: Find the interview request
    console.log(
      "Finding interview request for applicationNumber:",
      applicationNumber
    );
    const interview = await InterviewRequest.findOne({ applicationNumber });

    if (!interview) {
      console.log("Interview request not found.");
      return res.status(404).json({ message: "Interview request not found." });
    }

    console.log("Interview request found:", interview);

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

    console.log("Validating feedback fields...");

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
      console.log("Missing required feedback fields.", feedback);
      return res
        .status(400)
        .json({ message: "Missing required feedback fields." });
    }

    // Step 3: Check attendance status
    console.log("Checking attendance status...");
    if (interview.attendance !== "Present") {
      console.log("Attendance is not marked as Present.", {
        attendance: interview.attendance,
      });
      return res.status(400).json({
        message:
          "Feedback can only be submitted if attendance is marked as Present.",
      });
    }

    // Step 4: Save feedback to the interview request
    console.log("Saving feedback to interview request...");
    interview.feedback = {
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
    };
    await interview.save();

    console.log("Feedback saved successfully.");

    // Step 5: Notify teacher and/or student (Optional, extendable feature)
    console.log("Notifying teacher with ID:", teacherId);
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
      console.log("Teacher notified successfully.");
    }

    res.status(200).json({
      message: "Feedback submitted successfully.",
      data: interview,
    });
  } catch (error) {
    console.error("Error in submitFeedback:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
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
};
