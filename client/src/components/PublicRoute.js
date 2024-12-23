import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/v1/user/getUserData",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          setRole(res.data.data.role);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (token) {
      fetchUserRole();
    }
  }, [token]);

  if (token && role === "Student") {
    return <Navigate to="/StudentPortal" replace />;
  }

  if (token && role === "Teacher") {
    return <Navigate to="/TeacherPortal" replace />;
  }

  return children;
};

export default PublicRoute;
