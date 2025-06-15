import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/Api';

export default function Register() {
  const [form, setForm] = useState({
    rollNo: '',
    name: '',
    email: '',
    branch: '',
    semester: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const semesterOptions = ['1-1', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const cleanedEmail = form.email.toLowerCase().trim();

    if (!cleanedEmail.endsWith('@vnrvjiet.in')) {
      setError('Email must end with @vnrvjiet.in');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (
      !form.rollNo ||
      !form.name ||
      !cleanedEmail ||
      !form.branch ||
      !form.semester ||
      !form.password
    ) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await registerUser({
        ...form,
        email: cleanedEmail,
      });
      alert('Registered successfully');
      setForm({
        rollNo: '',
        name: '',
        email: '',
        branch: '',
        semester: '',
        password: '',
        confirmPassword: '',
      });
      navigate('/student-login');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Header */}
      <div className="header d-flex align-items-center p-3 mb-4">
        <img
          src="https://media.licdn.com/dms/image/v2/C560BAQFKt8O5GdaFjw/company-logo_200_200/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=nV3OFiSPyeDZdeZib-pHBlNwN-i1S73KwQljcRw3FvY"
          alt="VNR Vignana Jyothi Logo"
          style={{ width: '80px', height: '80px', marginRight: '15px' }}
        />
        <h1 className="mb-0">VNR Vignana Jyothi Institute of Engineering and Technology</h1>
      </div>

      {/* Registration Form */}
      <div className="register-container d-flex justify-content-center align-items-center vh-100">
        <form onSubmit={handleSubmit} className="register-form shadow-lg p-4 bg-white rounded">
          <h2 className="form-title mb-4 text-center">Student Registration</h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="loading-message mb-3">Registering...</div>}

          <input
            name="rollNo"
            placeholder="Roll No"
            value={form.rollNo}
            onChange={handleChange}
            className="form-control mb-3"
            disabled={loading}
          />
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="form-control mb-3"
            disabled={loading}
          />
          <input
            name="email"
            type="email"
            placeholder="Email (must end with @vnrvjiet.in)"
            value={form.email}
            onChange={handleChange}
            className="form-control mb-3"
            disabled={loading}
          />
          <input
            name="branch"
            placeholder="Branch"
            value={form.branch}
            onChange={handleChange}
            className="form-control mb-3"
            disabled={loading}
          />

          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            className="form-control mb-3"
            disabled={loading}
          >
            <option value="">Select Semester</option>
            {semesterOptions.map((sem, idx) => (
              <option key={idx} value={sem}>
                {sem}
              </option>
            ))}
          </select>

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="form-control mb-3"
            disabled={loading}
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="form-control mb-3"
            disabled={loading}
          />

          <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div className="text-center">
            <p>
              Already have an account? <Link to="/student-login">Login here</Link>
            </p>
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

        .register-page {
          min-height: 100vh;
          padding-top: 120px;
        }

        .register-container {
          padding: 20px;
        }

        .register-form {
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
