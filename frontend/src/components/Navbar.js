// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, BookOpen, Home, User } from 'lucide-react';
import { auth } from '../firebase/auth';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optional: Navigate to a login page later, for now just to home
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active fw-bold' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#0d6efd' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <BookOpen size={24} />
          <span>FlashAttend</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-4">
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-1 ${isActive('/')}`} to="/">
                <Home size={18} /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-1 ${isActive('/course')}`} to="/course">
                <BookOpen size={18} /> Courses
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-1 ${isActive('/profile')}`} to="/profile">
                <User size={18} /> Profile
              </Link>
            </li>
          </ul>
          
          <div className="d-flex">
            <button 
              onClick={handleLogout} 
              className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
