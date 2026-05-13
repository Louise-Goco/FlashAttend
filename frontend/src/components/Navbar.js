// frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import StudentNavbar from './StudentNavbar';
import FacultyNavbar from './FacultyNavbar';
import { auth } from '../firebase/auth';
import { getUserData } from '../firebase/userManagement';

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async (user) => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data in Navbar switcher:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      fetchUserRole(user);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // Return a simple placeholder or nothing while loading
    return <div style={{ height: '56px', backgroundColor: '#0d6efd' }}></div>;
  }

  const role = userData?.role || 'Student';

  if (role === 'Faculty' || role === 'Admin') {
    return <FacultyNavbar />;
  }

  return <StudentNavbar />;
};

export default Navbar;
