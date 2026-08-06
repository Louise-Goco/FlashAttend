import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClasses, updateClassData } from "../firebase/classes";
import { auth } from "../firebase/auth";
import { getUserData } from "../firebase/userManagement";
import { getEnrolledStudents } from "../firebase/enrollment";
import { getAllUsers } from "../firebase/userManagement";
import { ref, get } from "firebase/database";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import {
  BookOpen,
  Users,
  Clock,
  PlayCircle,
  ClipboardList,
  CheckCircle,
  Hash,
  Copy,
  Pencil,
  Check,
  X,
  UserCheck,
  MapPin
} from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .fd-root {
    font-family: 'DM Sans', sans-serif;
    background: #f8f9fc;
    min-height: 100vh;
    padding-bottom: 60px;
  }

  .fd-header {
    background: white;
    border-bottom: 1px solid #eef2f6;
    padding: 32px 0;
    margin-bottom: 32px;
  }

  .fd-welcome-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #eef2ff;
    color: #4f46e5;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .fd-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .fd-subtitle {
    color: #64748b;
    margin-top: 8px;
    font-size: 16px;
  }

  .fd-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .fd-stat-card {
    background: white;
    border: 1px solid #eef2f6;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .fd-stat-icon {
    width: 54px;
    height: 54px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fd-stat-info h4 {
    margin: 0;
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .fd-stat-info div {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin-top: 4px;
  }

  .fd-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fd-class-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
  }

  .fd-class-card {
    background: white;
    border: 1px solid #eef2f6;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.2s;
  }

  .fd-class-card:hover {
    border-color: #cbd5e1;
    box-shadow: 0 12px 30px rgba(0,0,0,0.04);
  }

  .fd-class-header {
    padding: 24px;
    border-bottom: 1px dashed #eef2f6;
  }

  .fd-class-code {
    font-size: 11px;
    font-weight: 700;
    color: #4f46e5;
    background: #eef2ff;
    padding: 4px 10px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
    display: inline-block;
  }

  .fd-enrollment-code-box {
    margin-top: 12px;
    background: #f1f5f9;
    border: 1px dashed #cbd5e1;
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s;
  }

  .fd-enrollment-code-box:hover {
    background: #e2e8f0;
    border-color: #94a3b8;
  }

  .fd-enroll-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .fd-enroll-value {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
  }

  .fd-code-input {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    border: 1px solid #4f46e5;
    border-radius: 4px;
    padding: 2px 6px;
    width: 120px;
    outline: none;
  }

  .fd-icon-btn {
    background: none;
    border: none;
    padding: 4px;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .fd-icon-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .fd-icon-btn.save:hover {
    color: #16a34a;
    background: #f0fdf4;
  }

  .fd-icon-btn.cancel:hover {
    color: #dc2626;
    background: #fef2f2;
  }

  /* Students List Modal */
  .fd-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .fd-modal {
    background: white;
    width: 100%;
    max-width: 500px;
    border-radius: 24px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
    overflow: hidden;
    animation: fdModalIn 0.3s ease-out;
  }

  @keyframes fdModalIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fd-modal-header {
    padding: 24px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .fd-modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .fd-modal-body {
    max-height: 400px;
    overflow-y: auto;
    padding: 12px;
  }

  .fd-student-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    transition: background 0.2s;
  }

  .fd-student-item:hover {
    background: #f8fafc;
  }

  .fd-student-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #eef2ff;
    color: #4f46e5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
  }

  .fd-student-info h5 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }

  .fd-student-info p {
    margin: 2px 0 0;
    font-size: 12px;
    color: #64748b;
  }

  .fd-class-name {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    line-height: 1.4;
  }

  .fd-class-body {
    padding: 24px;
  }

  .fd-detail-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #64748b;
    font-size: 14px;
    margin-bottom: 12px;
  }

  .fd-detail-item:last-child { margin-bottom: 0; }

  .fd-class-footer {
    padding: 20px 24px;
    background: #fcfdfe;
    display: flex;
    gap: 12px;
  }

  .fd-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .fd-btn-primary {
    background: #111827;
    color: white;
  }

  .fd-btn-primary:hover {
    background: #1f2937;
    transform: translateY(-2px);
  }

  .fd-btn-secondary {
    background: white;
    color: #111827;
    border: 1px solid #e2e8f0;
  }

  .fd-btn-secondary:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  .fd-empty {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 24px;
    border: 2px dashed #e2e8f0;
  }

  .fd-empty-icon {
    font-size: 48px;
    margin-bottom: 20px;
    opacity: 0.2;
  }

  @media (max-width: 640px) {
    .fd-class-grid { grid-template-columns: 1fr; }
  }
