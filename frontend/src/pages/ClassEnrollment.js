import React, { useState } from "react";
import { enrollStudent } from "../firebase/enrollment";

const ClassEnrollment = () => {
  const [classCode, setClassCode] = useState("");
  const [studentId, setStudentId] = useState("");

  const handleEnroll = async () => {
    await enrollStudent(classCode, studentId);
    alert("Student enrolled!");
  };

  return (
    <div className="container py-5">

      <h3>Class Enrollment (Skeleton)</h3>

      <input
        placeholder="Class Code"
        className="form-control mb-2"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value)}
      />

      <input
        placeholder="Student ID"
        className="form-control mb-2"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleEnroll}>
        Join Class
      </button>

    </div>
  );
};

export default ClassEnrollment;