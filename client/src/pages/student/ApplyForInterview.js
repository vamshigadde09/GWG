import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentHeader from "../Header/StudentHeader";
import Footer from "../Footer/Footer";
import "../../styles/ApplyForInterview.css";
import Select from "react-select";
import { TextField } from "@mui/material";

const ApplyForInterview = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    skills: [],
    interviewType: "",
    experienceLevel: "",
    date: "",
    startTime: "",
    interviewMode: "",
    driveLink: "",
    teacher: [],
    resourcesLink: "",
    notes: "",
  });

  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  const skillsOptions = [
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "Data Science", label: "Data Science" },
    { value: "Deep Learning", label: "Deep Learning" },
    { value: "Python", label: "Python", group: "Programming Languages" },
    { value: "Java", label: "Java", group: "Programming Languages" },
    { value: "C", label: "C", group: "Programming Languages" },
    { value: "C++", label: "C++", group: "Programming Languages" },
    {
      value: "JavaScript",
      label: "JavaScript",
      group: "Programming Languages",
    },
    {
      value: "TypeScript",
      label: "TypeScript",
      group: "Programming Languages",
    },
    { value: "HTML", label: "HTML", group: "Frontend Development" },
    { value: "CSS", label: "CSS", group: "Frontend Development" },
    { value: "SCSS", label: "SCSS", group: "Frontend Development" },
    {
      value: "Tailwind CSS",
      label: "Tailwind CSS",
      group: "Frontend Development",
    },
    { value: "SQL", label: "SQL", group: "Databases" },
    { value: "NoSQL", label: "NoSQL", group: "Databases" },
    { value: "MongoDB", label: "MongoDB", group: "Databases" },
    { value: "Firebase", label: "Firebase", group: "Databases" },
    { value: "PostgreSQL", label: "PostgreSQL", group: "Databases" },
    { value: "AngularJS", label: "AngularJS", group: "Frontend Frameworks" },
    { value: "React.js", label: "React.js", group: "Frontend Frameworks" },
    { value: "Next.js", label: "Next.js", group: "Frontend Frameworks" },
    { value: "ShadCN", label: "ShadCN", group: "Frontend Frameworks" },
    { value: "Spring Boot", label: "Spring Boot", group: "Backend Frameworks" },
    { value: "Node.js", label: "Node.js", group: "Backend Frameworks" },
    { value: "Express.js", label: "Express.js", group: "Backend Frameworks" },
    { value: "Vite.js", label: "Vite.js", group: "Frontend Development" },
    { value: "Docker", label: "Docker", group: "DevOps" },
    { value: "Docker Compose", label: "Docker Compose", group: "DevOps" },
    { value: "AJAX", label: "AJAX", group: "API Development" },
    {
      value: "REST API Development",
      label: "REST API Development",
      group: "API Development",
    },
    { value: "Flutter", label: "Flutter", group: "Mobile Development" },
    { value: "Redux", label: "Redux", group: "State Management" },
    { value: "TensorFlow", label: "TensorFlow", group: "AI Frameworks" },
    { value: "PyTorch", label: "PyTorch", group: "AI Frameworks" },
    { value: "Keras", label: "Keras", group: "AI Frameworks" },
    { value: "Scikit-learn", label: "Scikit-learn", group: "AI Frameworks" },
    {
      value: "OCR",
      label: "OCR (Optical Character Recognition)",
      group: "Computer Vision",
    },
    { value: "AWS", label: "AWS", group: "Cloud Computing" },
    {
      value: "GCP",
      label: "Google Cloud Platform (GCP)",
      group: "Cloud Computing",
    },
    { value: "Azure", label: "Azure Web Services", group: "Cloud Computing" },
    { value: "Heroku", label: "Heroku", group: "Cloud Computing" },
    { value: "Git", label: "Git", group: "Tools" },
    { value: "GitHub", label: "GitHub", group: "Tools" },
    { value: "IntelliJ IDEA", label: "IntelliJ IDEA", group: "Tools" },
    { value: "VS Code", label: "VS Code", group: "Tools" },
    { value: "Matplotlib", label: "Matplotlib", group: "Visualization Tools" },
    { value: "Seaborn", label: "Seaborn", group: "Visualization Tools" },
    { value: "Chart.js", label: "Chart.js", group: "Visualization Tools" },
    {
      value: "IoT Systems",
      label: "IoT Systems",
      group: "Specialized Domains",
    },
    {
      value: "Supply Chain Management",
      label: "Supply Chain Management",
      group: "Specialized Domains",
    },
    {
      value: "Financial Machine Learning",
      label: "Financial Machine Learning",
      group: "Specialized Domains",
    },
    {
      value: "Women's Safety",
      label: "Women's Safety",
      group: "Specialized Domains",
    },
    {
      value: "Carbon Footprint Tracking",
      label: "Carbon Footprint Tracking",
      group: "Specialized Domains",
    },
    {
      value: "Web3 Development",
      label: "Web3 Development",
      group: "Other Skills",
    },
    {
      value: "Event Registration System Design",
      label: "Event Registration System Design",
      group: "Other Skills",
    },
    {
      value: "Frontend UI/UX Design Principles",
      label: "Frontend UI/UX Design Principles",
      group: "Other Skills",
    },
  ];

  const groupedOptions = [
    {
      label: "Programming Languages",
      options: skillsOptions.filter(
        (opt) => opt.group === "Programming Languages"
      ),
    },
    {
      label: "Frontend Development",
      options: skillsOptions.filter(
        (opt) => opt.group === "Frontend Development"
      ),
    },
    {
      label: "Frontend Frameworks",
      options: skillsOptions.filter(
        (opt) => opt.group === "Frontend Frameworks"
      ),
    },
    {
      label: "Backend Frameworks",
      options: skillsOptions.filter(
        (opt) => opt.group === "Backend Frameworks"
      ),
    },
    {
      label: "Databases",
      options: skillsOptions.filter((opt) => opt.group === "Databases"),
    },
    {
      label: "DevOps",
      options: skillsOptions.filter((opt) => opt.group === "DevOps"),
    },
    {
      label: "API Development",
      options: skillsOptions.filter((opt) => opt.group === "API Development"),
    },
    {
      label: "Mobile Development",
      options: skillsOptions.filter(
        (opt) => opt.group === "Mobile Development"
      ),
    },
    {
      label: "State Management",
      options: skillsOptions.filter((opt) => opt.group === "State Management"),
    },
    {
      label: "AI Frameworks",
      options: skillsOptions.filter((opt) => opt.group === "AI Frameworks"),
    },
    {
      label: "Computer Vision",
      options: skillsOptions.filter((opt) => opt.group === "Computer Vision"),
    },
    {
      label: "Cloud Computing",
      options: skillsOptions.filter((opt) => opt.group === "Cloud Computing"),
    },
    {
      label: "Tools",
      options: skillsOptions.filter((opt) => opt.group === "Tools"),
    },
    {
      label: "Visualization Tools",
      options: skillsOptions.filter(
        (opt) => opt.group === "Visualization Tools"
      ),
    },
    {
      label: "Specialized Domains",
      options: skillsOptions.filter(
        (opt) => opt.group === "Specialized Domains"
      ),
    },
    {
      label: "Other Skills",
      options: skillsOptions.filter((opt) => opt.group === "Other Skills"),
    },
  ];

  const fetchTeachers = async (name = "", skill = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/searchTeachers",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { name, skills: skill },
        }
      );
      setTeachers(response.data.data);
    } catch (error) {
      console.error("Error fetching teachers:", error.response?.data || error);
      alert("Error fetching teachers.");
    }
  };

  const checkProfileStatus = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "/api/v1/user/getUserData",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userData = response.data.data;
      setIsProfileUpdated(userData.studentProfile?.isProfileUpdated || false);
      setFormData((prevData) => ({
        ...prevData,
        name: userData.user.name || "",
        email: userData.user.email || "",
      }));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      alert("Failed to load user profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkProfileStatus();
  }, []);

  const handleSearchTermChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      fetchTeachers(value);
    } else {
      setTeachers([]); // Clear suggestions if no input
    }
  };

  const handleTeacherSelect = (teacher) => {
    if (selectedTeachers.length < 1) {
      setSelectedTeachers((prevSelected) => {
        if (!prevSelected.includes(teacher)) {
          return [...prevSelected, teacher];
        } else {
          return prevSelected;
        }
      });
    } else {
      alert("You can select up to 1 teachers only.");
    }
  };

  const handleTeacherDeselect = (teacher) => {
    setSelectedTeachers((prevSelected) =>
      prevSelected.filter((t) => t._id !== teacher._id)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      skills: selectedValues,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "email",
      "topic",
      "skills",
      "interviewType",
      "experienceLevel",
      "date",
      "startTime",
      "interviewMode",
    ];

    // Check if all required fields are filled
    const isAllFieldsFilled = requiredFields.every(
      (field) => formData[field] && formData[field].length > 0
    );

    if (!isAllFieldsFilled) {
      alert("Please fill out all required fields before submitting.");
      return;
    }

    // If no teacher is selected, ask the user
    if (selectedTeachers.length === 0) {
      const userChoice = window.confirm(
        "You have not selected any teacher. Do you want to proceed without selecting a teacher?"
      );

      if (!userChoice) {
        // User chooses to select a teacher
        return;
      } else {
        // User chooses to proceed without selecting a teacher
        formData.noteacher = true;
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/interview/create",
        {
          ...formData,
          teacher: selectedTeachers.map((teacher) => ({
            teacherId: teacher._id,
          })),
          applicationNumber: Date.now(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/StudentPortal");
      } else {
        alert(response.data.message || "Failed to submit request.");
      }
    } catch (error) {
      console.error(
        "Error submitting interview request:",
        error.response?.data || error.message
      );
      alert("An error occurred. Please check your inputs or try again later.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="growwithguru-container">
      <StudentHeader />
      <div className="form-container">
        <h1>Apply for Interview</h1>
        {isProfileUpdated ? (
          <form onSubmit={handleSubmit} className="form-box">
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                disabled
              />
            </div>
            <div>
              <label>Email ID:</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                disabled
              />
            </div>
            <div>
              <label>Topic/Skill Area:</label>
              <select
                name="topic"
                value={formData.topic || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Topic</option>
                <option value="Coding">Coding</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Problem-Solving">Problem-Solving</option>
                <option value="Behavioral">Behavioral</option>
              </select>
            </div>

            <div>
              <label htmlFor="teacherSearch">Search Teacher:</label>
              <TextField
                variant="outlined"
                placeholder="Type a teacher's name"
                value={searchTerm}
                onChange={handleSearchTermChange}
                fullWidth
              />
              {teachers.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    marginTop: "20px",
                  }}
                >
                  {teachers.map((teacher) => (
                    <div
                      key={teacher._id}
                      className="teacher-card"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "15px",
                        width: "300px",
                        backgroundColor: "#f9f9f9",
                        textAlign: "center",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <h3>{teacher.name}</h3>
                      <p>
                        <strong>Designation:</strong> {teacher.designation}
                      </p>
                      <p>
                        <strong>Skills:</strong>{" "}
                        {teacher.skills.map((s) => s.skillName).join(", ")}
                      </p>
                      <button
                        className="select-teacher-btn"
                        style={{
                          backgroundColor: selectedTeachers.includes(teacher)
                            ? "#28a745"
                            : "#007bff",
                          color: "white",
                          border: "none",
                          padding: "10px 15px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (selectedTeachers.includes(teacher)) {
                            handleTeacherDeselect(teacher);
                          } else {
                            handleTeacherSelect(teacher);
                          }
                        }}
                      >
                        {selectedTeachers.includes(teacher)
                          ? "Deselect"
                          : "Select"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {selectedTeachers.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3>Selected Teacher:</h3>
                  <div
                    style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
                  >
                    {selectedTeachers.map((teacher) => (
                      <div
                        key={teacher._id}
                        className="selected-teacher-card"
                        style={{
                          border: "1px solid #007bff",
                          borderRadius: "8px",
                          padding: "10px",
                          backgroundColor: "#e9f5ff",
                          textAlign: "center",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <h4>{teacher.name}</h4>
                        <p>{teacher.designation}</p>
                        <button
                          style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleTeacherDeselect(teacher)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label>Skills:</label>
              <Select
                options={groupedOptions}
                isMulti
                name="skills"
                value={skillsOptions.filter((option) =>
                  formData.skills.includes(option.value)
                )}
                onChange={handleMultiSelectChange}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div>
              <label>Mock Interview Type:</label>
              <select
                name="interviewType"
                value={formData.interviewType || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Case Study">Case Study</option>
                <option value="Behavioral">Behavioral</option>
              </select>
            </div>
            <div>
              <label>Experience Level:</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label>Available Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Time Range:</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Preferred Interview Mode:</label>
              <select
                name="interviewMode"
                value={formData.interviewMode || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Mode</option>
                <option value="Video Call">Video Call</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>
            <div>
              <label>Drive Link (Optional):</label>
              <input
                type="text"
                name="driveLink"
                value={formData.driveLink || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Resources Link (Optional):</label>
              <input
                type="text"
                name="resourcesLink"
                value={formData.resourcesLink || ""}
                onChange={handleChange}
              />
            </div>
            <input
              type="text"
              name="notes"
              placeholder="Add any additional notes"
              value={formData.notes}
              onChange={handleChange}
            />
            <button type="submit">Submit Request</button>
          </form>
        ) : (
          <div className="profile-update-container">
            <h3>
              Your profile is incomplete. Please update your profile to apply
              for an interview.
            </h3>
            <button onClick={() => navigate("/ProfilePage")}>
              Update Profile
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ApplyForInterview;
