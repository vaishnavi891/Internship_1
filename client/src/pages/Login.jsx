import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/Api';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleLogin = async e => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password.');
      return;
    }

    console.log('Logging in with credentials:', credentials);

    setLoading(true);
    setError('');
    try {
      const cleanedEmail = credentials.email.toLowerCase().trim();
      const res = await loginUser({ email: cleanedEmail, password: credentials.password });
      console.log('Login response:', res);
      const { token, role, email } = res;

      alert('Login successful');
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('email', email);

      window.dispatchEvent(new Event('login'));

      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
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

      {/* Login Form */}
      <div className="login-container d-flex justify-content-center align-items-center vh-100">
        <form onSubmit={handleLogin} className="login-form shadow-lg p-4 bg-white rounded">
          <h2 className="form-title mb-4 text-center">Login</h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="loading-message mb-3">Logging in...</div>}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            className="form-control mb-3"
            disabled={loading}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="form-control mb-3"
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>
        </form>
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

        .login-container {
          padding: 20px;
        }

        .login-form {
          max-width: 400px;
          width: 100%;
        }

        .loading-message {
          text-align: center;
          color: #007bff;
        }
      `}</style>
    </div>
  );
}
