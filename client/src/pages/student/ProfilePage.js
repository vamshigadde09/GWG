import React, { useState } from "react";
import "../../styles/ProfilePage.css";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import StudentHeader from "../Header/StudentHeader";
import Footer from "../Footer/Footer";
import Spinner from "../../components/Spinner";

const fetchStudentData = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await axios.post(
    "http://localhost:8080/api/v1/user/getUserData",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.data.studentProfile || {};
};

const updateStudentData = async (updatedData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    "http://localhost:8080/api/v1/user/updateProfile",
    updatedData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { isLoading, error } = useQuery("studentProfile", fetchStudentData, {
    onSuccess: (profileData) => setFormData(profileData),
  });

  const mutation = useMutation(updateStudentData, {
    onSuccess: () => {
      alert("Profile updated successfully!");
      queryClient.invalidateQueries("studentProfile");
      setIsEditing(false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  };
  const handleSave = () => {
    const cleanedProjects =
      formData.projects?.filter(
        (project) => project.title.trim() && project.description.trim()
      ) || [];
    setFormData({ ...formData, projects: cleanedProjects });
    mutation.mutate(formData);
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  // New fields to render
  const profileFields = [
    { label: "Name", field: "name" },
    { label: "Phone", field: "phone" },
    { label: "Department", field: "department" },
    { label: "Batch", field: "batch" },
    { label: "Program", field: "program" },
    { label: "Specialization", field: "specialization" },
    { label: "Branch", field: "branch" },
    { label: "LinkedIn", field: "linkedIn" },
    { label: "Career Goals", field: "careerGoals" },
    { label: "GPA", field: "gpa" },
    { label: "Additional Notes", field: "additionalNotes" },
  ];

  return (
    <div className="growwithguru-container">
      <StudentHeader />
      <div className="profile-details">
        <h2>Student Profile</h2>
        <div className="profile-row">
          {isEditing ? (
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          ) : (
            formData.profilePicture && (
              <img
                src={formData.profilePicture}
                alt="Profile"
                className="profile-picture"
              />
            )
          )}
        </div>
        {profileFields.map(({ label, field }) => (
          <div className="profile-row" key={field}>
            <label>{label}:</label>
            <input
              type={field === "gpa" ? "number" : "text"}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        ))}

        <div className="projects-section">
          <h3>Projects</h3>
          {formData.projects?.map((project, index) => (
            <div key={index} className="project-row">
              <label className="project-title">Project Title:</label>
              <input
                type="text"
                name={`projectTitle-${index}`}
                value={project.title || ""}
                placeholder="Enter project title"
                className="project-title-input"
                onChange={(e) => {
                  const updatedProjects = [...formData.projects];
                  updatedProjects[index].title = e.target.value;
                  setFormData({ ...formData, projects: updatedProjects });
                }}
                disabled={!isEditing}
              />

              <label className="project-description">
                Project Description:
              </label>
              <textarea
                name={`projectDescription-${index}`}
                value={project.description || ""}
                placeholder="Enter project description"
                className="project-description-input"
                onChange={(e) => {
                  const updatedProjects = [...formData.projects];
                  updatedProjects[index].description = e.target.value;
                  setFormData({ ...formData, projects: updatedProjects });
                }}
                disabled={!isEditing}
              />
            </div>
          ))}
          {isEditing && (
            <button
              className="add-project-btn"
              onClick={() =>
                setFormData({
                  ...formData,
                  projects: [
                    ...(formData.projects || []),
                    { title: "", description: "" },
                  ],
                })
              }
            >
              Add Project
            </button>
          )}
        </div>

        <button
          className="profile-btn"
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              // Remove empty projects when entering edit mode
              const cleanedProjects =
                formData.projects?.filter(
                  (project) =>
                    project.title.trim() || project.description.trim()
                ) || [];
              setFormData({ ...formData, projects: cleanedProjects });
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
