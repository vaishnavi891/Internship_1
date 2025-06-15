import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login_ad() {
  const [adminID, setAdminID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/login/${adminID}/${password}`);

      localStorage.setItem('token', res.data.token);
      alert('Login successful');
      navigate('/admin'); // Redirect to admin dashboard
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <div className="header d-flex align-items-center p-3 mb-4">
        <img
          src="https://media.licdn.com/dms/image/v2/C560BAQFKt8O5GdaFjw/company-logo_200_200/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=nV3OFiSPyeDZdeZib-pHBlNwN-i1S73KwQljcRw3FvY"
          alt="VNR Vignana Jyothi Logo"
          style={{ width: '80px', height: '80px', marginRight: '15px' }}
        />
        <h1 className="mb-0">VNR Vignana Jyothi Institute of Engineering and Technology</h1>
      </div>

      {/* Admin Login Form */}
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow-lg login-card">
          <h3 className="text-center mb-4">Admin Login</h3>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Admin ID</label>
              <input
                type="text"
                className="form-control"
                value={adminID}
                onChange={(e) => setAdminID(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Embedded CSS */}
      <style jsx="true">{`
        .header {

          border-bottom: 2px solid #ccc;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: fixed;
          width: 100%;
          top: 0;
          left: 0;
          z-index: 1000;
        }

        .login-page {
          min-height: 100vh;
          padding-top: 120px;
        }

        .login-card {
          max-width: 400px;
          width: 100%;
          background: #fff;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

export default Login_ad;
