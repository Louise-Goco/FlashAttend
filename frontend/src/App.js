import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import AttendanceManagement from "./pages/AttendanceManagement";
import ClassEnrollment from "./pages/ClassEnrollment";
import StudentCheckIn from "./pages/StudentCheckIn";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useEffect } from "react";

import { listenToAuthChanges } from "./firebase/auth";

// Placeholder components for Home and Course till implemented
const Home = () => <div className="p-5 text-center"><h1>Home</h1><p className="text-muted">Welcome to FlashAttend</p></div>;
const Course = () => <div className="p-5 text-center"><h1>Courses</h1><p className="text-muted">Manage your classes here</p></div>;

function App() {
    useEffect(() => {
    console.log("APP IS RUNNING");
    
    listenToAuthChanges((user) => {
    console.log("AUTH STATE:", user);
    });
  }, []);
  return (
    <Router>
      <div className="min-vh-100 bg-light pb-5">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="/attendance" element={<AttendanceManagement />} />
          <Route path="/enrollment" element={<ClassEnrollment />} />
          <Route path="/checkin" element={<StudentCheckIn />} />
          
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="course" element={<Course />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;