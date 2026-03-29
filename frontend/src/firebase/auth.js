// frontend/src/firebase/auth.js
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./config";

const auth = getAuth();

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};