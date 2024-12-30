import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/StudentPortal.css";
import StudentHeader from "../Header/StudentHeader";
import Footer from "../Footer/Footer";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

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

const StudentPortal = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedTeachers, setSuggestedTeachers] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isFilterMode, setIsFilterMode] = useState(false);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/searchTeachers",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            name: searchTerm,
            skills: selectedSkill ? selectedSkill.value : "",
          },
        }
      );
      setTeachers(response.data.data);
    } catch (error) {
      console.error("Error fetching teachers:", error.response?.data || error);
      alert("Error fetching teachers.");
    }
  };

  const fetchSuggestedTeachers = async (name) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/searchTeachers",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { name },
        }
      );
      setSuggestedTeachers(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching suggested teachers:",
        error.response?.data || error
      );
    }
  };

  const handleSearchTermChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      fetchSuggestedTeachers(value);
    } else {
      setSuggestedTeachers([]);
    }
  };

  const toggleFilterMode = () => {
    setIsFilterMode((prev) => !prev);
  };

  const handleSearch = () => {
    fetchTeachers();
  };

  return (
    <div className="growwithguru-container">
      <StudentHeader />
      <div className="body-box">
        <section className="searchbar">
          {!isFilterMode ? (
            <>
              <Autocomplete
                options={suggestedTeachers}
                getOptionLabel={(option) =>
                  `${option.name} - ${option.designation}` || "No Name"
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search by Name for Teachers"
                    variant="outlined"
                    placeholder="Type a teacher's name"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                  />
                )}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSearchTerm(newValue.name);
                  }
                }}
                style={{ flex: 1, marginRight: "10px" }}
              />
              <button
                className="search-btn"
                onClick={handleSearch}
                style={{
                  backgroundColor: "#003366",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Search
              </button>
              <button
                className="filter-btn"
                onClick={toggleFilterMode}
                style={{
                  backgroundColor: "#003366",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Filter
              </button>
            </>
          ) : (
            <>
              <Autocomplete
                options={groupedOptions}
                getOptionLabel={(option) => option.label}
                value={selectedSkill}
                onChange={(event, newValue) => setSelectedSkill(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter by Skill"
                    variant="outlined"
                    placeholder="Select a skill"
                    style={{ flex: 1, marginRight: "10px" }}
                  />
                )}
              />
              <button
                className="filter-search-btn"
                onClick={() => {
                  handleSearch();
                  toggleFilterMode();
                }}
                style={{
                  backgroundColor: "#003366",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </>
          )}
        </section>

        {teachers.length > 0 && (
          <section className="teacher-list">
            {teachers.map((teacher) => (
              <div key={teacher._id} className="teacher-item">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <h3>{teacher.name}</h3>
                    <p>
                      <strong>Designation:</strong> {teacher.designation}
                    </p>
                    <p>
                      <strong>Skills:</strong>{" "}
                      {teacher.skills.map((s) => s.skillName).join(", ")}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <a
                      href={`/teacher/${teacher._id}`}
                      className="see-more-link"
                      onClick={() => navigate(`/teacher/${teacher._id}`)}
                      style={{
                        textDecoration: "none",
                        color: "#003366",
                        fontWeight: "bold",
                      }}
                    >
                      See More
                    </a>
                    {/* Clear or Cancel Button */}
                    <button
                      onClick={() =>
                        setTeachers((prevTeachers) =>
                          prevTeachers.filter((t) => t._id !== teacher._id)
                        )
                      }
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="intro-section">
          <h1>Welcome to GROW WITH GURU - Your Path to Interview Success</h1>
          <p>
            We’re excited to have you here! GROW WITH GURU is designed to
            support you in preparing for job interviews, providing you with the
            tools and resources you need to excel. Our platform offers
            comprehensive mock interviews that simulate real interview
            experiences, helping you build confidence and improve your skills.
            Get ready to take the next step towards your dream job with our
            expert guidance and support.
          </p>
        </section>
        <section className="features-section">
          <h2>What GROW WITH GURU Offers:</h2>
          <ol>
            <li>
              <strong>Mock Interview Scheduling:</strong> Schedule mock
              interviews with experienced interviewers at your convenience.
            </li>
            <li>
              <strong>Feedback and Improvement:</strong> Receive detailed,
              constructive feedback on your interview performance.
            </li>
            <li>
              <strong>Resources and Tips:</strong> Access a wealth of resources
              including interview tips, sample questions, and best practices.
            </li>
          </ol>
        </section>
        <section className="testimonials-section">
          <h2>Testimonials Section: Hear from our Successful Users:</h2>
          <blockquote>
            <p>
              “The mock interviews on GROW WITH GURU were a game-changer for me.
              The feedback was incredibly detailed and helped me improve
              significantly. I felt so much more confident during my actual
              interviews.”
            </p>
            <footer>— John Doe, Computer Science Major</footer>
          </blockquote>
          <blockquote>
            <p>
              “Thanks to the personalized coaching sessions, I was able to
              identify and work on my weaknesses. I landed my dream job right
              after graduation!”
            </p>
            <footer>— Jane Smith, Electrical Engineering Graduate</footer>
          </blockquote>
        </section>
        <section className="faq-section">
          <h2>FAQ Section: Frequently Asked Questions:</h2>
          <dl>
            <dt>Q: How do I schedule a mock interview?</dt>
            <dd>
              A: Sign up or log in to your account, navigate to the scheduling
              section, and select a suitable time and interviewer.
            </dd>
            <dt>Q: What kind of feedback will I receive?</dt>
            <dd>
              A: You will receive detailed feedback on various aspects of your
              interview performance, including communication skills, body
              language, and content of your answers.
            </dd>
            <dt>Q: Can I review my interview recordings?</dt>
            <dd>
              A: Yes, all mock interviews are recorded, and you can review the
              recordings to assess your performance.
            </dd>
            <dt>Q: How is my privacy protected?</dt>
            <dd>
              A: Your privacy is our priority. All data, including video
              recordings, are securely stored and only accessible to you and
              your interviewer.
            </dd>
            <dt>Q: What if I need technical support?</dt>
            <dd>
              A: You can reach out to our support team via email or use our
              real-time chat feature for immediate assistance.
            </dd>
          </dl>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default StudentPortal;
