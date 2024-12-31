import React from "react";
import "../styles/RegiserStyles.css";
import { Form, Input, Select, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Registered Successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  return (
    <div className="center-container">
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="custom-form"
        >
          <h3 className="text-center">Register Form</h3>
          <Form.Item label="Name" name="name">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <Form.Item label="Role" name="role" required>
            <Select>
              <Select.Option value="Teacher">Teacher</Select.Option>
              <Select.Option value="Student">Student</Select.Option>
            </Select>
          </Form.Item>
          <Link to="/login" className="custom-link">
            Already a user? Login here
          </Link>
          <button className="custom-btn" type="submit">
            Register
          </button>
        </Form>
      </div>
    </div>
  );
};
export default Register;
