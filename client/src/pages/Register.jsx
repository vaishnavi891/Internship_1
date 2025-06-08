import { useState } from 'react';
import { registerUser } from '../services/Api';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({
    rollNo: '',
    name: '',
    email: '',
    branch: '',
    semester: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const cleanedEmail = form.email.toLowerCase().trim();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.rollNo || !form.name || !cleanedEmail || !form.branch || !form.semester || !form.password) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      await registerUser({
        ...form,
        email: cleanedEmail
      });
      alert('Registered successfully');
      setForm({
        rollNo: '',
        name: '',
        email: '',
        branch: '',
        semester: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="form-title">Student Registration</h2>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Registering...</div>}

        <input 
          name="rollNo" 
          placeholder="Roll No" 
          value={form.rollNo} 
          onChange={handleChange} 
          className="input-style" 
          disabled={loading}
        />
        <input 
          name="name" 
          placeholder="Name" 
          value={form.name} 
          onChange={handleChange} 
          className="input-style" 
          disabled={loading}
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={handleChange} 
          className="input-style" 
          disabled={loading}
        />
        <input
          name="branch"
          placeholder="Branch"
          value={form.branch}
          onChange={handleChange}
          className="input-style"
          disabled={loading}
        />
        <input
          name="semester"
          placeholder="Semester"
          value={form.semester}
          onChange={handleChange}
          className="input-style"
          disabled={loading}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={form.password} 
          onChange={handleChange} 
          className="input-style" 
          disabled={loading}
        />
        <input 
          name="confirmPassword" 
          type="password" 
          placeholder="Confirm Password" 
          value={form.confirmPassword} 
          onChange={handleChange} 
          className="input-style" 
          disabled={loading}
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
