import React from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoutes from "./components/ProtectedRoutes";

import ApplyForInterview from "./pages/student/ApplyForInterview";
import ProfilePage from "./pages/student/ProfilePage";
import MyApplications from "./pages/student/MyApplications";
import StudentPortal from "./pages/student/StudentPortal";

import TeacherNotifications from "./pages/teacher/TeacherNotifications";
import TeacherPortal from "./pages/teacher/TeacherPortal";
import TProfilePage from "./pages/teacher/TProfilePage";
import TeacherDetails from "./pages/teacher/TeacherDetails";
import TeacherAvailability from "./pages/teacher/TeacherAvailability";
import Feedback from "./pages/teacher/feedback";
import FeedbackView from "./pages/student/FeedbackView";

function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <Router>
      {loading ? (
        <Spinner />
      ) : (
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/TeacherNotifications"
            element={
              <PublicRoute>
                <TeacherNotifications />
              </PublicRoute>
            }
          />

          {/* Protected routes for Students */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/StudentPortal" element={<StudentPortal />} />
            <Route path="/ApplyForInterview" element={<ApplyForInterview />} />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/FeedbackView" element={<FeedbackView />} />
          </Route>

          {/* Protected routes for Teachers */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/TeacherPortal/*" element={<TeacherPortal />} />
            <Route path="/TProfilePage/*" element={<TProfilePage />} />
            <Route path="/teacher/:id" element={<TeacherDetails />} />
            <Route path="/Feedback/*" element={<Feedback />} />
            <Route
              path="/TeacherAvailability"
              element={<TeacherAvailability />}
            />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
