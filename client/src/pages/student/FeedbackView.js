import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentHeader from "../Header/StudentHeader";
import Footer from "../Footer/Footer";
import "../../styles/FeedbackView.css"; // Add styles for the classNames used

const FeedbackView = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/interview/studentFeedback",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedbacks(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading feedbacks...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const FeedbackItem = ({ feedback }) => (
    <li className="feedback-item">
      <h3 className="feedback-title">
        Feedback for Application #{" "}
        {feedback.interviewRequestId?.applicationNumber}
      </h3>
      <div className="feedback-details">
        <p>
          <strong>Topic:</strong> {feedback.interviewRequestId?.topic}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(feedback.interviewRequestId?.date).toLocaleDateString()}
        </p>
        <div className="detailed-feedback">
          <h4>Detailed Feedback</h4>
          <p>
            <strong>Communication Skills:</strong>{" "}
            {feedback.communicationSkills}
          </p>
          <p>
            <strong>Technical Knowledge:</strong> {feedback.technicalKnowledge}
          </p>
          <p>
            <strong>Problem-Solving Ability:</strong>{" "}
            {feedback.problemSolvingAbility}
          </p>
          <p>
            <strong>Confidence and Body Language:</strong>{" "}
            {feedback.confidenceAndBodyLanguage}
          </p>
          <p>
            <strong>Time Management:</strong> {feedback.timeManagement}
          </p>
          <p>
            <strong>Overall Performance:</strong> {feedback.overallPerformance}
          </p>
          <p>
            <strong>Strengths:</strong> {feedback.strengths}
          </p>
          <p>
            <strong>Areas for Improvement:</strong>{" "}
            {feedback.areasForImprovement}
          </p>

          <p>
            <strong>Opening Statement:</strong>{" "}
            {feedback.detailedFeedback?.openingStatement}
          </p>
          <p>
            <strong>Technical Analysis:</strong>{" "}
            {feedback.detailedFeedback?.technicalAnalysis}
          </p>
          <p>
            <strong>Problem Solving Discussion:</strong>{" "}
            {feedback.detailedFeedback?.problemSolvingDiscussion}
          </p>
          <p>
            <strong>Communication Observations:</strong>{" "}
            {feedback.detailedFeedback?.communicationObservations}
          </p>
          <p>
            <strong>Behavioral Assessment:</strong>{" "}
            {feedback.detailedFeedback?.behavioralAssessment}
          </p>
          <p>
            <strong>Closing Remarks:</strong>{" "}
            {feedback.detailedFeedback?.closingRemarks}
          </p>
        </div>
      </div>
      <div className="additional-feedback">
        <p>
          <strong>Actionable Suggestions:</strong>{" "}
          {feedback.actionableSuggestions.join(", ")}
        </p>
        <p>
          <strong>Additional Comments:</strong> {feedback.additionalComments}
        </p>
        <p>
          <strong>Recommendation:</strong>{" "}
          {feedback.recommendation ? "Yes" : "No"}
        </p>
      </div>
    </li>
  );

  return (
    <div className="feedback-view">
      <StudentHeader />
      <div className="feedback-container">
        <h1 className="feedback-header">Your Feedback</h1>
        {feedbacks.length === 0 ? (
          <p className="no-feedback">No feedback available yet.</p>
        ) : (
          <ul className="feedback-list">
            {feedbacks.map((feedback) => (
              <FeedbackItem key={feedback._id} feedback={feedback} />
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackView;
