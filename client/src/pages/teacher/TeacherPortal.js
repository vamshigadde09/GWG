import React from "react";
import "../../styles/teacherPortal.css";
import Footer from "../Footer/Footer";
import TeacherHeader from "../Header/TeacherHeader";

const TeacherPortal = () => {
  return (
    <div className="growwithguru-container">
      <TeacherHeader />
      <div className="body-box">
        <section className="intro-section">
          <h1>
            Welcome to GROW WITH GURU - Empowering Students Through Your
            Expertise
          </h1>
          <p>
            Thank you for joining our mission to help educators succeed in their
            job interviews. Your role as a mentor and interviewer is invaluable,
            and we are excited to have you as part of our team. Here at Grow
            With Guru, you'll find features that allow you to prepare, ask
            questions, and respond to interviews. You can easily schedule and
            conduct mock interviews, review and provide feedback, and track your
            progress. Together, we can bridge the gap between knowledge,
            training, and real-world requirements, elevating educators with
            role-prepared to take their career aspirations to new heights.
          </p>
        </section>
        <section className="features-section">
          <h2>What Platform (Guru) Offers:</h2>
          <ol>
            <li>Mock Interview Scheduling</li>
            <li>Performance Tracking</li>
            <li>Interactive Feedback Sessions</li>
            <li>Resources and Insights</li>
          </ol>
        </section>
        <section className="testimonials-section">
          <h2>Testimonials:</h2>
          <blockquote>
            "The mock interviews on Platform [Guru] were a game-changer for me.
            The feedback was incredibly helpful. I gained confidence and
            significantly improved my interview skills."
          </blockquote>
        </section>
        <section className="faq-section">
          <h2>FAQ Section:</h2>
          <dl>
            <dt>Q: How do I schedule a mock interview?</dt>
            <dd>
              A: Sign up or log in to your account, navigate to the scheduling
              section, and select a suitable time and interviewer.
            </dd>
          </dl>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default TeacherPortal;
