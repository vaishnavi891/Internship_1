// src/pages/Feedbacks.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './Feedbacks.css';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/feedbacks');
        // Ensure it's always an array
        setFeedbacks(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setFeedbacks([]);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="feedbacks-page">
      <h2>Student Feedbacks</h2>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Skills Learned</th>
            <th>Technical Skill</th>
            <th>Communication</th>
            <th>Teamwork</th>
            <th>Time Mgmt</th>
            <th>Overall Exp</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((f, index) => (
            <tr key={index}>
              <td>{f.rollNumber}</td>
              <td>{f.skillsLearned}</td>
              <td>{f.technicalSkill}</td>
              <td>{f.communicationSkill}</td>
              <td>{f.teamWork}</td>
              <td>{f.timeManagement}</td>
              <td>{f.overallExperience}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Feedbacks;
