import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);
      if (!token) {
        console.warn("No token found in localStorage");
        return;
      }
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const toggleProfile = () => {
    if (!showProfile) {
      fetchUserProfile();
    }
    setShowProfile(!showProfile);
  };

  return (
    <div className="homepage-container">
      
      {/* 🔵 HEADER SECTION */}
      <div className=" header d-flex align-items-center mb-4 p-3">
        <img
          src="https://media.licdn.com/dms/image/v2/C560BAQFKt8O5GdaFjw/company-logo_200_200/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=nV3OFiSPyeDZdeZib-pHBlNwN-i1S73KwQljcRw3FvY"
          alt="VNR Vignana Jyothi Logo"
          style={{ width: '80px', height: '80px', marginRight: '15px' }}
        />
        <h1 className="mb-0">VNR Vignana Jyothi Institute of Engineering and Technology</h1>
        <button className="logout-btn" onClick={handleLogout} style={{ marginLeft: 'auto' }}>
          Logout
        </button>
        <button className="profile-icon" onClick={() => navigate('/profile')} style={{ marginLeft: '10px' }}>
          👤
        </button>
      </div>

      {/* 🟢 MAIN CONTENT */}
      <div className="main-content">
        <h2 className="subtitle">Welcome to the UG/PG Internship Portal</h2>

        {/* {showProfile && userProfile ? (
          <>
            <section className="profile-section">
              <h3>Your Profile</h3>
              <p><strong>Name:</strong> {userProfile.student.name}</p>
              <p><strong>Roll No:</strong> {userProfile.student.rollNumber}</p>
              <p><strong>Email:</strong> {userProfile.student.email}</p>
              <p><strong>Branch:</strong> {userProfile.student.branch}</p>
              <p><strong>Semester:</strong> {userProfile.student.semester}</p>
              <p><strong>Section:</strong> {userProfile.student.section}</p>
            </section>

            <section className="internships-section">
              <h3>Your Internships</h3>
              {userProfile.internships.length > 0 ? (
                <ul>
                  {userProfile.internships.map((internship) => (
                    <li key={internship._id}>
                      <strong>{internship.organizationName}</strong> - {internship.role} ({new Date(internship.startingDate).toLocaleDateString()} to {new Date(internship.endingDate).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No internships found.</p>
              )}
            </section>

            <section className="feedbacks-section">
              <h3>Your Feedbacks</h3>
              {userProfile.feedbacks.length > 0 ? (
                <ul>
                  {userProfile.feedbacks.map((feedback) => (
                    <li key={feedback._id}>
                      <strong>{feedback.title || 'Feedback'}</strong>: {feedback.content || feedback.feedback}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No feedbacks submitted.</p>
              )}
            </section>
          </>
        ) : (
          showProfile ? <p>Loading your profile...</p> : null
        )} */}

        <div className="options-grid">
          <div className="card">
            <h2>📄 Documents</h2>
            <div className="document-section">
              <a href="https://1drv.ms/w/c/2879c4145659eca3/Eb8zShUuKh5DkSOYfKHjqmYBha4v2ZXP36wrE8jcg-SccA?e=4QXPb5" download>
                Letter of Recommendation Template
              </a>
            </div>
            <div className="document-section">
              <a href="https://1drv.ms/w/c/2879c4145659eca3/ETHRdK_La15KigY-Go9GHy0BQu9tEzCa5KRZvMqh-UH6XQ?e=CIhyHU" download>
                No Objection Certificate (NOC)
              </a>
            </div>
          </div>

          <div className="card">
            <h2>📝 Apply</h2>
            <button onClick={() => navigate('/apply')}>Fill Application Form</button>
          </div>

          <div className="card">
            <h2>📤 Submit Feedback</h2>
            <button onClick={() => navigate('/upload')}>Upload Feedback Form</button>
          </div>
        </div>
      </div>
    </div>
  );
}
