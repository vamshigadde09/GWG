import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/TeacherNotifications.css";
import Footer from "../Footer/Footer";
import TeacherHeader from "../Header/TeacherHeader";

const TeacherNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [responseReasons, setResponseReasons] = useState({});
  const [editingType, setEditingType] = useState({}); // Keeps track of editing type (accept/reject)
  const [activeTab, setActiveTab] = useState("Pending");

  // Fetch teacher notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/teacher/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }
  };

  // Handle input changes for acceptance/rejection
  const handleResponseChange = (applicationNumber, response) => {
    setResponseReasons((prev) => ({
      ...prev,
      [applicationNumber]: response,
    }));
  };

  // Update notification status locally
  const updateNotificationStatus = (applicationNumber, newStatus) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.applicationNumber === applicationNumber
          ? { ...notification, status: newStatus }
          : notification
      )
    );
  };

  // Handle rejection action
  const handleRejection = async (applicationNumber, teacherId) => {
    const reason = responseReasons[applicationNumber];
    if (!reason || reason.trim() === "") {
      alert("Rejection reason cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/v1/interview/reject",
        { applicationNumber, teacherId, reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message || "Rejection submitted successfully!");

      // Update the global status to Rejected
      updateNotificationStatus(applicationNumber, "Rejected");

      // Update the state to reflect the rejected status
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.applicationNumber === applicationNumber
            ? { ...notification, status: "Rejected" }
            : notification
        )
      );

      setEditingType({}); // Clear editing state
    } catch (error) {
      console.error("Error rejecting application:", error.message);
      alert("Failed to submit rejection.");
    }
  };

  // Handle accept action
  const handleAccept = async (applicationNumber, teacherId) => {
    const acceptedResponse = responseReasons[applicationNumber];
    if (!acceptedResponse || acceptedResponse.trim() === "") {
      alert("Acceptance response cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/v1/interview/accept",
        { applicationNumber, teacherId, acceptedResponse },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message || "Acceptance submitted successfully!");

      // Update the global status to Accepted if any teacher accepts
      updateNotificationStatus(applicationNumber, "Accepted");

      setEditingType({}); // Clear editing state
    } catch (error) {
      console.error("Error accepting application:", error.message);
      alert("Failed to submit acceptance.");
    }
  };

  // Filter notifications based on the active tab
  const filteredNotifications = notifications.filter(
    (notification) => notification.status === activeTab
  );

  useEffect(() => {
    fetchNotifications().catch((error) => {
      console.error("Failed to fetch notifications:", error);
    });
  }, []);

  return (
    <div className="notifications-container">
      <TeacherHeader />
      <h1 className="notifications-header">Teacher Notifications</h1>
      <div className="tabs">
        {["Pending", "Accepted", "Rejected", "Completed"].map((status) => (
          <button
            key={status}
            className={`tab-button ${activeTab === status ? "active" : ""}`}
            onClick={() => setActiveTab(status)}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <p className="no-notifications">
            No notifications found under "{activeTab}" status.
          </p>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.applicationNumber}
              className="notification-card"
            >
              <div className="notification-content">
                <p>
                  <strong>Application Number:</strong>{" "}
                  {notification.applicationNumber || "N/A"}
                </p>
                <p>
                  <strong>Topic:</strong> {notification.details?.topic || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {notification.details?.email || "N/A"}
                </p>
                <p>
                  <strong>Skills:</strong>{" "}
                  {notification.details?.skills?.join(", ") || "N/A"}
                </p>
                <p>
                  <strong>Interview Type:</strong>{" "}
                  {notification.details?.interviewType || "N/A"}
                </p>
                <p>
                  <strong>Experience Level:</strong>{" "}
                  {notification.details?.experienceLevel || "N/A"}
                </p>
                <p>
                  <strong>Interview Mode:</strong>{" "}
                  {notification.details?.interviewMode || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {notification.details?.date || "N/A"}
                </p>
                <p>
                  <strong>Start Time:</strong>{" "}
                  {notification.details?.startTime || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`notification-status ${notification.status.toLowerCase()}`}
                  >
                    {notification.status}
                  </span>
                </p>
              </div>

              <div className="notification-actions">
                {editingType[notification.applicationNumber] ? (
                  <>
                    <textarea
                      placeholder={
                        editingType[notification.applicationNumber] === "Reject"
                          ? "Enter rejection reason"
                          : "Enter acceptance response"
                      }
                      value={
                        responseReasons[notification.applicationNumber] || ""
                      }
                      onChange={(e) =>
                        handleResponseChange(
                          notification.applicationNumber,
                          e.target.value
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        editingType[notification.applicationNumber] === "Reject"
                          ? handleRejection(
                              notification.applicationNumber,
                              notification.teacherId
                            )
                          : handleAccept(
                              notification.applicationNumber,
                              notification.teacherId
                            )
                      }
                    >
                      Submit
                    </button>
                    <button
                      onClick={() =>
                        setEditingType((prev) => ({
                          ...prev,
                          [notification.applicationNumber]: null,
                        }))
                      }
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setEditingType((prev) => ({
                          ...prev,
                          [notification.applicationNumber]: "Reject",
                        }))
                      }
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        setEditingType((prev) => ({
                          ...prev,
                          [notification.applicationNumber]: "Accept",
                        }))
                      }
                    >
                      Accept
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TeacherNotifications;
