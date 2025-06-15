import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Profile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('Authorization token missing. Please login again.');
        setLoading(false);
        return;
      }
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setError('Failed to fetch user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const styles = {
    globalFont: { fontFamily: 'Inter, sans-serif' },
    label: { fontWeight: 600, color: '#212529' },
    value: { marginLeft: '8px', color: '#495057' },
    card: {
      maxWidth: '600px',
      width: '100%',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      animation: 'fadeInUp 0.6s ease-in-out'
    },
    fadeInStyle: `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
  };

  return (
    <div style={styles.globalFont}>
      <style>{styles.fadeInStyle}</style>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Student Portal</span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container my-5">
        <h2 className="text-center mb-4">Your Profile</h2>

        {loading && <div className="alert alert-info">Loading your profile...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

{userProfile && (
  <>
    <ul className="nav nav-tabs mb-3" id="profileTabs" role="tablist">
      <li className="nav-item">
        <button className="nav-link active" id="details-tab" data-bs-toggle="tab" data-bs-target="#details" type="button">
          Details
        </button>
      </li>
      <li className="nav-item">
        <button className="nav-link" id="internships-tab" data-bs-toggle="tab" data-bs-target="#internships" type="button">
          Internships
        </button>
      </li>
      <li className="nav-item">
        <button className="nav-link" id="feedbacks-tab" data-bs-toggle="tab" data-bs-target="#feedbacks" type="button">
          Feedback
        </button>
      </li>
    </ul>

    <div className="tab-content" id="profileTabsContent">
      <div className="tab-pane fade show active" id="details">
        <div className="d-flex justify-content-center">
          <div style={styles.card}>
            <h5 className="text-center mb-3">👤 Student Details</h5>
            {[
              { label: "Name", value: userProfile.student ? userProfile.student.name : userProfile.user.name },
              { label: "Roll No", value: userProfile.student ? (userProfile.student.rollNumber || userProfile.user.rollNo) : userProfile.user.rollNo },
              { label: "Email", value: userProfile.student ? userProfile.student.email : userProfile.user.email },
              { label: "Branch", value: userProfile.student ? userProfile.student.branch : userProfile.user.branch },
              { label: "Semester", value: userProfile.student ? userProfile.student.semester : userProfile.user.semester },
    
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: '0.75rem' }}>
                <span style={styles.label}>{item.label}:</span>
                <span style={styles.value}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

              <div className="tab-pane fade" id="internships">
                <div className="d-flex justify-content-center">
                  <div style={styles.card}>
                    <h5 className="text-center mb-3">🔖 Your Internships</h5>
{(userProfile.internships || []).length > 0 ? (
  <ul className="list-group list-group-flush">
    {(userProfile.internships || []).map((internship) => (
      <li key={internship._id || internship.internshipID} className="list-group-item">
        <strong>{internship.organizationName}</strong> - {internship.role}<br />
        <small>
          {new Date(internship.startingDate).toLocaleDateString()} to{" "}
          {new Date(internship.endingDate).toLocaleDateString()}
        </small>
      </li>
    ))}
  </ul>
) : (
  <p className="text-muted text-center">No internships found.</p>
)}
                  </div>
                </div>
              </div>

              <div className="tab-pane fade" id="feedbacks">
                <div className="d-flex justify-content-center">
                  <div style={styles.card}>
                    <h5 className="text-center mb-3">🗒 Your Feedback</h5>
{(userProfile.feedbacks || []).length > 0 ? (
  <ul className="list-group list-group-flush">
    {(userProfile.feedbacks || []).map((feedback) => (
      <li key={feedback._id} className="list-group-item">
        <strong>{feedback.title || "Feedback"}</strong> for <em>{feedback.organizationName || "Unknown Organization"}</em>: <strong>{"submitted "}</strong>
        {feedback.content || feedback.feedback}
      </li>
    ))}
  </ul>
) : (
  <p className="text-muted text-center">No feedbacks submitted.</p>
)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}