// frontend/src/pages/Register.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  const [studentIdError, setStudentIdError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "studentId") {
      // Only allow digits, block any non-integer characters
      if (value !== "" && !/^\d+$/.test(value)) {
        setStudentIdError("Student ID must contain numbers only.");
        return; // Reject the input entirely — don't update state
      }
      // Enforce 8-digit max
      if (value.length > 8) {
        setStudentIdError("Student ID must be at most 8 digits.");
        return; // Reject input beyond 8 digits
      }
      // Clear error when input is valid
      setStudentIdError("");
    }

    if (name === "phone") {
      // Only allow digits, block any non-integer characters
      if (value !== "" && !/^\d+$/.test(value)) {
        setPhoneError("Phone number must contain numbers only.");
        return; // Reject the input entirely — don't update state
      }
      // Enforce 11-digit max
      if (value.length > 11) {
        setPhoneError("Phone number must be at most 11 digits.");
        return; // Reject input beyond 11 digits
      }
      // Clear error when input is valid
      setPhoneError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Student ID validation
    if (!/^\d{1,8}$/.test(formData.studentId)) {
      setStudentIdError("Student ID must be 1–8 digits and numbers only.");
      return;
    }

    // 2. Phone number validation
    if (!/^\d{11}$/.test(formData.phone)) {
      setPhoneError("Phone number must be exactly 11 digits and numbers only.");
      return;
    }

    // 3. Password match check
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "danger", text: "Passwords do not match!" });
      return;
    }

    try {
      // 3. Register in Firebase Auth (returns the user object)
      const userCredential = await registerUser(formData.email, formData.password);
      const user = userCredential.user; // Extract the user object

      // 4. Save other user data in Database using the UID
      // Make sure your saveUserData function is updated to accept (uid, data)
      await saveUserData(user.uid, formData); 

      // 5. Success notification
      setMessage({ type: "success", text: "Registration successful!" });

      // 6. Clear the form
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
      setStudentIdError("");
      setPhoneError("");

    } catch (error) {
      // Catches errors from both registration AND saving data
      setMessage({ type: "danger", text: error.message });
    }
  };

  const handleClear = () => {
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
    setStudentIdError("");
    setPhoneError("");
    setMessage({ type: "", text: "" });
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
        <p className="mb-0" style={{ color: "#FFFFFF" }}>
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
              className={`form-control ${studentIdError ? "is-invalid" : formData.studentId ? "is-valid" : ""}`}
              placeholder="Enter 8-digit Student ID"
              maxLength={8}
              inputMode="numeric"
              required
            />
            {studentIdError && (
              <div className="invalid-feedback">{studentIdError}</div>
            )}
            {!studentIdError && formData.studentId && (
              <div className="form-text text-muted">
                {formData.studentId.length}/8 digits
              </div>
            )}
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
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
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
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${phoneError ? "is-invalid" : formData.phone ? "is-valid" : ""}`}
                placeholder="Enter 11-digit phone number"
                maxLength={11}
                inputMode="numeric"
                required
              />
              {phoneError && (
                <div className="invalid-feedback">{phoneError}</div>
              )}
              {!phoneError && formData.phone && (
                <div className="form-text text-muted">
                  {formData.phone.length}/11 digits
                </div>
              )}
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

          <div className="d-flex justify-content-center gap-3">
          <button
              type="button"
              onClick={handleClear}
              className="btn w-50"
              style={{
                backgroundColor: "white",
                color: "#0d6efd",
                borderRadius: "25px",
                border: "2px solid #0d6efd",
                padding: "10px 0",
                fontWeight: "500",
              }}
            >
              Clear All
            </button>
            <button
              type="submit"
              className="btn w-50"
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
          </div>
          
          <div className="text-center mt-4">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-decoration-none">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;