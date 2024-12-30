import React, { useState, useEffect } from "react";
import "../../styles/TProfilePage.css";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import TeacherHeader from "../Header/TeacherHeader";
import Footer from "../Footer/Footer";
import Spinner from "../../components/Spinner";
import Select from "react-select";

const fetchTeacherData = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/user/getUserData",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data.teacherProfile || {};
  } catch (error) {
    throw new Error("Failed to fetch teacher data");
  }
};

const updateTeacherData = async (updatedData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      "http://localhost:8080/api/v1/user/updateTeacherProfile",
      updatedData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during updateTeacherData:", error.response?.data);
    throw error;
  }
};

// Save form data to local storage
const saveToLocalStorage = (data) => {
  localStorage.setItem("teacherProfileForm", JSON.stringify(data));
};

// Load form data from local storage
const loadFromLocalStorage = () => {
  const savedData = localStorage.getItem("teacherProfileForm");
  return savedData ? JSON.parse(savedData) : null;
};

const skillsOptions = [
  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Data Science", label: "Data Science" },
  { value: "Deep Learning", label: "Deep Learning" },
  { value: "Python", label: "Python", group: "Programming Languages" },
  { value: "Java", label: "Java", group: "Programming Languages" },
  { value: "C", label: "C", group: "Programming Languages" },
  { value: "C++", label: "C++", group: "Programming Languages" },
  { value: "JavaScript", label: "JavaScript", group: "Programming Languages" },
  { value: "TypeScript", label: "TypeScript", group: "Programming Languages" },
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
  { value: "IoT Systems", label: "IoT Systems", group: "Specialized Domains" },
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
    options: skillsOptions.filter((opt) => opt.group === "Frontend Frameworks"),
  },
  {
    label: "Backend Frameworks",
    options: skillsOptions.filter((opt) => opt.group === "Backend Frameworks"),
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
    options: skillsOptions.filter((opt) => opt.group === "Mobile Development"),
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
    options: skillsOptions.filter((opt) => opt.group === "Visualization Tools"),
  },
  {
    label: "Specialized Domains",
    options: skillsOptions.filter((opt) => opt.group === "Specialized Domains"),
  },
  {
    label: "Other Skills",
    options: skillsOptions.filter((opt) => opt.group === "Other Skills"),
  },
];

const designationOptions = [
  "Professor",
  "Research Scholar",
  "Industry Professional",
];

const departmentOptions = ["Technical", "HR", "Case Study", "Behavioral"];

const expertiseOptions = [
  "Coding",
  "Soft Skills",
  "Problem-Solving",
  "Behavioral",
];

const experienceOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const notificationMethodOptions = ["Email", "WhatsApp", "In person"];

