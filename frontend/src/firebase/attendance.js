import { getDatabase, ref, set, get, update, remove, push, onValue } from "firebase/database";
import { app } from "./config";

const db = getDatabase(app);

// Create session (like saveUserData style: explicit ID path)
export const createAttendanceSession = (sessionId, sessionData) => {
  return set(ref(db, "sessions/" + sessionId), sessionData);
};

// Get single session
export const getSession = async (sessionId) => {
  const sessionRef = ref(db, `sessions/${sessionId}`);
  const snapshot = await get(sessionRef);

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error("No session found");
  }
};

// Update session (activate / deactivate / etc.)
export const updateSession = async (sessionId, sessionData) => {
  const sessionRef = ref(db, `sessions/${sessionId}`);
  return update(sessionRef, sessionData);
};

// Delete session
export const deleteSession = async (sessionId) => {
  const sessionRef = ref(db, `sessions/${sessionId}`);
  return remove(sessionRef);
};


// Mark attendance (student check-in)
export const markAttendance = (attendanceId, attendanceData) => {
  return set(ref(db, "attendance/" + attendanceId), {
    ...attendanceData,
    status: attendanceData.status || "pending",
    timestamp: Date.now()
  });
};

// Get all attendance records
export const getAllAttendance = async () => {
  const attendanceRef = ref(db, "attendance");
  const snapshot = await get(attendanceRef);

  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

// Update attendance (approve/reject/manual override)
export const updateAttendance = async (attendanceId, data) => {
  const attendanceRef = ref(db, `attendance/${attendanceId}`);
  return update(attendanceRef, data);
};

// Delete attendance record
export const deleteAttendance = async (attendanceId) => {
  const attendanceRef = ref(db, `attendance/${attendanceId}`);
  return remove(attendanceRef);
};


export const listenToAttendanceBySession = (sessionId, callback) => {
  const attendanceRef = ref(db, "attendance");

  onValue(attendanceRef, (snapshot) => {
    const data = snapshot.val() || {};

    const filtered = Object.entries(data)
      .filter(([_, value]) => value.sessionId === sessionId)
      .map(([id, value]) => ({
        id,
        ...value,
      }));

    callback(filtered);
  });
};