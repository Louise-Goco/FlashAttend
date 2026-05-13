import { getDatabase, ref, set, get, update, remove, push } from "firebase/database";
import { app } from "./config";

const db = getDatabase(app);

export const createClass = async (classData) => {
  const classesRef = ref(db, "classes");
  const newClassRef = push(classesRef);
  await set(newClassRef, classData);
  return newClassRef.key;
};

export const getAllClasses = async () => {
  const classesRef = ref(db, "classes");
  const snapshot = await get(classesRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const updateClassData = async (classId, classData) => {
  const classRef = ref(db, `classes/${classId}`);
  return update(classRef, classData);
};

export const deleteClassData = async (classId) => {
  const classRef = ref(db, `classes/${classId}`);
  return remove(classRef);
};

export const findClassByCode = async (code) => {
  const allClasses = await getAllClasses();
  const searchCode = code.trim().toUpperCase();
  const found = Object.entries(allClasses).find(([id, data]) => {
    return (data.classCode || "").toUpperCase() === searchCode;
  });
  return found ? { id: found[0], ...found[1] } : null;
};
