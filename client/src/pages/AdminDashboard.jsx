// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/Api';
import DashboardStats from '../components/DashboardStats';
import './Pages.css';
import './Admin.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInternships: 0,
    totalFeedbacks: 0,
    pendingInternships: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const fetchedStats = await getDashboardStats();
        setStats(fetchedStats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mt-5 ">
      <div className="d-flex align-items-center mb-4 p-3">
        <img
          src="https://media.licdn.com/dms/image/v2/C560BAQFKt8O5GdaFjw/company-logo_200_200/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=nV3OFiSPyeDZdeZib-pHBlNwN-i1S73KwQljcRw3FvY"
          alt="VNR Vignana Jyothi Logo"
          style={{ width: '60px', height: '60px', marginRight: '15px' }}
        />
        <h1 className="mb-0">VNR Vignana Jyothi Institute of Engineering and Technology</h1>
      </div>
      <h3 className='my-4'>Admin Dashboard</h3>
      <DashboardStats stats={stats} />
    </div>
  );
  
};

export default AdminDashboard;
