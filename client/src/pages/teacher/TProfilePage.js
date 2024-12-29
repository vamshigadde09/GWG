import React, { useState, useEffect } from "react";
import "../../styles/TProfilePage.css";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import TeacherHeader from "../Header/TeacherHeader";
import Footer from "../Footer/Footer";
import Spinner from "../../components/Spinner";

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
  { value: "JavaScript", label: "JavaScript", group: "Programming Languages" },
  { value: "React", label: "React", group: "Frontend Frameworks" },
  { value: "Angular", label: "Angular", group: "Frontend Frameworks" },
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

  // Function to handle skill changes
  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index][field] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  // Function to add a new skill
  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [
        ...(formData.skills || []),
        { skillName: "", experienceLevel: "" },
      ],
    });
  };

  // Function to remove a skill
  const removeSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
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
        profilePicture:
          data.profilePicture ||
          "D:Projects_GWGGROW-WITH-GURU-main - CopyGROW-WITH-GURU-mainimgprofile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
      });
    },
    onError: (err) => {
      console.error("Error fetching teacher profile:", err);
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

  const renderSkillsSection = () => (
    <div>
      <h3>Skills</h3>
      {formData.skills?.length > 0 ? (
        formData.skills.map((skill, index) => (
          <div key={index} className="skill-row">
            {!isEditing ? (
              <>
                <div className="selected-skill-box">
                  {skill.skillName || "No Skill Selected"}
                </div>
                <div className="selected-skill-box">
                  {skill.experienceLevel || "No Level Selected"}
                </div>
              </>
            ) : (
              <>
                <select
                  value={skill.skillName}
                  onChange={(e) =>
                    handleSkillChange(index, "skillName", e.target.value)
                  }
                >
                  <option value="">Select Skill</option>
                  {skillsOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={skill.experienceLevel}
                  onChange={(e) =>
                    handleSkillChange(index, "experienceLevel", e.target.value)
                  }
                >
                  <option value="">Select Experience Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <button
                  onClick={() => removeSkill(index)}
                  aria-label="Remove Skill"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No skills available</p>
      )}
      {isEditing && (
        <button onClick={addSkill} aria-label="Add Skill">
          Add Skill
        </button>
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
              src={
                formData.profilePicture ||
                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1734939015~exp=1734942615~hmac=2dee67c81aa2b33d156f9a807df4063730be34921d2890ce85468ed39dc1dbde&w=740"
              }
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

        {renderSkillsSection()}

        <div class="other-links-container">
          <h3>Other Professional Links</h3>
          {!isEditing ? (
            <ul class="other-links-list">
              {formData.otherProfessionalLinks.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          ) : (
            <>
              {formData.otherProfessionalLinks.map((link, index) => (
                <div key={index}>
                  <input
                    type="text"
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
                    class="remove-link-btn"
                    onClick={() =>
                      removeArrayItem("otherProfessionalLinks", index)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                class="add-link-btn"
                onClick={() => addArrayItem("otherProfessionalLinks", "")}
              >
                Add Link
              </button>
            </>
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
