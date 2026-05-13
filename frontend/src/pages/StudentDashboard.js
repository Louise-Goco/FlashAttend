import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/auth";
import { getUserData } from "../firebase/userManagement";
import { getAllAttendance } from "../firebase/attendance";
import { ref, get } from "firebase/database";
import { db } from "../firebase/config";
import { 
  QrCode, 
  BookOpen, 
  Trophy, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Activity,
  ChevronRight
} from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .sd-root {
    font-family: 'DM Sans', sans-serif;
    background: #f8f9fa;
    min-height: 100vh;
    padding-bottom: 80px;
    color: #1e293b;
  }

  .sd-header {
    background: white;
    border-bottom: 1px solid #eef2f6;
    padding: 40px 0;
    margin-bottom: 32px;
  }

  .sd-welcome-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #e0f2fe;
    color: #0369a1;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .sd-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .sd-subtitle {
    color: #64748b;
    margin-top: 8px;
    font-size: 16px;
  }

  .sd-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .sd-stat-card {
    background: white;
    border: 1px solid #eef2f6;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .sd-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.04);
  }

  .sd-stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }

  .sd-stat-info h4 {
    margin: 0;
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .sd-stat-info div {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #0f172a;
    margin-top: 4px;
  }

  .sd-main-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 28px;
  }

  .sd-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sd-card {
    background: white;
    border: 1px solid #eef2f6;
    border-radius: 24px;
    padding: 24px;
    height: 100%;
  }

  .sd-quick-checkin {
    background: linear-gradient(135deg, #0d6efd 0%, #00d2ff 100%);
    color: white;
    padding: 32px;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;
    border: none;
    width: 100%;
    text-align: left;
  }

  .sd-quick-checkin:hover {
    transform: scale(1.02);
  }

  .sd-quick-checkin::after {
    content: '◈';
    position: absolute;
    right: -20px;
    bottom: -20px;
    font-size: 120px;
    opacity: 0.1;
    font-family: 'Syne';
  }

  .sd-btn-checkin {
    background: white;
    color: #0d6efd;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
  }

  .sd-activity-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.2s;
  }

  .sd-activity-item:hover {
    background: #f8fafc;
  }

  .sd-activity-item:last-child {
    border-bottom: none;
  }

  .sd-activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #f0fdf4;
    color: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sd-activity-info {
    flex: 1;
  }

  .sd-activity-info h5 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }

  .sd-activity-info p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #64748b;
  }

  .sd-activity-status {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #16a34a;
    background: #f0fdf4;
    padding: 4px 8px;
    border-radius: 6px;
  }

  .sd-enrolled-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .sd-class-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.2s;
  }

  .sd-class-card:hover {
    border-color: #cbd5e1;
    background: #f1f5f9;
  }

  .sd-class-code {
    font-size: 11px;
    font-weight: 700;
    background: #eef2ff;
    color: #4f46e5;
    padding: 4px 8px;
    border-radius: 6px;
    margin-bottom: 4px;
    display: inline-block;
  }

  .sd-class-name {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
  }

  @media (max-width: 1024px) {
    .sd-main-grid { grid-template-columns: 1fr; }
  }
