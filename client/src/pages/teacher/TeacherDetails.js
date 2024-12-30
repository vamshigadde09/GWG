import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/TeacherDetails.css";
import TeacherHeader from "../Header/TeacherHeader";
import Footer from "../Footer/Footer";

const TeacherDetails = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);

  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
  const slots = [
    "08:00 - 08:50",
    "08:50 - 09:40",
    "09:45 - 10:35",
    "10:40 - 11:30",
    "11:35 - 12:25",
    "12:30 - 01:20",
    "01:25 - 02:15",
    "02:20 - 03:10",
    "03:10 - 04:00",
    "04:00 - 04:50",
  ];

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`/api/v1/user/teacher/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeacher(response.data.data);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    };

    fetchTeacherDetails();
  }, [id]);

  if (!teacher) return <div>Loading...</div>;

  const renderTimetable = () => {
    const availability = teacher.availability || [];
    const freeSlotsMap = {};

    availability.forEach((day) => {
      freeSlotsMap[day.day] = day.freeSlots || [];
    });

    return days.map((day, dayIndex) => (
      <tr key={dayIndex}>
        <td>{day}</td>
        {slots.map((_, slotIndex) => (
          <td key={slotIndex}>
            {freeSlotsMap[day]?.includes(slotIndex + 1) ? "Free" : ""}
          </td>
        ))}
      </tr>
    ));
  };

  if (!teacher) return <div>Loading...</div>;

  const profilePicture =
    teacher.profilePicture ||
    "D:Projects_GWGGROW-WITH-GURU-main - CopyGROW-WITH-GURU-mainimgprofile-user-icon-isolated-on-white-background-eps10-free-vector.jpg";

  return (
    <div>
      <TeacherHeader />
      <div className="teacher-details-container">
        {/* Profile Section */}
        <div className="teacher-profile">
          <img
            className="teacher-profile-img"
            src={profilePicture}
            alt={`${teacher.name || "Teacher"}'s Profile`}
          />
          <div className="teacher-profile-info">
            <h2>{teacher.name}</h2>
            <p>
              <strong>Email:</strong> {teacher.email || "Not Available"}
            </p>
            <p>
              <strong>Designation:</strong>{" "}
              {teacher.designation || "Not Assigned"}
            </p>
            <p>
              <strong>Department:</strong>{" "}
              {teacher.department || "Not Assigned"}
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="skills-section">
          <h3>Skills</h3>
          <div className="skills-container">
            {teacher.skills?.length > 0 ? (
              teacher.skills.map((skill, index) => (
                <span key={index} className="skill-item">
                  {skill.skillName}
                </span>
              ))
            ) : (
              <p>No Skills Added</p>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
          <h3>Profile Details</h3>
          <p>
            <strong>Availability Notes:</strong>{" "}
            {teacher.availabilityNotes || "Not Available"}
          </p>
          <p>
            <strong>Areas of Expertise:</strong>{" "}
            {teacher.areasOfExpertise || "Not Specified"}
          </p>
          <p>
            <strong>Preferred Notification Method:</strong>{" "}
            {teacher.preferredNotificationMethod || "Not Specified"}
          </p>
          {teacher.preferredNotificationMethod === "WhatsApp" && (
            <p>
              <strong>Contact Details:</strong>{" "}
              {teacher.contactDetails || "Not Available"}
            </p>
          )}
          <p>
            <strong>Publications:</strong>{" "}
            {teacher.publications || "Not Available"}
          </p>
          <p>
            <strong>LinkedIn:</strong>{" "}
            {teacher.linkedIn ? (
              <a
                href={teacher.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
              >
                {teacher.linkedIn}
              </a>
            ) : (
              "Not Provided"
            )}
          </p>
          <p>
            <strong>Other Professional Links:</strong>
          </p>
          <ul className="links-list">
            {teacher.otherProfessionalLinks?.length > 0 ? (
              teacher.otherProfessionalLinks.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))
            ) : (
              <li>No Links Provided</li>
            )}
          </ul>
        </div>

        {/* Timetable Section */}
        <div className="timetable-section">
          <h3>Full Timetable</h3>
          <table className="availability-table">
            <thead>
              <tr>
                <th>FROM / TO</th>
                {slots.map((slot, index) => (
                  <th key={index}>{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody>{renderTimetable()}</tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeacherDetails;
