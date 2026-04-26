import React, { useState } from "react";
import { markAttendance } from "../firebase/attendance";

const StudentCheckIn = () => {
  const [sessionId, setSessionId] = useState("");
  const [studentId, setStudentId] = useState("");

  const handleCheckIn = async () => {
    await markAttendance(Date.now().toString(), {
      sessionId,
      studentId,
      status: "present",
      timestamp: Date.now(),
    });

    alert("Attendance submitted");
  };

  return (
    <div className="container py-5">
      <h3>Student Check-In (TEST)</h3>

      <input
        className="form-control mb-2"
        placeholder="Session ID (QR value)"
        onChange={(e) => setSessionId(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Student ID"
        onChange={(e) => setStudentId(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleCheckIn}>
        Mark Attendance
      </button>
    </div>
  );
};

export default StudentCheckIn;