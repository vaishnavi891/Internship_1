import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InternshipForm.css";

function InternshipForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    branch: "",
    semester: "",
    section: "",
    email: "",
    mobile: "",
    role: "",
    organization: "",
    hrEmail: "",
    hrMobile: "",
    duration: "",
    pay: "",
    startDate: "",
    endDate: ""
  });

  const [offerFile, setOfferFile] = useState(null);
  const [approvalFile, setApprovalFile] = useState(null);
  const [nocFile, setNocFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract numeric part of duration if it contains text
    let durationValue = formData.duration;
    if (typeof durationValue === 'string') {
      const match = durationValue.match(/\d+/);
      durationValue = match ? match[0] : '';
    }

    const form = new FormData();
    for (const key in formData) {
      if (key === 'duration') {
        form.append(key, durationValue);
      } else {
        form.append(key, formData[key]);
      }
    }
    if (offerFile) form.append("offerLetter", offerFile);
    if (approvalFile) form.append("applicationLetter", approvalFile);
    if (nocFile) form.append("noc", nocFile);

    try {
      const res = await fetch("http://localhost:5000/api/internships/submit", {
        method: "POST",
        body: form
      });

      if (res.ok) {
        alert("Internship details submitted successfully!");
        navigate("/students");
      } else {
        const errorData = await res.json();
        alert("Submission failed: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred.");
    }
  };

  return (
    <>
      <div className="header">
        <img
          src="https://media.licdn.com/dms/image/v2/C560BAQFKt8O5GdaFjw/company-logo_200_200/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=nV3OFiSPyeDZdeZib-pHBlNwN-i1S73KwQljcRw3FvY"
          alt="VNR Vignana Jyothi Logo"
          style={{ width: '60px', height: '60px', marginRight: '15px' }}
        />
        <h1 className="mb-0">VNR Vignana Jyothi Institute of Engineering and Technology</h1>
      </div>
      <button className="back-btn" onClick={() => navigate('/student-login')}>
        ⬅ Back to Home
      </button>
      <div className="form-container">
        <h1>UG/PG Internship Portal</h1>
        <form className="internship-form" onSubmit={handleSubmit}>
          {["rollNo", "name", "branch", "semester", "section", "email", "mobile", "role", "organization", "hrEmail", "hrMobile", "duration", "pay"].map((field) => (
            <div className="form-row" key={field}>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-row">
            <label>Start-Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>End-Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>
              Upload Offer Letter:
              <input type="file" accept=".pdf" onChange={(e) => setOfferFile(e.target.files[0])} />
            </label>
          </div>
          <div className="form-row">
            <label>
              Upload Approval Letter:
              <input type="file" accept=".pdf" onChange={(e) => setApprovalFile(e.target.files[0])} />
            </label>
          </div>
          <div className="form-row">
            <label>
              Upload NOC:
              <input type="file" accept=".pdf" onChange={(e) => setNocFile(e.target.files[0])} />
            </label>
          </div>

          <div className="submit-container">
            <button type="submit" className="submit-btn">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default InternshipForm;
