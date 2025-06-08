// src/pages/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h2 className="mb-4">Welcome! Choose Login Type</h2>
      <div className="d-flex gap-4">
        <button className="btn btn-primary" onClick={() => navigate('/admin-login')}>
          Admin Login
        </button>
        <button className="btn btn-success" onClick={() => navigate('/student-login')}>
          Student Login
        </button>
      </div>
    </div>
  );
};

export default Landing;
