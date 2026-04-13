import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
