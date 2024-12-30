import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentHeader from "../Header/StudentHeader";
import Footer from "../Footer/Footer";
import "../../styles/StudentUpdates.css";

const BASE_URL = "http://localhost:8080";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");

  // Fetch applications from the API
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `${BASE_URL}/api/v1/interview/studentRequests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplications(response.data.data);
    } catch (err) {
      console.error("Error fetching applications:", err.message);
      setError(
        err.response?.data?.message ||
          "Failed to load applications. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete an application
  const deleteApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(
        `${BASE_URL}/api/v1/interview/studentRequests/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh the applications after successful deletion
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app._id !== applicationId)
      );
      alert("Application deleted successfully.");
    } catch (err) {
      console.error("Error deleting application:", err.message);
      alert(
        err.response?.data?.message ||
          "Failed to delete application. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleTabClick = (status) => {
    setActiveTab(status);
  };

  const filteredApplications = applications.filter(
    (app) => app.status?.toLowerCase() === activeTab.toLowerCase()
  );

  if (loading)
    return <div className="loading-message">Loading applications...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-applications">
      <StudentHeader />
      <div className="applications-container">
        <h1 className="page-title">My Applications</h1>
        <div className="tabs">
          {["Pending", "Accepted", "Rejected", "Completed"].map((status) => (
            <button
              key={status}
              className={`filter-button ${
                activeTab === status ? "active" : ""
              }`}
              onClick={() => handleTabClick(status)}
            >
              {status}
            </button>
          ))}
        </div>
        {filteredApplications.length === 0 ? (
          <p className="no-applications">
            No applications found under "{activeTab}" status.
          </p>
        ) : (
          <ul className="applications-list">
            {filteredApplications.map((app) => (
              <li key={app._id} className="update-card application-item">
                <h3 className="update-header">
                  Application Details {app.applicationNumber || "N/A"}
                </h3>
                <div className="update-content">
                  <p>
                    <strong>Name:</strong> {app.studentName || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {app.email || "N/A"}
                  </p>
                  <p>
                    <strong>Topic:</strong> {app.topic || "N/A"}
                  </p>
                  <p>
                    <strong>Skills:</strong>{" "}
                    {Array.isArray(app.skills) && app.skills.length > 0
                      ? app.skills.join(", ")
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Interview Type:</strong>{" "}
                    {app.interviewType || "N/A"}
                  </p>
                  <p>
                    <strong>Experience Level:</strong>{" "}
                    {app.experienceLevel || "N/A"}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {app.date ? new Date(app.date).toLocaleDateString() : "N/A"}
                  </p>
                  <p>
                    <strong>Start Time:</strong> {app.startTime || "N/A"}
                  </p>
                  <p>
                    <strong>Interview Mode:</strong>{" "}
                    {app.interviewMode || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong> {app.status}
                  </p>
                  {app.status === "Rejected" && app.rejectionReason && (
                    <p style={{ color: "red" }}>
                      <strong>Rejection Reason:</strong> {app.rejectionReason}
                    </p>
                  )}
                  {app.status === "Accepted" && app.acceptedResponse && (
                    <p style={{ color: "green" }}>
                      <strong>Acceptance Response:</strong>{" "}
                      {app.acceptedResponse}
                    </p>
                  )}
                </div>
                <h4 className="teacher-header">Teacher Details</h4>
                {Array.isArray(app.teacher) && app.teacher.length > 0 ? (
                  app.teacher.map((t) => (
                    <div
                      key={t.teacherId?._id || t.teacherId}
                      className="teacher-details"
                    >
                      <p>
                        <strong>Name:</strong> {t.teacherId?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Designation:</strong>{" "}
                        {t.teacherId?.designation || "N/A"}
                      </p>
                      <p>
                        <strong>Skills:</strong>{" "}
                        {Array.isArray(t.teacherId?.skills) &&
                        t.teacherId?.skills.length > 0
                          ? t.teacherId?.skills.map((skill, index) => (
                              <span key={index}>
                                {skill.skillName}
                                {index < t.teacherId.skills.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))
                          : "N/A"}
                      </p>
                      {t.rejectionReason && (
                        <p style={{ color: "red" }}>
                          <strong>Rejection Reason:</strong> {t.rejectionReason}
                        </p>
                      )}
                      {t.acceptedResponse && (
                        <p style={{ color: "green" }}>
                          <strong>Accepted Response:</strong>{" "}
                          {t.acceptedResponse}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No teacher details available.</p>
                )}
                <button
                  className="delete-button"
                  onClick={() => deleteApplication(app._id)}
                >
                  Delete Application
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyApplications;
