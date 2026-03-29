// frontend/src/pages/Register.js
import React, { useState } from "react";
import "../styles/register.css";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to auth.js / userManagement.js for Firebase
    console.log(formData);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Create Account</h2>
      <p style={{ textAlign: "center" }}>
        Register with your University of Cebu- Banilad Student ID
      </p>
      <form onSubmit={handleSubmit}>
        {/* Student ID */}
        <div style={{ marginBottom: "15px" }}>
          <label>Student ID Number*</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>

        {/* First and Last Name */}
        <div className="form-row">
          <div>
            <label>First Name*</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
          <div>
            <label>Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
        </div>

        {/* Gender and Date of Birth */}
        <div className="form-row">
          <div>
            <label>Gender*</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
          <div>
            <label>Date of Birth*</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="form-row">
          <div>
            <label>Email Address*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
          <div>
            <label>Phone Number*</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
        </div>

        {/* Password and Confirm Password */}
        <div className="form-row">
          <div>
            <label>Password*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
          <div>
            <label>Confirm Password*</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: "50%",
            padding: "6px 12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "20px",  // round edges
            display: "block",      // center the button
            margin: "0 auto",      // horizontal centering
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;