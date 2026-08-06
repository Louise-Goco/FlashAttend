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
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useEffect } from "react";

import { listenToAuthChanges } from "./firebase/auth";

// Placeholder component for Course till implemented
const Course = () => <div className="container py-5 text-center"><h1>Courses</h1><p className="text-muted">Manage your classes here</p></div>;

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
          <Route path="/faculty" element={<FacultyDashboard />} />
          
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<StudentDashboard />} />
            <Route path="course" element={<Course />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;