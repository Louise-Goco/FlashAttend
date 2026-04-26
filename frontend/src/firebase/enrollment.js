import { getDatabase, ref, set, get } from "firebase/database";
import { app } from "./config";

const db = getDatabase(app);

// Enroll student in class
export const enrollStudent = (classId, studentId) => {
  return set(ref(db, `enrollments/${classId}/${studentId}`), {
    studentId,
    classId,
    enrolledAt: Date.now()
  });
};

// Get enrolled students
export const getEnrolledStudents = async (classId) => {
  const snapshot = await get(ref(db, `enrollments/${classId}`));

  return snapshot.exists() ? snapshot.val() : {};
};