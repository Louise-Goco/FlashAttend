import { getDatabase, ref, set, get, update } from "firebase/database";
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

export const getUserData = async (uid) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error("No user data available");
  }
};

export const updateUserData = async (uid, userData) => {
  const userRef = ref(db, `users/${uid}`);
  return update(userRef, userData);
};