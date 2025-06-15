import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* 🔵 HEADER */}
      <div className="header d-flex align-items-center mb-4 p-3">
        <img
          src="https://media.licdn.com/dms/image/v2/C560BAQFKt8O5GdaFjw/company-logo_200_200/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=nV3OFiSPyeDZdeZib-pHBlNwN-i1S73KwQljcRw3FvY"
          alt="VNR Vignana Jyothi Logo"
          style={{ width: '80px', height: '80px', marginRight: '15px' }}
        />
        <h1 className="mb-0">VNR Vignana Jyothi Institute of Engineering and Technology</h1>
      </div>

      {/* 🟢 Landing Content */}
      <div className="overlay">
        <div className="landing-card">
          <h1>Welcome to VNR Internship Portal</h1>
          <p className="subtitle">Your first step towards real-world experience</p>
          <div className="button-group">
            <button className="login-btn admin" onClick={() => navigate('/admin-login')}>
              Admin Login
            </button>
            <button className="login-btn student" onClick={() => navigate('/student-login')}>
              Student Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
