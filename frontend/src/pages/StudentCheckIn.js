import React, { useState, useEffect, useRef } from "react";
import { markAttendance, getSession } from "../firebase/attendance";
import { ref, get } from "firebase/database";
import { db } from "../firebase/config";
import { auth } from "../firebase/auth";
import { getUserData } from "../firebase/userManagement";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import { Html5Qrcode } from "html5-qrcode";

// ─── Install: npm install html5-qrcode ───────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  .sc-root {
    font-family: 'DM Sans', sans-serif;
    background: #f0f2f5;
    min-height: 100vh;
    padding: 32px 20px 60px;
    color: #111827;
  }

  .sc-header {
    max-width: 520px;
    margin: 0 auto 28px;
  }

  .sc-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .sc-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .sc-subtitle {
    font-size: 13.5px;
    color: #9ca3af;
    margin-top: 4px;
  }

  /* ── Main Card ── */
  .sc-card {
    max-width: 520px;
    margin: 0 auto 16px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }

  /* ── Scanner Area ── */
  .sc-scanner-wrap {
    position: relative;
    background: #111827;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  #sc-qr-reader {
    width: 100% !important;
    border: none !important;
  }

  #sc-qr-reader video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }

  #sc-qr-reader img { display: none !important; }
  #sc-qr-reader > div:last-child { display: none !important; }

  .sc-scanner-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .sc-scan-frame {
    width: 200px;
    height: 200px;
    position: relative;
  }

  .sc-scan-frame::before,
  .sc-scan-frame::after {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    border-color: #ffffff;
    border-style: solid;
  }

  .sc-scan-frame::before {
    top: 0; left: 0;
    border-width: 3px 0 0 3px;
    border-radius: 4px 0 0 0;
  }

  .sc-scan-frame::after {
    bottom: 0; right: 0;
    border-width: 0 3px 3px 0;
    border-radius: 0 0 4px 0;
  }

  .sc-corner {
    position: absolute;
    width: 32px;
    height: 32px;
    border-color: #ffffff;
    border-style: solid;
  }

  .sc-corner.tr {
    top: 0; right: 0;
    border-width: 3px 3px 0 0;
    border-radius: 0 4px 0 0;
  }

  .sc-corner.bl {
    bottom: 0; left: 0;
    border-width: 0 0 3px 3px;
    border-radius: 0 0 0 4px;
  }

  .sc-scan-line {
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    animation: scanMove 2s ease-in-out infinite;
    top: 0;
  }

  @keyframes scanMove {
    0%   { top: 0%; opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  /* Scanner placeholder (before camera starts) */
  .sc-scanner-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: #6b7280;
    padding: 48px 20px;
  }

  .sc-cam-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: #1f2937;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .sc-placeholder-text {
    font-size: 13px;
    text-align: center;
    color: #6b7280;
  }

  /* ── Form Area ── */
  .sc-form-area {
    padding: 24px;
  }

  .sc-section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sc-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #f3f4f6;
  }

  .sc-field {
    margin-bottom: 14px;
  }

  .sc-field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
    letter-spacing: 0.02em;
  }

  .sc-input {
    width: 100%;
    background: #f9fafb;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    color: #111827;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .sc-input::placeholder { color: #d1d5db; }
  .sc-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); background: #fff; }
  .sc-input.filled { border-color: #10b981; background: #f0fdf4; color: #065f46; }
  .sc-input.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

  .sc-error-msg { font-size: 12px; color: #ef4444; margin-top: 5px; }

  /* Location strip */
  .sc-location-strip {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f9fafb;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 11px 14px;
    margin-bottom: 14px;
    font-size: 13px;
    color: #6b7280;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .sc-location-strip:hover { border-color: #3b82f6; }
  .sc-location-strip.acquired { border-color: #10b981; background: #f0fdf4; color: #065f46; }
  .sc-location-strip.error-loc { border-color: #ef4444; background: #fef2f2; color: #b91c1c; }

  .loc-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    background: #d1d5db;
  }

  .loc-dot.on { background: #10b981; animation: pulse 1.5s infinite; }
  .loc-dot.err { background: #ef4444; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* Submit button */
  .sc-btn {
    width: 100%;
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Syne', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.15s, transform 0.1s;
    margin-top: 4px;
  }

  .sc-btn:hover { background: #1f2937; }
  .sc-btn:active { transform: scale(0.98); }
  .sc-btn:disabled { background: #d1d5db; cursor: not-allowed; transform: none; }

  .sc-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Camera toggle ── */
  .sc-cam-toggle {
    max-width: 520px;
    margin: 0 auto 16px;
    display: flex;
    gap: 10px;
  }

  .sc-toggle-btn {
    flex: 1;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: all 0.15s;
  }

  .sc-toggle-btn.active {
    background: #111827;
    border-color: #111827;
    color: #fff;
  }

  .sc-toggle-btn:hover:not(.active) { border-color: #9ca3af; color: #374151; }

  /* ── Success / Error Screen ── */
  .sc-result-screen {
    max-width: 520px;
    margin: 0 auto;
    background: #fff;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
    padding: 48px 32px;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .sc-result-icon {
    width: 72px; height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin: 0 auto 20px;
  }

  .sc-result-icon.success { background: #d1fae5; }
  .sc-result-icon.fail    { background: #fee2e2; }

  .sc-result-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .sc-result-title.success { color: #065f46; }
  .sc-result-title.fail    { color: #991b1b; }

  .sc-result-sub {
    font-size: 13.5px;
    color: #6b7280;
    margin-bottom: 28px;
    line-height: 1.6;
  }

  .sc-result-meta {
    background: #f9fafb;
    border-radius: 10px;
    padding: 14px 16px;
    text-align: left;
    margin-bottom: 24px;
  }

  .sc-meta-row {
    display: flex;
    justify-content: space-between;
    font-size: 12.5px;
    padding: 4px 0;
    color: #374151;
  }

  .sc-meta-label { color: #9ca3af; }

  .sc-btn-again {
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 12px 28px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Syne', sans-serif;
    cursor: pointer;
    transition: background 0.15s;
  }

  .sc-btn-again:hover { background: #1f2937; }

  /* Toast */
  .sc-toast-wrap {
    position: fixed;
    bottom: 24px; right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
  }

  .sc-toast {
    background: #111827;
    color: #f9fafb;
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: toastIn 0.25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    max-width: 300px;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .sc-toast-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

  @media (max-width: 540px) {
    .sc-result-screen { padding: 32px 20px; }
    .sc-form-area { padding: 18px; }
  }
`;

// ─── Distance Validation (scaffold — plug in session lat/lng when available) ──
const ALLOWED_RADIUS_M = 100;

const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * TODO: When sessions store lat/lng, fetch session location and validate:
 *
 * const sessionLat = session.latitude;
 * const sessionLng = session.longitude;
 * const distance = getDistanceMeters(studentLat, studentLng, sessionLat, sessionLng);
 * if (distance > ALLOWED_RADIUS_M) throw new Error("Too far from class location");
 */
const validateDistance = (/* studentLat, studentLng, sessionLat, sessionLng */) => {
  // Distance check scaffolded — enable when session location is available
  return true;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatTs = (ts) =>
  new Date(ts).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });

// ─── Toast ────────────────────────────────────────────────────────────────────
const ToastStack = ({ toasts }) => (
  <div className="sc-toast-wrap">
    {toasts.map((t) => (
      <div key={t.id} className="sc-toast">
        <div className="sc-toast-dot" style={{ background: t.color }} />
        {t.msg}
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const StudentCheckIn = () => {
  const [mode, setMode] = useState("manual"); // "manual" | "scan"
  const [sessionId, setSessionId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState(null);
  const [locStatus, setLocStatus] = useState("idle"); // idle | acquiring | acquired | error
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { success, sessionId, studentId, timestamp, coords }
  const [toasts, setToasts] = useState([]);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  const pushToast = (msg, color = "#10b981") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, color }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  // ── Auto-load Student ID ───────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          const sid = data.studentId || data.identifier || "";
          const name = data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : (data.name || "");
          setStudentId(sid);
          setStudentName(name);
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // ── Geolocation ────────────────────────────────────────────────────────────
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus("error");
      pushToast("Geolocation not supported", "#ef4444");
      return;
    }
    setLocStatus("acquiring");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: Math.round(pos.coords.accuracy) });
        setLocStatus("acquired");
      },
      (err) => {
        setLocStatus("error");
        pushToast("Location access denied", "#ef4444");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    let scanner = null;
    let cancelled = false;

    const startScanner = async () => {
      if (mode !== "scan" || !scannerRef.current) return;
      
      // Small delay to ensure DOM element is ready
      await new Promise(r => setTimeout(r, 300));
      if (cancelled) return;

      try {
        scanner = new Html5Qrcode("sc-qr-reader");
        scannerInstanceRef.current = scanner;

        const config = {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.floor(minEdge * 0.7);
            return { width: size, height: size };
          }
        };

        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            setSessionId(decodedText);
            setMode("manual");
            pushToast("QR scanned — session ID captured", "#3b82f6");
          },
          () => {}
        );
        if (!cancelled) setScannerReady(true);
      } catch (err) {
        console.error("Scanner error:", err);
        if (!cancelled) {
          pushToast("Camera failed. Please enter ID manually.", "#ef4444");
          setMode("manual");
        }
      }
    };

    if (mode === "scan") {
      startScanner();
    }

    return () => {
      cancelled = true;
      if (scanner) {
        scanner.stop().catch(() => {});
      }
      setScannerReady(false);
    };
  }, [mode]);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!sessionId.trim()) e.sessionId = "Session ID is required";
    if (!studentId.trim()) e.studentId = "Student ID is required";
    if (locStatus !== "acquired") e.location = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleCheckIn = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      // 1. Fetch Session to get classId
      const sessionData = await getSession(sessionId.trim());
      if (!sessionData) throw new Error("Session no longer active or invalid.");
      if (!sessionData.isActive) throw new Error("This attendance session has already ended.");

      const classId = sessionData.classId;

      // 1.5 Fetch Class Details for Subject Name
      const classSnap = await get(ref(db, `classes/${classId}`));
      const classData = classSnap.exists() ? classSnap.val() : {};
      const subjectName = classData.subjectName || "Unknown Subject";

      // 2. Verify Enrollment
      const enrollRef = ref(db, `enrollments/${classId}/${studentId.trim()}`);
      const enrollSnap = await get(enrollRef);
      if (!enrollSnap.exists()) {
        throw new Error("You are not enrolled in this subject. Please enroll first.");
      }

      // 2.5 Check if already checked in
      const allAttendanceSnap = await get(ref(db, "attendance"));
      if (allAttendanceSnap.exists()) {
        const attendanceData = allAttendanceSnap.val();
        const alreadyCheckedIn = Object.values(attendanceData).some(
          (a) => a.sessionId === sessionId.trim() && a.studentId === studentId.trim()
        );
        if (alreadyCheckedIn) {
          throw new Error("You have already checked in for this session.");
        }
      }

      // 3. Distance validation scaffold
      validateDistance(/* location.lat, location.lng, sessionLat, sessionLng */);

      const attendanceId = Date.now().toString();
      const timestamp = Date.now();

      await markAttendance(attendanceId, {
        sessionId: sessionId.trim(),
        studentId: studentId.trim(),
        studentName: studentName, // Store name directly
        status: "pending",
        timestamp,
        // Geolocation saved to record (4.3)
        location: {
          latitude: location.lat,
          longitude: location.lng,
          accuracy: location.accuracy,
        },
      });

      setResult({
        success: true,
        subjectName,
        sessionId: sessionId.trim(),
        studentId: studentId.trim(),
        timestamp,
        coords: location,
      });

    } catch (err) {
      setResult({
        success: false,
        error: err.message || "Submission failed",
        sessionId: sessionId.trim(),
        studentId: studentId.trim(),
        timestamp: Date.now(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSessionId("");
    setStudentId("");
    setLocation(null);
    setLocStatus("idle");
    setErrors({});
  };

  // ── Result Screen ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <>
        <style>{styles}</style>
        <div className="sc-root">
          <div className="sc-result-screen">
            <div className={`sc-result-icon ${result.success ? "success" : "fail"}`}>
              {result.success ? "✓" : "✕"}
            </div>
            <div className={`sc-result-title ${result.success ? "success" : "fail"}`}>
              {result.success ? "Attendance Recorded" : "Submission Failed"}
            </div>
            <div className="sc-result-sub">
              {result.success
                ? "Your attendance has been successfully submitted."
                : result.error}
            </div>

            {result.success && (
              <div className="sc-result-meta">
                <div className="sc-meta-row">
                  <span className="sc-meta-label">Subject</span>
                  <span>{result.subjectName}</span>
                </div>
                <div className="sc-meta-row">
                  <span className="sc-meta-label">Session ID</span>
                  <span>{result.sessionId}</span>
                </div>
                <div className="sc-meta-row">
                  <span className="sc-meta-label">Student ID</span>
                  <span>{result.studentId}</span>
                </div>
                <div className="sc-meta-row">
                  <span className="sc-meta-label">Time</span>
                  <span>{formatTs(result.timestamp)}</span>
                </div>
                {result.coords && (
                  <div className="sc-meta-row">
                    <span className="sc-meta-label">Location</span>
                    <span>{result.coords.lat.toFixed(4)}, {result.coords.lng.toFixed(4)}</span>
                  </div>
                )}
              </div>
            )}

            <button className="sc-btn-again" onClick={handleReset}>
              {result.success ? "Check In Again" : "Try Again"}
            </button>
          </div>
        </div>
        <ToastStack toasts={toasts} />
      </>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  const locLabel =
    locStatus === "idle"      ? "Tap to capture your location" :
    locStatus === "acquiring" ? "Acquiring location…" :
    locStatus === "acquired"  ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)} (±${location.accuracy}m)` :
                                "Location access failed — tap to retry";

  return (
    <>
      <Navbar />
      <style>{styles}</style>
      <div className="sc-root">

        {/* Header */}
        <div className="sc-header">
          <div className="sc-eyebrow">FlashAttend · Student</div>
          <h1 className="sc-title">Attendance Check-In</h1>
          <p className="sc-subtitle">Scan the QR code or enter your session ID manually.</p>
        </div>

        {/* Mode toggle */}
        <div className="sc-cam-toggle">
          <button
            className={`sc-toggle-btn ${mode === "manual" ? "active" : ""}`}
            onClick={() => setMode("manual")}
          >
            ✎ Manual Entry
          </button>
          <button
            className={`sc-toggle-btn ${mode === "scan" ? "active" : ""}`}
            onClick={() => setMode("scan")}
          >
            ◈ Scan QR Code
          </button>
        </div>

        <div className="sc-card">
          {/* Scanner */}
          {mode === "scan" && (
            <div className="sc-scanner-wrap">
              <div id="sc-qr-reader" ref={scannerRef} style={{ width: "100%" }} />
              {!scannerReady && (
                <div className="sc-scanner-placeholder" style={{ position: "absolute", inset: 0, background: "#111827" }}>
                  <div className="sc-cam-icon">◈</div>
                  <div className="sc-placeholder-text">Starting camera…</div>
                </div>
              )}
              {scannerReady && (
                <div className="sc-scanner-overlay">
                  <div className="sc-scan-frame">
                    <div className="sc-corner tr" />
                    <div className="sc-corner bl" />
                    <div className="sc-scan-line" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <div className="sc-form-area">
            <div className="sc-section-label">Check-In Details</div>

            <div className="sc-field">
              <label>Session ID {mode === "scan" && sessionId && "✓"}</label>
              <input
                className={`sc-input ${sessionId ? "filled" : ""} ${errors.sessionId ? "error" : ""}`}
                placeholder="Enter or scan session ID"
                value={sessionId}
                onChange={(e) => { setSessionId(e.target.value); setErrors((x) => ({ ...x, sessionId: "" })); }}
              />
              {errors.sessionId && <div className="sc-error-msg">{errors.sessionId}</div>}
            </div>

            <div className="sc-field">
              <label>Student ID</label>
              <input
                className={`sc-input ${studentId ? "filled" : ""} ${errors.studentId ? "error" : ""}`}
                placeholder="Student ID auto-loaded"
                value={studentId}
                readOnly
                disabled
              />
              {errors.studentId && <div className="sc-error-msg">{errors.studentId}</div>}
              <small className="text-muted mt-1 d-block">ID is linked to your account</small>
            </div>

            {/* Location (4.2 + 4.3) */}
            <div
              className={`sc-location-strip ${locStatus === "acquired" ? "acquired" : locStatus === "error" ? "error-loc" : ""}`}
              onClick={locStatus !== "acquired" ? requestLocation : undefined}
              style={{ cursor: locStatus === "acquired" ? "default" : "pointer" }}
            >
              <div className={`loc-dot ${locStatus === "acquired" ? "on" : locStatus === "error" ? "err" : ""}`} />
              <span style={{ flex: 1, fontSize: 13 }}>{locLabel}</span>
              {locStatus === "acquiring" && <div className="sc-spinner" style={{ borderTopColor: "#3b82f6", borderColor: "rgba(59,130,246,0.2)" }} />}
            </div>
            {errors.location && <div className="sc-error-msg" style={{ marginTop: -8, marginBottom: 10 }}>{errors.location}</div>}

            <button className="sc-btn" onClick={handleCheckIn} disabled={submitting}>
              {submitting ? <><div className="sc-spinner" /> Submitting…</> : "Submit Attendance"}
            </button>
          </div>
        </div>

      </div>
      <ToastStack toasts={toasts} />
    </>
  );
};

export default StudentCheckIn;