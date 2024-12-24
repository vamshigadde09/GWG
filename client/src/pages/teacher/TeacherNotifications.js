import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/TeacherNotifications.css";
import Footer from "../Footer/Footer";
import TeacherHeader from "../Header/TeacherHeader";

const BASE_URL = "http://localhost:8080";

const TeacherNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [editingNotificationId, setEditingNotificationId] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");

  // Fetch teacher notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/v1/teacher/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(
        "Fetched Notifications from API:",
        response.data.notifications
      );
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      alert("Failed to load notifications.");
    }
  };

  // Handle accept action
  const handleAccept = async (applicationNumber) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/v1/teacher/notifications/${applicationNumber}/status`,
        { status: "Accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message || "Application accepted successfully!");

      // Refetch notifications to update state
      await fetchNotifications();
    } catch (error) {
      console.error("Error accepting application:", error.message);
      alert("Failed to accept application.");
    }
  };

  // Handle rejection with reason
  const handleRejection = async (applicationNumber, teacherId, reason) => {
    if (!teacherId || !reason.trim()) {
      alert("Teacher ID or rejection reason is missing.");
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

      alert(
        response.data.message || "Rejection reason submitted successfully!"
      );
      await fetchNotifications();
      setEditingNotificationId(null);
    } catch (error) {
      console.error("Error rejecting application:", error.message);
      alert("Failed to submit rejection reason.");
    }
  };

  // Handle rejection reason change
  const handleRejectionReasonChange = (applicationNumber, reason) => {
    setRejectionReasons((prev) => ({
      ...prev,
      [applicationNumber]: reason,
    }));
  };

  // Filter notifications based on the active tab
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.status.toLowerCase() === activeTab.toLowerCase()
  );

  // Handle tab change
  const handleTabChange = (status) => {
    setActiveTab(status);
  };

  useEffect(() => {
    fetchNotifications();
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
            onClick={() => handleTabChange(status)}
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
                {editingNotificationId === notification.applicationNumber ? (
                  <>
                    <textarea
                      placeholder="Enter rejection reason"
                      value={
                        rejectionReasons[notification.applicationNumber] || ""
                      }
                      onChange={(e) =>
                        handleRejectionReasonChange(
                          notification.applicationNumber,
                          e.target.value
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        handleRejection(
                          notification.applicationNumber,
                          notification.teacherId,
                          rejectionReasons[notification.applicationNumber]
                        )
                      }
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setEditingNotificationId(null)}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setEditingNotificationId(notification.applicationNumber)
                      }
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        handleAccept(notification.applicationNumber)
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
