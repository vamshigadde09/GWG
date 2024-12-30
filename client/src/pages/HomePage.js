import React, { useEffect } from "react";
import axios from "axios";
import "../styles/Homepage.css";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

const HomePage = () => {
  // login user data
  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) throw new Error("Token not found");

      await axios.post(
        "/api/v1/user/getUserData",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Correctly reference the token here
          },
        }
      );
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="homepage-container">
      <Header />
      <div className="body-box">
        <section className="intro-section section">
          <h1 className="intro-title">
            Welcome to GROW WITH GURU - Your Path to Interview Success
          </h1>
          <p className="intro-description">
            At GROW WITH GURU , we understand the challenges students face
            during campus placements. Our platform is designed to provide
            comprehensive mock interviews that simulate real job interview
            experiences, helping you build confidence and hone your skills. With
            the guidance of experienced teachers and professionals, you'll
            receive invaluable feedback and insights to enhance your interview
            performance and increase your chances of landing your dream job.
          </p>
        </section>

        <section className="why-mock-interviews-matter section">
          <h2 className="section-title">Why Mock Interviews Matter:</h2>
          <ul className="why-list">
            <li className="why-item">
              Practical Experience: Gain firsthand experience in a simulated
              interview environment.
            </li>
            <li className="why-item">
              Constructive Feedback: Receive detailed, actionable feedback to
              identify strengths and areas for improvement.
            </li>
            <li className="why-item">
              Confidence Building: Practice and preparation boost your
              confidence and reduce interview anxiety.
            </li>
            <li className="why-item">
              Skill Enhancement: Develop and hone critical interview skills that
              are essential for success in the job market.
            </li>
          </ul>
        </section>

        <section className="features-section section">
          <h2 className="section-title">Features Section:</h2>
          <ol className="features-list">
            <li className="features-item">
              Mock Interview Scheduling: Easily schedule mock interviews at your
              convenience with experienced teachers or industry professionals.
              Automated reminders to keep you on track.
            </li>
            <li className="features-item">
              Feedback and Improvement: Receive comprehensive, constructive
              feedback on your interview performance. Detailed reports
              highlighting strengths and areas for improvement.
            </li>
            <li className="features-item">
              Personalized Coaching: Engage in personalized coaching sessions
              tailored to your specific needs. Get tips and strategies from
              seasoned interviewers to enhance your performance.
            </li>
          </ol>
        </section>

        <section className="testimonials-section section">
          <h2 className="section-title">
            Testimonials Section: Hear from Our Successful Users:
          </h2>
          <blockquote className="testimonial">
            "The mock interviews on [Platform Name] were a game-changer for me.
            The feedback was incredibly detailed and helped me improve
            significantly. I felt so much more confident during my actual
            interviews." - John Doe, Computer Science Major
          </blockquote>
          <blockquote className="testimonial">
            "Thanks to the personalized coaching sessions, I was able to
            identify and work on my weaknesses. I landed my dream job right
            after graduation!" - Jane Smith, Electrical Engineering Graduate
          </blockquote>
        </section>

        <section className="faq-section section">
          <h2 className="section-title">
            FAQ Section: Frequently Asked Questions:
          </h2>
          <dl className="faq-list">
            <dt className="faq-question">
              1. Q: How do I schedule a mock interview?
            </dt>
            <dd className="faq-answer">
              A: After signing up or logging in, you can schedule a mock
              interview through the scheduling section by selecting an available
              slot and interviewer.
            </dd>
            <dt className="faq-question">
              2. Q: What kind of feedback will I receive?
            </dt>
            <dd className="faq-answer">
              A: You will receive detailed, constructive feedback on various
              aspects of your interview performance, including communication
              skills, body language, and content of your answers.
            </dd>
            <dt className="faq-question">
              3. Q: Are the mock interviews recorded?
            </dt>
            <dd className="faq-answer">
              A: Yes, all mock interviews are recorded, and you can review the
              recordings to assess your performance.
            </dd>
            <dt className="faq-question">4. Q: How is my privacy protected?</dt>
            <dd className="faq-answer">
              A: Your privacy is our priority. All data, including video
              recordings, are securely stored and only accessible to you and
              your interviewer.
            </dd>
            <dt className="faq-question">
              5. Q: What if I need technical support?
            </dt>
            <dd className="faq-answer">
              A: You can reach out to our support team via email or phone for
              any technical assistance or inquiries.
            </dd>
          </dl>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
