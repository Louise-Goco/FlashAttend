// frontend/src/components/FacultyNavbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, BookOpen, Home, User, ClipboardList, Shield } from 'lucide-react';
import { auth } from '../firebase/auth';
import { signOut } from 'firebase/auth';
import { getUserData } from '../firebase/userManagement';

const FacultyNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const data = await getUserData(auth.currentUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching faculty data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active fw-bold' : '';
  };

  const isAdmin = userData?.role === 'Admin';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#4f46e5' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/faculty">
          <BookOpen size={24} />
          <span>FlashAttend</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#facultyNavbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="facultyNavbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-4">
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-1 ${isActive('/faculty')}`} to="/faculty">
                <Home size={18} /> Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-1 ${isActive('/attendance')}`} to="/attendance">
                <ClipboardList size={18} /> Attendance
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link className={`nav-link d-flex align-items-center gap-1 ${isActive('/admin')}`} to="/admin">
                  <Shield size={18} /> Admin Panel
                </Link>
              </li>
            )}
            
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-1 ${isActive('/dashboard/profile')}`} to="/dashboard/profile">
                <User size={18} /> Profile
              </Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-white text-indigo rounded-pill px-3 py-2" style={{ color: '#4f46e5' }}>
              {userData?.role || 'Faculty'}
            </span>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FacultyNavbar;
