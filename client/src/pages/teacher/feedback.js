import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import TeacherHeader from "../Header/TeacherHeader";
import "../../styles/Feedback.css";

const Feedback = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [feedbackData, setFeedbackData] = useState({
    interviewRequestId: "",
    studentId: "",
    teacherId: "",
    communicationSkills: "",
    technicalKnowledge: "",
    problemSolvingAbility: "",
    confidenceAndBodyLanguage: "",
    timeManagement: "",
    overallPerformance: "",
    strengths: "",
    areasForImprovement: "",
    detailedFeedback: {
      openingStatement: "",
      technicalAnalysis: "",
      problemSolvingDiscussion: "",
      communicationObservations: "",
      behavioralAssessment: "",
      closingRemarks: "",
    },
    actionableSuggestions: [],
    additionalComments: "",
    recommendation: false,
  });

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  const fetchAcceptedRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/interview/acceptedRequests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAcceptedRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching accepted requests:", error.message);
    }
  };

  const markAttendance = async (applicationNumber, attendance) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8080/api/v1/interview/attendance",
        { applicationNumber, attendance },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Attendance updated successfully!");
      fetchAcceptedRequests(); // Refresh the accepted requests list
    } catch (error) {
      console.error("Error marking attendance:", error.message);
      alert("Failed to update attendance. Please try again.");
    }
  };

  const handleSubmitFeedback = async (applicationNumber, interviewRequest) => {
    try {
      const { _id: interviewRequestId, studentId, teacher } = interviewRequest;
      const teacherId = teacher[0]?.teacherId; // Assuming the first teacher is the one providing feedback

      if (!interviewRequestId || !studentId || !teacherId) {
        console.error("Missing required IDs:", {
          interviewRequestId,
          studentId,
          teacherId,
        });
        alert("Required data is missing. Please check the interview details.");
        return;
      }

      const feedbackPayload = {
        ...feedbackData,
        interviewRequestId,
        studentId,
        teacherId,
      };

      console.log("Preparing feedback data for submission:", feedbackPayload);

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/v1/interview/submitFeedback",
        { applicationNumber, feedback: feedbackPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Feedback submitted successfully!");
      setFeedbackData({
        interviewRequestId: "",
        studentId: "",
        teacherId: "",
        communicationSkills: "",
        technicalKnowledge: "",
        problemSolvingAbility: "",
        confidenceAndBodyLanguage: "",
        timeManagement: "",
        overallPerformance: "",
        strengths: "",
        areasForImprovement: "",
        detailedFeedback: {
          openingStatement: "",
          technicalAnalysis: "",
          problemSolvingDiscussion: "",
          communicationObservations: "",
          behavioralAssessment: "",
          closingRemarks: "",
        },
        actionableSuggestions: [],
        additionalComments: "",
        recommendation: false,
      });
      fetchAcceptedRequests();
    } catch (error) {
      console.error(
        "Error submitting feedback:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <TeacherHeader />
      <h2>Accepted Interview Requests</h2>
      <ul className="accepted-requests-list">
        {acceptedRequests.map((request) => (
          <li key={request.applicationNumber} className="request-item">
            <div className="request-details">
              <div className="detail-pair">
                <strong>Application Number:</strong>
                <span>{request.applicationNumber}</span>
              </div>
              <div className="detail-pair">
                <strong>Student Name:</strong>
                <span>{request.studentName}</span>
              </div>
              <div className="detail-pair">
                <strong>Email:</strong>
                <span>{request.email}</span>
              </div>
              <div className="detail-pair">
                <strong>Topic:</strong>
                <span>{request.topic}</span>
              </div>
              <div className="detail-pair">
                <strong>Skills:</strong>
                <span>{request.skills.join(", ")}</span>
              </div>
              <div className="detail-pair">
                <strong>Interview Type:</strong>
                <span>{request.interviewType}</span>
              </div>
              <div className="detail-pair">
                <strong>Experience Level:</strong>
                <span>{request.experienceLevel}</span>
              </div>
              <div className="detail-pair">
                <strong>Date:</strong>
                <span>{new Date(request.date).toLocaleDateString()}</span>
              </div>
              <div className="detail-pair">
                <strong>Start Time:</strong>
                <span>{request.startTime}</span>
              </div>
              <div className="detail-pair">
                <strong>Interview Mode:</strong>
                <span>{request.interviewMode}</span>
              </div>
              {request.driveLink && (
                <div className="detail-pair">
                  <strong>Drive Link:</strong>
                  <a
                    href={request.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {request.driveLink}
                  </a>
                </div>
              )}
              {request.resourcesLink && (
                <div className="detail-pair">
                  <strong>Resources Link:</strong>
                  <a
                    href={request.resourcesLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {request.resourcesLink}
                  </a>
                </div>
              )}
              {request.notes && (
                <div className="detail-pair">
                  <strong>Notes:</strong>
                  <span>{request.notes}</span>
                </div>
              )}
              <div className="detail-pair">
                <strong>Status:</strong>
                <span>{request.status}</span>
              </div>
              <div className="detail-pair">
                <strong>Attendance:</strong>
                <span>{request.attendance}</span>
              </div>
            </div>
            {request.attendance !== "Present" && (
              <div className="attendance-buttons">
                <button
                  onClick={() =>
                    markAttendance(request.applicationNumber, "Present")
                  }
                >
                  Mark as Present
                </button>
                <button
                  onClick={() =>
                    markAttendance(request.applicationNumber, "Absent")
                  }
                >
                  Mark as Absent
                </button>
              </div>
            )}

            {request.attendance === "Present" && (
              <div className="feedback-form">
                <h3>Submit Feedback</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitFeedback(request.applicationNumber, request);
                  }}
                >
                  <div className="feedback-grid">
                    <div className="form-group">
                      <label>
                        Communication Skills (1-5):
                        <input
                          type="number"
                          min="1"
                          max="5"
                          required
                          value={feedbackData.communicationSkills}
                          onChange={(e) =>
                            setFeedbackData({
                              ...feedbackData,
                              communicationSkills: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        Technical Knowledge (1-5):
                        <input
                          type="number"
                          min="1"
                          max="5"
                          required
                          value={feedbackData.technicalKnowledge}
                          onChange={(e) =>
                            setFeedbackData({
                              ...feedbackData,
                              technicalKnowledge: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        Problem-Solving Ability (1-5):
                        <input
                          type="number"
                          min="1"
                          max="5"
                          required
                          value={feedbackData.problemSolvingAbility}
                          onChange={(e) =>
                            setFeedbackData({
                              ...feedbackData,
                              problemSolvingAbility: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        Confidence and Body Language (1-5):
                        <input
                          type="number"
                          min="1"
                          max="5"
                          required
                          value={feedbackData.confidenceAndBodyLanguage}
                          onChange={(e) =>
                            setFeedbackData({
                              ...feedbackData,
                              confidenceAndBodyLanguage: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        Time Management (1-5):
                        <input
                          type="number"
                          min="1"
                          max="5"
                          required
                          value={feedbackData.timeManagement}
                          onChange={(e) =>
                            setFeedbackData({
                              ...feedbackData,
                              timeManagement: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        Overall Performance (1-5):
                        <input
                          type="number"
                          min="1"
                          max="5"
                          required
                          value={feedbackData.overallPerformance}
                          onChange={(e) =>
                            setFeedbackData({
                              ...feedbackData,
                              overallPerformance: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>
                  <div className="feedback-textarea">
                    <label>
                      Strengths:
                      <textarea
                        required
                        value={feedbackData.strengths}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            strengths: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Areas for Improvement:
                      <textarea
                        required
                        value={feedbackData.areasForImprovement}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            areasForImprovement: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Opening Statement:
                      <textarea
                        value={feedbackData.detailedFeedback.openingStatement}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            detailedFeedback: {
                              ...feedbackData.detailedFeedback,
                              openingStatement: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label>
                      Technical Analysis:
                      <textarea
                        value={feedbackData.detailedFeedback.technicalAnalysis}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            detailedFeedback: {
                              ...feedbackData.detailedFeedback,
                              technicalAnalysis: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label>
                      Problem-Solving Discussion:
                      <textarea
                        value={
                          feedbackData.detailedFeedback.problemSolvingDiscussion
                        }
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            detailedFeedback: {
                              ...feedbackData.detailedFeedback,
                              problemSolvingDiscussion: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label>
                      Communication Observations:
                      <textarea
                        value={
                          feedbackData.detailedFeedback
                            .communicationObservations
                        }
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            detailedFeedback: {
                              ...feedbackData.detailedFeedback,
                              communicationObservations: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label>
                      Behavioral Assessment:
                      <textarea
                        value={
                          feedbackData.detailedFeedback.behavioralAssessment
                        }
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            detailedFeedback: {
                              ...feedbackData.detailedFeedback,
                              behavioralAssessment: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label>
                      Closing Remarks:
                      <textarea
                        value={feedbackData.detailedFeedback.closingRemarks}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            detailedFeedback: {
                              ...feedbackData.detailedFeedback,
                              closingRemarks: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label>
                      Actionable Suggestions:
                      <textarea
                        value={feedbackData.actionableSuggestions.join(", ")}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            actionableSuggestions: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                      />
                    </label>
                    <label>
                      Additional Comments:
                      <textarea
                        value={feedbackData.additionalComments}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            additionalComments: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Recommendation:
                      <input
                        type="checkbox"
                        checked={feedbackData.recommendation}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            recommendation: e.target.checked,
                          })
                        }
                      />
                    </label>
                  </div>
                  <button type="submit">Submit Feedback</button>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default Feedback;
