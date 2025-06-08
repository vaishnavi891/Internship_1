import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllInternships } from '../services/Api';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const [userInternships, setUserInternships] = useState([]);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const data = await getAllInternships();
        if (userEmail) {
          const filtered = data.filter(i => i.email === userEmail);
          setUserInternships(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch internships:", error);
      }
    };

    fetchInternships();
    const intervalId = setInterval(fetchInternships, 1000);
    return () => clearInterval(intervalId);
  }, [userEmail]);

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
      </div>

      {/* 🟢 MAIN CONTENT */}
      <div className="main-content">
        <h2 className="subtitle">Welcome to the UG/PG Internship Portal</h2>

        <div className="options-grid">
          <div className="card">
            <h2>📄 Documents</h2>
            <div className="document-section">
              <a href="https://1drv.ms/w/c/2879c4145659eca3/ETHRdK_La15KigY-Go9GHy0BQu9tEzCa5KRZvMqh-UH6XQ?e=CIhyHU" download>
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
            <button onClick={() => navigate('/application')}>Fill Application Form</button>
          </div>

          { (
            <div className="card">
              <h2>📤 Submit Feedback</h2>
              <button onClick={() => navigate('/upload')}>Upload Feedback Form</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
