import { getDatabase, ref, set } from "firebase/database";
import { app } from "./config";

const db = getDatabase(app);

// Update: Now accepts 'uid' as a separate argument
export const saveUserData = (uid, userData) => {
  // Use 'uid' for the path so it matches your Security Rules
  return set(ref(db, "users/" + uid), {
    studentId: userData.studentId,
    firstName: userData.firstName,
    lastName: userData.lastName,
    gender: userData.gender,
    dob: userData.dob,
    email: userData.email,
    phone: userData.phone
    // Do NOT include password here; it's already handled by Auth
  });
};