const TProfilePage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactDetails: "",
    designation: "",
    department: "",
    areasOfExpertise: "",
    preferredNotificationMethod: "",
    skills: [],
    availability: [],
    availabilityNotes: "",
    linkedIn: "",
    publications: "",
    profilePicture: "",
    otherProfessionalLinks: [],
  });

  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  // Save data to local storage whenever it changes
  useEffect(() => {
    saveToLocalStorage(formData);
  }, [formData]);

  // Synchronize data across tabs
  useEffect(() => {
    const syncDataAcrossTabs = (event) => {
      if (event.key === "teacherProfileForm") {
        const savedData = JSON.parse(event.newValue);
        if (savedData) {
          setFormData(savedData);
        }
      }
    };
    window.addEventListener("storage", syncDataAcrossTabs);
    return () => window.removeEventListener("storage", syncDataAcrossTabs);
  }, []);

  // Save data before leaving the page (tab close or reload)
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToLocalStorage(formData);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData]);

  // Function to handle changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    mutation.mutate(formData);
    saveToLocalStorage(formData);
    alert("Profile saved successfully!");
    setIsEditing(false);
  };

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Function to handle array field changes
  const handleArrayChange = (arrayName, index, field, value) => {
    const updatedArray = [...formData[arrayName]];
    if (field) {
      updatedArray[index][field] = value;
    } else {
      updatedArray[index] = value;
    }
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

  const addArrayItem = (arrayName, itemTemplate) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], itemTemplate],
    });
  };

  const removeArrayItem = (arrayName, index) => {
    const updatedArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

  const { isLoading, error } = useQuery("teacherProfile", fetchTeacherData, {
    onSuccess: (data) => {
      setFormData({
        ...data,
        skills: data.skills || [],
        availability: data.availability || [],
        otherProfessionalLinks: data.otherProfessionalLinks || [],
        profilePicture: data.profilePicture || "",
      });
    },
    onError: (err) => {
      console.error("Error fetching te  acher profile:", err);
      alert("Failed to fetch teacher profile. Please try again.");
    },
  });

  const mutation = useMutation(updateTeacherData, {
    onSuccess: () => {
      alert("Profile updated successfully!");
      queryClient.invalidateQueries("teacherProfile");
    },
    onError: (error) => {
      alert(
        `Failed to update profile: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    },
  });

  const renderSkills = () => (
    <div>
      <p className="profile-row">Skills</p>
      {isEditing ? (
        <div className="skills-editing-container">
          <Select
            className="skills-select"
            options={groupedOptions}
            isMulti
            value={formData.skills.map((skill) => ({
              value: skill.skillName,
              label: skill.skillName,
            }))}
            onChange={(selectedOptions) => {
              const updatedSkills = selectedOptions.map((option) => {
                const existingSkill = formData.skills.find(
                  (skill) => skill.skillName === option.value
                );
                return {
                  skillName: option.value,
                  experienceLevel: existingSkill
                    ? existingSkill.experienceLevel
                    : "Beginner",
                };
              });
              setFormData({ ...formData, skills: updatedSkills });
              localStorage.setItem(
                "teacherFormData",
                JSON.stringify({ ...formData, skills: updatedSkills })
              );
            }}
          />
          {formData.skills.map((skill, index) => (
            <div key={index} className="skill-row">
              <label className="skill-name">{skill.skillName}</label>
              <Select
                className="experience-select"
                options={experienceOptions}
                value={experienceOptions.find(
                  (exp) => exp.value === skill.experienceLevel
                )}
                onChange={(selectedOption) => {
                  const updatedSkills = [...formData.skills];
                  updatedSkills[index].experienceLevel = selectedOption.value;
                  setFormData({ ...formData, skills: updatedSkills });
                  localStorage.setItem(
                    "teacherFormData",
                    JSON.stringify({ ...formData, skills: updatedSkills })
                  );
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <ul className="skills-list">
          {formData.skills?.length > 0 ? (
            formData.skills.map((skill, index) => (
              <li key={index} className="skill-item">
                <span className="skill-name">{skill.skillName}</span> -{" "}
                <span className="skill-level">{skill.experienceLevel}</span>
              </li>
            ))
          ) : (
            <p className="no-skills-message">No skills available</p>
          )}
        </ul>
      )}
    </div>
  );

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="growwithguru-container">
      <TeacherHeader />
      <div className="profile-details">
        <h2>Profile Details</h2>
        <div className="profile-row">
          {isEditing ? (
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          ) : (
            <img
              src={formData.profilePicture || ""}
              alt="Profile Preview"
              className="profile-picture"
            />
          )}
        </div>

        {[
          { label: "Name", field: "name", type: "text" },
          { label: "Contact Details", field: "contactDetails", type: "text" },
          {
            label: "Availability Notes",
            field: "availabilityNotes",
            type: "text",
          },
          { label: "LinkedIn", field: "linkedIn", type: "text" },
          { label: "Publications", field: "publications", type: "text" },
        ].map(({ label, field, type }) => (
          <div className="profile-row" key={field}>
            <label>{label}:</label>
            <input
              type={type}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        ))}

        {[
          {
            label: "Designation",
            field: "designation",
            options: designationOptions,
          },
          {
            label: "Department",
            field: "department",
            options: departmentOptions,
          },
          {
            label: "Areas of Expertise",
            field: "areasOfExpertise",
            options: expertiseOptions,
          },
          {
            label: "Preferred Notification Method",
            field: "preferredNotificationMethod",
            options: notificationMethodOptions,
          },
        ].map(({ label, field, options }) => (
          <div className="profile-row" key={field}>
            <label>{label}:</label>
            <select
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        {renderSkills()}

        <div className="other-links-container">
          <p className="links-title">Other Professional Links</p>
          {!isEditing ? (
            <ul className="other-links-list">
              {formData.otherProfessionalLinks.map((link, index) => (
                <li key={index} className="link-item">
                  {link}
                </li>
              ))}
            </ul>
          ) : (
            <div className="editing-container">
              {formData.otherProfessionalLinks.map((link, index) => (
                <div key={index} className="link-input-container">
                  <input
                    type="text"
                    className="link-input"
                    value={link}
                    onChange={(e) =>
                      handleArrayChange(
                        "otherProfessionalLinks",
                        index,
                        "",
                        e.target.value
                      )
                    }
                  />
                  <button
                    className="remove-link-btn"
                    onClick={() =>
                      removeArrayItem("otherProfessionalLinks", index)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="add-link-btn"
                onClick={() => addArrayItem("otherProfessionalLinks", "")}
              >
                Add Link
              </button>
            </div>
          )}
        </div>

        <button
          className="profile-btn"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default TProfilePage;
