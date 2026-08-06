import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);

// Register
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 🔥 IMPORTANT: global auth listener
export const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};