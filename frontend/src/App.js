// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';

// Placeholder components for Home and Course till implemented
const Home = () => <div className="p-5 text-center"><h1>Home</h1><p className="text-muted">Welcome to FlashAttend</p></div>;
const Course = () => <div className="p-5 text-center"><h1>Courses</h1><p className="text-muted">Manage your classes here</p></div>;

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light pb-5">
        <Navbar />
        <div className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course" element={<Course />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;