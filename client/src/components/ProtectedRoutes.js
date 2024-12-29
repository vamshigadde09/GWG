import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";

const ProtectedRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

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
          setAuthorized(true);
        } else {
          setAuthorized(false);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error in ProtectedRoutes:", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Spinner />; // Show a spinner while loading
  }

  if (!authorized) {
    return <Navigate to="/login" replace />; // Redirect to login if unauthorized
  }

  return <Outlet />; // Render protected components
};

export default ProtectedRoutes;
