import React, { useState, useEffect, useCallback } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase/config";
import { enrollStudent } from "../firebase/enrollment";

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ce-root {
    font-family: 'DM Sans', sans-serif;
    background: #f7f6f2;
    min-height: 100vh;
    padding: 40px 20px 60px;
    color: #1a1a2e;
  }

  .ce-header {
    max-width: 680px;
    margin: 0 auto 36px;
  }

  .ce-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7c6f5b;
    margin-bottom: 6px;
  }

  .ce-title {
    font-family: 'Lora', serif;
    font-size: 28px;
    font-weight: 600;
    color: #1a1a2e;
    margin: 0;
    line-height: 1.3;
  }

  .ce-subtitle {
    font-size: 14px;
    color: #8a8578;
    margin-top: 6px;
  }

  /* ── Enroll Card ── */
  .ce-card {
    max-width: 680px;
    margin: 0 auto 28px;
    background: #ffffff;
    border: 1px solid #e8e4dc;
    border-radius: 16px;
    padding: 28px 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }

  .ce-card-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #7c6f5b;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ce-card-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e8e4dc;
  }

  .ce-input-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 16px;
  }

  .ce-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ce-field label {
    font-size: 12px;
    font-weight: 500;
    color: #5a5347;
    letter-spacing: 0.02em;
  }

  .ce-input {
    background: #faf9f7;
    border: 1.5px solid #e0dbd2;
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    color: #1a1a2e;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
  }

  .ce-input::placeholder { color: #bdb8b0; }

  .ce-input:focus {
    border-color: #6b8f71;
    box-shadow: 0 0 0 3px rgba(107,143,113,0.12);
    background: #fff;
  }

  .ce-input.error {
    border-color: #c0533a;
    box-shadow: 0 0 0 3px rgba(192,83,58,0.1);
  }

  .ce-error-msg {
    font-size: 12px;
    color: #c0533a;
    margin-top: -8px;
    margin-bottom: 4px;
  }

  .ce-btn {
    width: 100%;
    background: #1a1a2e;
    color: #f7f6f2;
    border: none;
    border-radius: 10px;
    padding: 13px 20px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.15s, transform 0.1s;
    letter-spacing: 0.02em;
  }

  .ce-btn:hover { background: #2d2d4a; }
  .ce-btn:active { transform: scale(0.98); }
  .ce-btn:disabled { background: #c5c1ba; cursor: not-allowed; transform: none; }

  /* Spinner */
  .ce-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(247,246,242,0.3);
    border-top-color: #f7f6f2;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Enrolled List ── */
  .ce-section-header {
    max-width: 680px;
    margin: 0 auto 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ce-section-title {
    font-family: 'Lora', serif;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .ce-count-pill {
    background: #e8e4dc;
    color: #5a5347;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.04em;
  }

  .ce-list {
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ce-class-card {
    background: #fff;
    border: 1px solid #e8e4dc;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    animation: fadeUp 0.25s ease both;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .ce-class-card:hover {
    border-color: #c8c2b8;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ce-class-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: #eef2ee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .ce-class-info { flex: 1; min-width: 0; }

  .ce-class-id {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
    font-family: 'Lora', serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ce-class-meta {
    font-size: 12px;
    color: #8a8578;
    margin-top: 2px;
  }

  .ce-class-badge {
    background: #eef2ee;
    color: #4a7050;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }

  /* Empty state */
  .ce-empty {
    max-width: 680px;
    margin: 0 auto;
    text-align: center;
    padding: 40px 20px;
    background: #fff;
    border: 1px dashed #d8d3ca;
    border-radius: 14px;
    color: #a09890;
  }

  .ce-empty-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.5; }
  .ce-empty-text { font-size: 13.5px; }

  /* Loading skeleton */
  .ce-skeleton {
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ce-skel-card {
    background: #fff;
    border: 1px solid #e8e4dc;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .skel {
    background: linear-gradient(90deg, #f0ede8 25%, #e8e4dc 50%, #f0ede8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
  }

  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* Toast */
  .ce-toast-wrap {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
  }

  .ce-toast {
    background: #1a1a2e;
    color: #f7f6f2;
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: toastSlide 0.25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    max-width: 300px;
  }

  @keyframes toastSlide {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .ce-toast-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  @media (max-width: 580px) {
    .ce-input-row { grid-template-columns: 1fr; }
    .ce-card { padding: 20px; }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (ts) =>
  new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const CLASS_ICONS = ["◈", "◉", "◫", "◬", "◐", "◑", "◒", "◓"];
const getIcon = (id) => CLASS_ICONS[id.charCodeAt(0) % CLASS_ICONS.length];

// ─── Toast Component ──────────────────────────────────────────────────────────
const ToastStack = ({ toasts }) => (
  <div className="ce-toast-wrap">
    {toasts.map((t) => (
      <div key={t.id} className="ce-toast">
        <div className="ce-toast-dot" style={{ background: t.color }} />
        {t.msg}
      </div>
    ))}
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="ce-skeleton">
    {[1, 2, 3].map((i) => (
      <div key={i} className="ce-skel-card">
        <div className="skel" style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skel" style={{ height: 14, width: "55%", marginBottom: 8 }} />
          <div className="skel" style={{ height: 11, width: "35%" }} />
        </div>
        <div className="skel" style={{ height: 24, width: 70, borderRadius: 20 }} />
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ClassEnrollment = () => {
  const [classCode, setClassCode] = useState("");
  const [studentId, setStudentId] = useState("");
  const [errors, setErrors] = useState({});
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [toasts, setToasts] = useState([]);

  const pushToast = (msg, color = "#6b8f71") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, color }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  // Fetch all classes this student is enrolled in
  const fetchEnrolled = useCallback(async (sid) => {
    if (!sid) { setLoadingList(false); return; }
    setLoadingList(true);
    try {
      const snapshot = await get(ref(db, "enrollments"));
      if (!snapshot.exists()) { setEnrolled([]); return; }

      const data = snapshot.val();
      const found = [];

      Object.entries(data).forEach(([classId, students]) => {
        if (students && students[sid]) {
          found.push({
            classId,
            enrolledAt: students[sid].enrolledAt,
            studentId: sid,
          });
        }
      });

      // Sort newest first
      found.sort((a, b) => b.enrolledAt - a.enrolledAt);
      setEnrolled(found);
    } catch (err) {
      pushToast("Failed to load enrolled classes", "#c0533a");
    } finally {
      setLoadingList(false);
    }
  }, []);

  // Load on studentId change (debounced)
  useEffect(() => {
    if (!studentId.trim()) { setEnrolled([]); setLoadingList(false); return; }
    const t = setTimeout(() => fetchEnrolled(studentId.trim()), 600);
    return () => clearTimeout(t);
  }, [studentId, fetchEnrolled]);

  // Validate
  const validate = () => {
    const e = {};
    if (!classCode.trim()) e.classCode = "Class code is required";
    if (!studentId.trim()) e.studentId = "Student ID is required";

    // Duplicate check
    if (classCode.trim() && studentId.trim()) {
      const isDupe = enrolled.some((x) => x.classId === classCode.trim());
      if (isDupe) e.classCode = "You are already enrolled in this class";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEnroll = async () => {
    if (!validate()) return;
    setEnrolling(true);
    try {
      await enrollStudent(classCode.trim(), studentId.trim());
      pushToast("Successfully enrolled in class!", "#6b8f71");
      setClassCode("");
      await fetchEnrolled(studentId.trim());
    } catch (err) {
      pushToast("Enrollment failed. Check the class code.", "#c0533a");
    } finally {
      setEnrolling(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleEnroll();
  };

  return (
    <>
      <style>{styles}</style>

      <div className="ce-root">
        {/* Header */}
        <div className="ce-header">
          <div className="ce-eyebrow">FlashAttend · Student Portal</div>
          <h1 className="ce-title">Class Enrollment</h1>
          <p className="ce-subtitle">Enter a class code provided by your teacher to join a subject.</p>
        </div>

        {/* Enroll Card */}
        <div className="ce-card">
          <div className="ce-card-label">Join a Class</div>

          <div className="ce-input-row">
            <div className="ce-field">
              <label>Class Code</label>
              <input
                className={`ce-input ${errors.classCode ? "error" : ""}`}
                placeholder="e.g. 1777203708500"
                value={classCode}
                onChange={(e) => { setClassCode(e.target.value); setErrors((x) => ({ ...x, classCode: "" })); }}
                onKeyDown={handleKeyDown}
              />
              {errors.classCode && <div className="ce-error-msg">{errors.classCode}</div>}
            </div>

            <div className="ce-field">
              <label>Student ID</label>
              <input
                className={`ce-input ${errors.studentId ? "error" : ""}`}
                placeholder="e.g. 123"
                value={studentId}
                onChange={(e) => { setStudentId(e.target.value); setErrors((x) => ({ ...x, studentId: "" })); }}
                onKeyDown={handleKeyDown}
              />
              {errors.studentId && <div className="ce-error-msg">{errors.studentId}</div>}
            </div>
          </div>

          <button className="ce-btn" onClick={handleEnroll} disabled={enrolling}>
            {enrolling ? (
              <><div className="ce-spinner" /> Enrolling…</>
            ) : (
              "→ Join Class"
            )}
          </button>
        </div>

        {/* Enrolled List */}
        <div className="ce-section-header">
          <div className="ce-section-title">Enrolled Subjects</div>
          {!loadingList && (
            <div className="ce-count-pill">
              {enrolled.length} {enrolled.length === 1 ? "class" : "classes"}
            </div>
          )}
        </div>

        {loadingList ? (
          <Skeleton />
        ) : enrolled.length === 0 ? (
          <div className="ce-empty">
            <div className="ce-empty-icon">◎</div>
            <div className="ce-empty-text">
              {studentId.trim()
                ? "No enrolled classes found for this Student ID."
                : "Enter your Student ID above to see your enrolled classes."}
            </div>
          </div>
        ) : (
          <div className="ce-list">
            {enrolled.map((item, i) => (
              <div
                key={item.classId}
                className="ce-class-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="ce-class-icon">{getIcon(item.classId)}</div>
                <div className="ce-class-info">
                  <div className="ce-class-id">Class {item.classId}</div>
                  <div className="ce-class-meta">
                    Enrolled {formatDate(item.enrolledAt)} · ID {item.studentId}
                  </div>
                </div>
                <div className="ce-class-badge">Active</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastStack toasts={toasts} />
    </>
  );
};

export default ClassEnrollment;