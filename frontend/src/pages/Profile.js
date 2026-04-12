import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth";
import { getUserData, updateUserData } from "../firebase/userManagement";
import { User, Mail, Phone, Calendar, Check, AlertCircle, Pencil, X } from "lucide-react";

const Profile = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
  });

  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        try {
          const data = await getUserData(user.uid);
          setFormData({
            studentId: data.studentId || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            gender: data.gender || "",
            dob: data.dob || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
          });
        } catch (error) {
          setMessage({ type: "danger", text: "Failed to load user data." });
        }
      } else {
        setMessage({ type: "warning", text: "Please log in to view your profile." });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = () => {
    setEditData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dob: formData.dob,
      phone: formData.phone,
    });
    setMessage({ type: "", text: "" });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
    setMessage({ type: "", text: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
      setEditData({ ...editData, phone: digitsOnly });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    if (!userUid) {
      setMessage({ type: "danger", text: "User not authenticated." });
      setIsSaving(false);
      return;
    }

    try {
      await updateUserData(userUid, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        gender: editData.gender,
        dob: editData.dob,
        phone: editData.phone,
      });
      setFormData((prev) => ({ ...prev, ...editData }));
      setIsEditing(false);
      setEditData({});
      setMessage({ type: "success", text: "Profile updated successfully! All changes have been saved." });
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (error) {
      setMessage({ type: "danger", text: error.message });
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Use editData when editing, formData when viewing
  const display = isEditing ? editData : formData;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10">

        {/* Banner Section */}
        <div
          className="rounded-4 mb-4 position-relative overflow-hidden shadow-sm"
          style={{ height: "180px", background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)" }}
        >
          <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)" }}>
            <h2 className="text-white fw-bold mb-0">Student Profile</h2>
            <p className="text-white-50 mb-0">
              {isEditing ? "Editing your information" : "Manage your university information"}
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Column: Avatar & Quick Info */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body text-center p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center shadow-sm mx-auto mb-3"
                  style={{
                    width: "120px",
                    height: "120px",
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "white",
                    background: "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
                    border: "5px solid #f8f9fa"
                  }}
                >
                  {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : <User size={48} />}
                  {formData.lastName ? formData.lastName.charAt(0).toUpperCase() : ""}
                </div>
                <h4 className="fw-bold mb-1 d-flex justify-content-center align-items-center gap-2">
                  {formData.firstName || 'Student'} {formData.lastName || ''}
                </h4>
                <p className="text-primary fw-semibold mb-3">
                  {formData.studentId ? `ID: ${formData.studentId}` : "ID Loading..."}
                </p>
                <hr className="my-4 text-muted opacity-25" />
                <div className="text-start">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3 text-primary"><Mail size={18} /></div>
                    <span className="text-muted small text-truncate">{formData.email || 'No email provided'}</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3 text-primary"><Phone size={18} /></div>
                    <span className="text-muted small">{formData.phone || 'No phone provided'}</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3 text-primary"><Calendar size={18} /></div>
                    <span className="text-muted small">DOB: {formData.dob || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-5">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <User className="text-primary" size={20} /> Personal Information
                </h5>

                {message.text && (
                  <div className={`alert alert-${message.type} rounded-3 d-flex align-items-center gap-2`} role="alert">
                    {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Student ID — always read-only */}
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Student ID Number</label>
                    <input
                      type="text"
                      value={formData.studentId}
                      className="form-control form-control-lg bg-light border-0 text-muted"
                      readOnly
                    />
                  </div>

                  {/* First and Last Name */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        First Name{isEditing && <span className="text-danger">*</span>}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={display.firstName || ""}
                        onChange={handleChange}
                        className={`form-control form-control-lg ${isEditing ? "border-light-subtle shadow-none bg-light-subtle" : "bg-light border-0 text-muted"}`}
                        readOnly={!isEditing}
                        required={isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Last Name{isEditing && <span className="text-danger">*</span>}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={display.lastName || ""}
                        onChange={handleChange}
                        className={`form-control form-control-lg ${isEditing ? "border-light-subtle shadow-none bg-light-subtle" : "bg-light border-0 text-muted"}`}
                        readOnly={!isEditing}
                        required={isEditing}
                      />
                    </div>
                  </div>

                  {/* Gender and Date of Birth */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Gender{isEditing && <span className="text-danger">*</span>}
                      </label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={display.gender || ""}
                          onChange={handleChange}
                          className="form-select form-select-lg border-light-subtle shadow-none"
                          style={{ backgroundColor: '#f8f9fa' }}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={formData.gender}
                          className="form-control form-control-lg bg-light border-0 text-muted"
                          readOnly
                        />
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Date of Birth{isEditing && <span className="text-danger">*</span>}
                      </label>
                      <input
                        type={isEditing ? "date" : "text"}
                        name="dob"
                        value={display.dob || ""}
                        onChange={handleChange}
                        className={`form-control form-control-lg ${isEditing ? "border-light-subtle shadow-none bg-light-subtle" : "bg-light border-0 text-muted"}`}
                        readOnly={!isEditing}
                        required={isEditing}
                      />
                    </div>
                  </div>

                  {/* Email (always read-only) and Phone */}
                  <div className="row g-3 mb-5">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">Email Address</label>
                      <input
                        type="text"
                        value={formData.email}
                        className="form-control form-control-lg bg-light border-0 text-muted"
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Phone Number{isEditing && <span className="text-danger">*</span>}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={display.phone || ""}
                        onChange={handleChange}
                        className={`form-control form-control-lg ${isEditing ? "border-light-subtle shadow-none bg-light-subtle" : "bg-light border-0 text-muted"}`}
                        readOnly={!isEditing}
                        required={isEditing}
                        maxLength={11}
                        pattern="\d{11}"
                        inputMode="numeric"
                        title="Phone number must be exactly 11 digits"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="btn btn-outline-secondary btn-lg rounded-pill px-4 d-flex align-items-center gap-2"
                          disabled={isSaving}
                        >
                          <X size={20} />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm d-flex align-items-center gap-2"
                          disabled={isSaving}
                          style={{ transition: "all 0.3s ease", background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)", border: "none" }}
                        >
                          {isSaving ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check size={20} />
                              Save Changes
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleEditClick}
                        className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm d-flex align-items-center gap-2"
                        style={{ transition: "all 0.3s ease", background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)", border: "none" }}
                      >
                        <Pencil size={20} />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;