`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Fetch enrollment data
        const enrollSnapshot = await get(ref(db, "enrollments"));
        const allEnrollments = enrollSnapshot.exists() ? enrollSnapshot.val() : {};
        
        const myClassIds = [];
        Object.entries(allEnrollments).forEach(([classId, students]) => {
          if (students && students[userData.studentId || userData.identifier]) {
            myClassIds.push(classId);
          }
        });

        // Fetch class details
        const classesSnapshot = await get(ref(db, "classes"));
        const allClasses = classesSnapshot.exists() ? classesSnapshot.val() : {};
        const myClasses = myClassIds.map(id => ({ id, ...allClasses[id] }));
        setEnrolledClasses(myClasses);

        // Fetch sessions
        const sessionsSnapshot = await get(ref(db, "sessions"));
        const allSessions = sessionsSnapshot.exists() ? sessionsSnapshot.val() : {};

        // Fetch attendance
        const attendanceData = await getAllAttendance();
        const myAttendance = Object.entries(attendanceData)
          .map(([id, val]) => {
            const session = allSessions[val.sessionId] || {};
            const classInfo = allClasses[session.classId] || {};
            return { 
              id, 
              ...val, 
              subjectName: classInfo.subjectName || `Class ${val.sessionId}`
            };
          })
          .filter(a => a.studentId === (userData.studentId || userData.identifier))
          .sort((a, b) => b.timestamp - a.timestamp);
        
        setAttendance(myAttendance);

      } catch (err) {
        console.error("Error fetching student dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="p-5 text-center">Preparing your dashboard...</div>;
  }

  const attendanceRate = enrolledClasses.length > 0 
    ? Math.min(100, Math.round((attendance.length / (enrolledClasses.length * 10)) * 100)) // Arbitrary divisor for demo
    : 0;

  return (
    <div className="sd-root">
      <style>{styles}</style>

      {/* Header Section */}
      <div className="sd-header">
        <div className="container">
          <div className="sd-welcome-badge">
            <CheckCircle size={14} /> Student Account Verified
          </div>
          <h1 className="sd-title">Hi, {user?.firstName || "Student"}!</h1>
          <p className="sd-subtitle">Your academic journey at a glance.</p>
        </div>
      </div>

      <div className="container">
        {/* Quick Check-In Banner */}
        <button className="sd-quick-checkin mb-5" onClick={() => navigate("/checkin")}>
          <div>
            <h2 className="sd-title text-white mb-2">Check-In Now</h2>
            <p className="text-white opacity-80">Mark your attendance for your current session instantly.</p>
          </div>
          <div className="sd-btn-checkin">
            <QrCode size={20} /> Open QR Scanner <ChevronRight size={18} />
          </div>
        </button>

        {/* Stats Row */}
        <div className="sd-stats-grid">
          <div className="sd-stat-card">
            <div className="sd-stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>
              <Activity size={28} />
            </div>
            <div className="sd-stat-info">
              <h4>Attendance Rate</h4>
              <div>{attendanceRate}%</div>
            </div>
          </div>
          <div className="sd-stat-card">
            <div className="sd-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Calendar size={28} />
            </div>
            <div className="sd-stat-info">
              <h4>Total Sessions</h4>
              <div>{attendance.length}</div>
            </div>
          </div>
          <div className="sd-stat-card">
            <div className="sd-stat-icon" style={{ background: '#fff7ed', color: '#f59e0b' }}>
              <Trophy size={28} />
            </div>
            <div className="sd-stat-info">
              <h4>Merit Points</h4>
              <div>{attendance.length * 10}</div>
            </div>
          </div>
        </div>

        <div className="sd-main-grid">
          {/* Recent Activity */}
          <div className="sd-left-col">
            <div className="sd-section-title">
              Recent Activity <span className="text-muted small fw-normal">View all</span>
            </div>
            <div className="sd-card p-0 overflow-hidden">
              {attendance.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <Clock size={40} className="mb-3 opacity-20" />
                  <p>No recent activity found.</p>
                </div>
              ) : (
                attendance.slice(0, 5).map((a) => (
                  <div key={a.id} className="sd-activity-item">
                    <div className="sd-activity-icon">
                      <CheckCircle size={20} />
                    </div>
                    <div className="sd-activity-info">
                      <h5>Checked in to {a.subjectName}</h5>
                      <p>{new Date(a.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="sd-activity-status">Verified</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Enrolled Subjects */}
          <div className="sd-right-col">
            <div className="sd-section-title">
              My Subjects
            </div>
            <div className="sd-card">
              {enrolledClasses.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p className="small mb-3">You aren't enrolled in any classes yet.</p>
                  <button 
                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                    onClick={() => navigate("/enrollment")}
                  >
                    Enroll Now
                  </button>
                </div>
              ) : (
                <div className="sd-enrolled-grid">
                  {enrolledClasses.map((c) => (
                    <div key={c.id} className="sd-class-card">
                      <div className="sd-class-info">
                        <div className="sd-class-code">{c.subjectCode}</div>
                        <h6 className="sd-class-name">{c.subjectName}</h6>
                      </div>
                      <ChevronRight size={16} className="text-muted ms-auto" />
                    </div>
                  ))}
                  <button 
                    className="btn btn-link text-primary text-decoration-none small p-0 mt-2 d-flex align-items-center gap-1"
                    onClick={() => navigate("/enrollment")}
                  >
                    Enroll in more <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
