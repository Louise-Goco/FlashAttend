import React, { useState } from "react";
import {
  createAttendanceSession,
  listenToAttendanceBySession,
} from "../firebase/attendance";

import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import QRCode from "react-qr-code";
import { updateAttendance } from "../firebase/attendance";

const AttendanceManagement = () => {
  const [sessionId, setSessionId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const handleStartSession = async () => {
    const newSessionId = Date.now().toString();

    await createAttendanceSession(newSessionId, {
      classId: "CSE101",
      teacherId: "T123",
      isActive: true,
      createdAt: Date.now(),
      qrToken: newSessionId,
    });

    setSessionId(newSessionId);
    setIsActive(true);

    listenToAttendanceBySession(newSessionId, setAttendance);
  };

  const handleStopSession = () => {
    setIsActive(false);
    setSessionId(null);
    setAttendance([]);
  };

  return (
    <div>
      {/* GLOBAL NAVBAR */}
      <Navbar />

      <div className="container py-5">

        {/* MAIN CARD */}
        <div
          className="card mx-auto shadow-lg border-0"
          style={{ maxWidth: "900px", borderRadius: "15px" }}
        >
          {/* HEADER */}
          <div
            className="card-header text-white"
            style={{ backgroundColor: "#0d6efd" }}
          >
            <h4 className="mb-0">Attendance Management</h4>
            <small>Teacher Session Control Panel</small>
          </div>

          {/* BODY */}
          <div className="card-body p-4">

            {/* SESSION CONTROLS (ONLY HERE, NO DUPLICATION) */}
            <div className="row mb-4">
              <div className="col-md-6">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleStartSession}
                  disabled={isActive}
                >
                  Start Attendance
                </button>
              </div>

              <div className="col-md-6">
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={handleStopSession}
                  disabled={!isActive}
                >
                  Stop Session
                </button>
              </div>
            </div>

            {/* ACTIVE SESSION */}
            {sessionId && (
              <div className="p-3 mb-4 border rounded text-center">

                <h6 className="text-primary">Active Session</h6>

                <p><strong>ID:</strong> {sessionId}</p>

                <p>
                  Status:{" "}
                  <span className={isActive ? "text-success" : "text-danger"}>
                    {isActive ? "ACTIVE" : "STOPPED"}
                  </span>
                </p>

                {/* 🔥 QR CODE GOES HERE */}
                <div className="mt-3 d-flex justify-content-center">
                  <QRCode value={sessionId} />
                </div>

                <small className="text-muted d-block mt-2">
                  Scan this QR to mark attendance
                </small>

              </div>
            )}

            {/* LIVE ATTENDANCE */}
            <div>
              <h6 className="text-primary">Live Attendance</h6>

              {attendance.length === 0 ? (
                <p className="text-muted">No students checked in yet.</p>
              ) : (
                <ul className="list-group">
                  {attendance.map((a, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{a.studentId}</span>

                      <span className="text-muted me-3">{a.status}</span>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            updateAttendance(a.id, { status: "approved" })
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            updateAttendance(a.id, { status: "rejected" })
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;