`;

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingStudents, setViewingStudents] = useState(null); // class object
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate("/login");
          return;
        }

        const userData = await getUserData(currentUser.uid);
        setUser(userData);

        const allClasses = await getAllClasses();
        const enrollSnapshot = await get(ref(db, "enrollments"));
        const allEnrollments = enrollSnapshot.exists() ? enrollSnapshot.val() : {};

        const myClasses = Object.keys(allClasses)
          .map(id => {
            const enrollData = allEnrollments[id] || {};
            const studentIds = Object.keys(enrollData);
            return { id, ...allClasses[id], studentCount: studentIds.length, enrollData };
          })
          .filter(c => c.teacherId === currentUser.uid);

        setClasses(myClasses);
      } catch (err) {
        console.error("Error fetching faculty data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Class code ${code} copied to clipboard!`);
  };

  const handleViewStudents = async (c) => {
    setViewingStudents(c);
    setLoadingStudents(true);
    setEnrolledStudents([]);
    try {
      const studentIds = Object.keys(c.enrollData || {});

      if (studentIds.length > 0) {
        const allUsers = await getAllUsers();
        const studentDetails = studentIds.map(id => {
          // Find user by studentId, identifier, or key (UID)
          const u = Object.values(allUsers).find(user => 
            (user.studentId === id || user.identifier === id || user.uid === id)
          );
          
          const firstName = u?.firstName || "";
          const lastName = u?.lastName || "";
          const initials = (firstName[0] || "?") + (lastName[0] || "?");

          return {
            id,
            name: u ? `${firstName} ${lastName}`.trim() || "Unnamed Student" : `Student ${id}`,
            email: u ? u.email : "Email not found",
            initials: initials.toUpperCase()
          };
        });
        setEnrolledStudents(studentDetails);
      }
    } catch (err) {
      console.error("Error processing students:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  if (loading) {
    return <div className="p-5 text-center">Loading Dashboard...</div>;
  }

  return (
    <div className="fd-root">
      <Navbar />
      <style>{styles}</style>

      {/* Header Section */}
      <div className="fd-header">
        <div className="container">
          <div className="fd-welcome-chip">
            <CheckCircle size={14} /> Faculty Account
          </div>
          <h1 className="fd-title">Welcome back, Prof. {user?.lastName || "Faculty"}</h1>
          <p className="fd-subtitle">Manage your subjects and track student attendance effortlessly.</p>
        </div>
      </div>

      <div className="container">
        {/* Stats Row */}
        <div className="fd-stats-grid">
          <div className="fd-stat-card">
            <div className="fd-stat-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
              <BookOpen size={24} />
            </div>
            <div className="fd-stat-info">
              <h4>Total Subjects</h4>
              <div>{classes.length}</div>
            </div>
          </div>
          <div className="fd-stat-card">
            <div className="fd-stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>
              <Users size={24} />
            </div>
            <div className="fd-stat-info">
              <h4>Active Classes</h4>
              <div>{classes.filter(c => c.status === "Active").length}</div>
            </div>
          </div>
          <div className="fd-stat-card">
            <div className="fd-stat-icon" style={{ background: '#fff7ed', color: '#f59e0b' }}>
              <Clock size={24} />
            </div>
            <div className="fd-stat-info">
              <h4>Today's Sessions</h4>
              <div>0</div>
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="fd-section-title">
          <ClipboardList size={22} color="#4f46e5" /> My Assigned Subjects
        </div>

        {classes.length === 0 ? (
          <div className="fd-empty">
            <div className="fd-empty-icon">📚</div>
            <h3>No Subjects Assigned</h3>
            <p className="text-muted">You don't have any subjects assigned to you yet. Please contact the administrator.</p>
          </div>
        ) : (
          <div className="fd-class-grid">
            {classes.map((c) => (
              <div key={c.id} className="fd-class-card">
                <div className="fd-class-header">
                  <div className="fd-class-code">{c.subjectCode}</div>
                  <h3 className="fd-class-name">{c.subjectName}</h3>
                </div>
                <div className="fd-class-body">
                  <div className="fd-detail-item">
                    <Clock size={16} />
                    <span>
                      {c.days?.map(d => d.substring(0, 3)).join(', ')} | {formatTime(c.startTime)} - {formatTime(c.endTime)}
                    </span>
                  </div>
                  <div className="fd-detail-item">
                    <MapPin size={16} />
                    <span>{c.room || "No room assigned"}</span>
                  </div>
                  <div className="fd-detail-item">
                    <Users size={16} />
                    <span>{c.studentCount || 0} Students Enrolled</span>
                  </div>

                  <div className="fd-enrollment-code-box">
                    <div className="fd-enroll-label">
                      <Hash size={12} /> Class Code
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="fd-enroll-value" style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(c.classCode)}>
                        {c.classCode}
                      </span>
                      <button className="fd-icon-btn" onClick={() => copyToClipboard(c.classCode)} title="Copy Code">
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="fd-class-footer">
                  <button
                    className="fd-btn fd-btn-primary"
                    onClick={() => navigate(`/attendance?classId=${c.id}`)}
                  >
                    <PlayCircle size={18} /> Start Session
                  </button>
                  <button
                    className="fd-btn fd-btn-secondary"
                    onClick={() => handleViewStudents(c)}
                  >
                    <Users size={18} /> Students
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Students Modal */}
      {viewingStudents && (
        <div className="fd-modal-overlay" onClick={() => setViewingStudents(null)}>
          <div className="fd-modal" onClick={e => e.stopPropagation()}>
            <div className="fd-modal-header">
              <h3 className="fd-modal-title">Enrolled Students</h3>
              <button className="fd-icon-btn" onClick={() => setViewingStudents(null)}><X size={20} /></button>
            </div>
            <div className="fd-modal-body">
              {loadingStudents ? (
                <div className="p-4 text-center text-muted">Loading student list...</div>
              ) : enrolledStudents.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <UserCheck size={40} className="mb-3 opacity-20" />
                  <p>No students enrolled yet.</p>
                </div>
              ) : (
                enrolledStudents.map(s => (
                  <div key={s.id} className="fd-student-item">
                    <div className="fd-student-avatar">{s.initials}</div>
                    <div className="fd-student-info">
                      <h5>{s.name}</h5>
                      <p>ID: {s.id} • {s.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
