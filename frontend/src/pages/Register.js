// frontend/src/pages/Register.js
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/register.css"; // optional
import { registerUser } from "../firebase/auth";
import { saveUserData } from "../firebase/userManagement";

const Register = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Password match check
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "danger", text: "Passwords do not match!" });
      return;
    }

    try {
      // 2. Register in Firebase Auth (returns the user object)
      const userCredential = await registerUser(formData.email, formData.password);
      const user = userCredential.user; // Extract the user object

      // 3. Save other user data in Database using the UID
      // Make sure your saveUserData function is updated to accept (uid, data)
      await saveUserData(user.uid, formData); 

      // 4. Success notification
      setMessage({ type: "success", text: "Registration successful!" });

      // 5. Clear the form
      setFormData({
        studentId: "",
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      // Catches errors from both registration AND saving data
      setMessage({ type: "danger", text: error.message });
    }
  };

  return (
    <div
      className="card mx-auto mt-5 shadow-lg"
      style={{ maxWidth: "600px", borderRadius: "15px", border: "none" }}
    >
      <div
        className="card-header text-center"
        style={{ backgroundColor: "#0d6efd", color: "white", borderRadius: "15px 15px 0 0" }}
      >
        <h2>Create Account</h2>
        <p className="mb-0" style={{ color: "#ffc107" }}>
          Register with your University of Cebu- Banilad Student ID
        </p>
      </div>

      <div className="card-body bg-white">
        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Student ID */}
          <div className="mb-3">
            <label>Student ID Number*</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* First and Last Name */}
          <div className="row mb-3">
            <div className="col">
              <label>First Name*</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col">
              <label>Last Name*</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Gender and Date of Birth */}
          <div className="row mb-3">
            <div className="col">
              <label>Gender*</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col">
              <label>Date of Birth*</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="row mb-3">
            <div className="col">
              <label>Email Address*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col">
              <label>Phone Number*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Password and Confirm Password */}
          <div className="row mb-4">
            <div className="col">
              <label>Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col">
              <label>Confirm Password*</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-50 d-block mx-auto"
            style={{
              backgroundColor: "#0d6efd",
              color: "white",
              borderRadius: "25px",
              border: "none",
              padding: "10px 0",
              fontWeight: "500",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;