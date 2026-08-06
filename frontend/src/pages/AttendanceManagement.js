import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createAttendanceSession,
  listenToAttendanceBySession,
  updateSession,
} from "../firebase/attendance";
import { auth } from "../firebase/auth";
import { getAllClasses } from "../firebase/classes";
import { getUserData } from "../firebase/userManagement";

import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import QRCode from "react-qr-code";
import { updateAttendance, getAllAttendance } from "../firebase/attendance";

const AttendanceManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialClassId = queryParams.get("classId") || "";

  const [sessionId, setSessionId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [classId, setClassId] = useState(initialClassId);
  const [classDetails, setClassDetails] = useState(null);
  const [myClasses, setMyClasses] = useState([]);

  useEffect(() => {
    const checkRole = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate("/login");
        return;
      }
      try {
        const userData = await getUserData(currentUser.uid);
        if (userData.role !== "Faculty" && userData.role !== "Admin") {
          navigate("/dashboard");
          return;
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkRole();
  }, [navigate]);

  useEffect(() => {
    const fetchClasses = async () => {
      const allClasses = await getAllClasses();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const filtered = Object.keys(allClasses)
          .map(id => ({ id, ...allClasses[id] }))
          .filter(c => c.teacherId === currentUser.uid);
        setMyClasses(filtered);
        
        if (classId) {
          const detail = filtered.find(c => c.id === classId);
          setClassDetails(detail);
        }
      }
    };
    fetchClasses();
  }, [classId]);

  const handleStartSession = async () => {
    if (!classId) {
      alert("Please select a class first.");
      return;
    }

    const newSessionId = Date.now().toString();
    const currentUser = auth.currentUser;

    await createAttendanceSession(newSessionId, {
      classId: classId,
      teacherId: currentUser ? currentUser.uid : "T123",
      isActive: true,
      createdAt: Date.now(),
      qrToken: newSessionId,
    });

    setSessionId(newSessionId);
    setIsActive(true);

    listenToAttendanceBySession(newSessionId, (data) => {
      // Students now store their names directly in the attendance record
      setAttendance(data);
    });
  };

  const handleStopSession = async () => {
    if (sessionId) {
      try {
        await updateSession(sessionId, { isActive: false });
      } catch (e) {
        console.error("Error stopping session:", e);
      }
    }
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
            className="card-header text-white d-flex justify-content-between align-items-center"
            style={{ backgroundColor: "#4f46e5" }}
          >
            <div>
              <h4 className="mb-0">Attendance Management</h4>
              <small>Teacher Session Control Panel</small>
            </div>
            {classDetails && (
              <div className="text-end">
                <h5 className="mb-0">{classDetails.subjectCode}</h5>
                <small>{classDetails.subjectName}</small>
              </div>
            )}
          </div>

          {/* BODY */}
          <div className="card-body p-4">

            {/* CLASS SELECTOR (IF NOT PROVIDED VIA URL) */}
            {!sessionId && (
              <div className="mb-4">
                <label className="form-label fw-bold">Select Class</label>
                <select 
                  className="form-select" 
                  value={classId} 
                  onChange={(e) => setClassId(e.target.value)}
                  disabled={isActive}
                >
                  <option value="">-- Choose a Subject --</option>
                  {myClasses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.subjectCode} - {c.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* SESSION CONTROLS (ONLY HERE, NO DUPLICATION) */}
            <div className="row mb-4">
              <div className="col-md-6">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleStartSession}
                  disabled={isActive || !classId}
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
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-primary mb-0">Live Attendance Feed</h6>
                <span className="badge bg-light text-dark">{attendance.length} students</span>
              </div>

              {attendance.length === 0 ? (
                <div className="text-center py-5 border rounded bg-light">
                  <p className="text-muted mb-0">Waiting for students to check in...</p>
                </div>
              ) : (
                <div className="list-group shadow-sm">
                  {attendance.map((a, i) => (
                    <div
                      key={i}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                    >
                      <div>
                        <div className="fw-bold">{a.studentName || a.studentId}</div>
                        <small className="text-muted">{a.studentId} • {new Date(a.timestamp).toLocaleTimeString()}</small>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <span className={`badge rounded-pill px-3 py-2 ${
                          a.status === 'approved' ? 'bg-success' : 
                          a.status === 'rejected' ? 'bg-danger' : 
                          'bg-warning text-dark'
                        }`}>
                          {a.status.toUpperCase()}
                        </span>

                        {a.status === 'pending' && (
                          <div className="btn-group btn-group-sm shadow-sm">
                            <button
                              className="btn btn-success px-3"
                              onClick={() => updateAttendance(a.id, { status: "approved" })}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger px-3"
                              onClick={() => updateAttendance(a.id, { status: "rejected" })}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        
                        {(a.status === 'approved' || a.status === 'rejected') && (
                          <button 
                            className="btn btn-link btn-sm text-decoration-none text-muted"
                            onClick={() => updateAttendance(a.id, { status: "pending" })}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;