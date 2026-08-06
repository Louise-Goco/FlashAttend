import { getDatabase, ref, set, get, update } from "firebase/database";
import { app } from "./config";

const db = getDatabase(app);

// Update: Now accepts 'uid' as a separate argument
export const saveUserData = (uid, userData) => {
  // Use 'uid' for the path so it matches your Security Rules
  return set(ref(db, "users/" + uid), userData);
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

export const getAllUsers = async () => {
  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const deleteUserData = async (uid) => {
  const userRef = ref(db, `users/${uid}`);
  return set(userRef, null);
};