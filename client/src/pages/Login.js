import React from "react";
import "../styles/RegiserStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onFinishHandler = async (values) => {
    try {
      setIsSubmitting(true);
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      dispatch(hideLoading());
      setIsSubmitting(false);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");

        if (res.data.role === "Student") {
          navigate("/StudentPortal");
        } else if (res.data.role === "Teacher") {
          navigate("/TeacherPortal");
        }
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      setIsSubmitting(false);
      message.error(
        "Login failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="form-container">
      <Form
        layout="vertical"
        onFinish={onFinishHandler}
        className="register-form"
      >
        <h3 className="text-center">Login Form</h3>
        <Form.Item label="Email" name="email">
          <Input type="email" required />
        </Form.Item>

        <p>teacher1_updated@example.com</p>
        <Form.Item label="Password" name="password">
          <Input type="password" required />
        </Form.Item>
        <p>password123</p>
        <Link to="/register" className="m-2">
          Not a user? Register here
        </Link>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </Form>
    </div>
  );
};

export default Login;
