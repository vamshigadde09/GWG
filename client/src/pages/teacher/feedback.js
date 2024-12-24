import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import TeacherHeader from "../Header/TeacherHeader";

const Feedback = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  const fetchAcceptedRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/interview/acceptedRequests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAcceptedRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching accepted requests:", error.message);
      alert(
        "Failed to fetch accepted interview requests. Please try again later."
      );
    }
  };

  const markAttendance = async (applicationNumber, attendance) => {
    try {
      await axios.put("/api/interview/attendance", {
        applicationNumber,
        attendance,
      });
      alert("Attendance updated successfully!");
      fetchAcceptedRequests(); // Refresh the list
    } catch (error) {
      console.error("Error marking attendance:", error.message);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedRequest) {
      alert("Please select an interview request.");
      return;
    }

    try {
      await axios.post("/api/interview/submitFeedback", {
        applicationNumber: selectedRequest.applicationNumber,
        feedback,
      });
      alert("Feedback submitted successfully!");
      setFeedback("");
      fetchAcceptedRequests(); // Refresh the requests
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
    }
  };

  return (
    <div>
      <TeacherHeader />
      <h2>Accepted Interview Requests</h2>
      <ul>
        {acceptedRequests.map((request) => (
          <li key={request.applicationNumber}>
            {request.topic} - {request.studentName} - {request.date}
            <button
              onClick={() =>
                markAttendance(request.applicationNumber, "Present")
              }
            >
              Mark Present
            </button>
            <button
              onClick={() =>
                markAttendance(request.applicationNumber, "Absent")
              }
            >
              Mark Absent
            </button>
            {request.attendance === "Present" && (
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter feedback"
              />
            )}
            <button
              onClick={() => handleSubmitFeedback(request.applicationNumber)}
            >
              Submit Feedback
            </button>
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default Feedback;
