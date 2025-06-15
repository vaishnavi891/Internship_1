import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rollNumber: '',
    skillsLearned: '',
    technicalSkill: '',
    communicationSkill: '',
    teamWork: '',
    timeManagement: '',
    overallExperience: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch internship details to check end date
    try {
      const internshipRes = await fetch(`http://localhost:5000/api/admin/roll/${formData.rollNumber}`);
      if (!internshipRes.ok) {
        alert('Could not find internship details for this roll number.');
        return;
      }
      const internshipData = await internshipRes.json();
      const internships = internshipData.internships || [];
      if (internships.length === 0) {
        alert('No internship found for this roll number.');
        return;
      }
      const endingDate = new Date(internships[0].endingDate);
      const today = new Date();
      if (today < endingDate) {
        alert('Feedback can only be submitted after the internship ends.');
        return;
      }
    } catch (err) {
      console.error('Error fetching internship details:', err);
      alert('Error verifying internship end date.');
      return;
    }

    console.log('Submitting feedback with data:', formData);

    try {
      const response = await fetch('http://localhost:5000/api/admin/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Feedback submitted successfully!');
        setFormData({
          rollNumber: '',
          skillsLearned: '',
          technicalSkill: '',
          communicationSkill: '',
          teamWork: '',
          timeManagement: '',
          overallExperience: ''
        });
        navigate("/home");
      } else {
        const errorData = await response.json();
        alert('Submission failed: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      let errorMessage = 'An error occurred while submitting feedback.';
      try {
        const errorText = await error.text();
        errorMessage += ' Details: ' + errorText;
      } catch {}
      alert(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="border p-4 shadow rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Roll Number</label>
          <input
            type="text"
            name="rollNumber"
            className="form-control"
            value={formData.rollNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Skills Learned</label>
          <textarea
            name="skillsLearned"
            className="form-control"
            rows="3"
            value={formData.skillsLearned}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Technical Skill (1-10)</label>
            <input
              type="number"
              name="technicalSkill"
              className="form-control"
              value={formData.technicalSkill}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Communication Skill (1-10)</label>
            <input
              type="number"
              name="communicationSkill"
              className="form-control"
              value={formData.communicationSkill}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Teamwork (1-10)</label>
            <input
              type="number"
              name="teamWork"
              className="form-control"
              value={formData.teamWork}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Time Management (1-10)</label>
            <input
              type="number"
              name="timeManagement"
              className="form-control"
              value={formData.timeManagement}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Overall Experience</label>
          <textarea
            name="overallExperience"
            className="form-control"
            rows="3"
            value={formData.overallExperience}
            onChange={handleChange}
            required
          ></textarea>
        </div>
       <div className="text-center mt-3">
  <button type="submit" className="btn btn-success px-4 py-2" style={{ fontSize: "16px" }}>
    Submit Feedback
  </button>
</div>

      </form>
    </div>
  );
};

export default Upload;
