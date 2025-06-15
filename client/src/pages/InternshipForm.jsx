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

  const [errors, setErrors] = useState({});
  const [offerFile, setOfferFile] = useState(null);
  const [approvalFile, setApprovalFile] = useState(null);
  const [nocFile, setNocFile] = useState(null);

  const semesters = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedFormData = { ...formData, [name]: value };

    // If startDate or endDate changes, update duration accordingly
    if (name === "startDate" || name === "endDate") {
      const start = new Date(name === "startDate" ? value : formData.startDate);
      const end = new Date(name === "endDate" ? value : formData.endDate);
      if (start && end && start < end) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let duration = '';
        if (diffDays >= 30) {
          const months = Math.floor(diffDays / 30);
          const days = diffDays % 30;
          duration = months + ' month' + (months > 1 ? 's' : '');
          if (days > 0) {
            duration += ' ' + days + ' day' + (days > 1 ? 's' : '');
          }
        } else {
          duration = diffDays + ' day' + (diffDays > 1 ? 's' : '');
        }
        updatedFormData.duration = duration;
      } else {
        updatedFormData.duration = '';
      }
    }

    setFormData(updatedFormData);

    // Real-time validation
    if (name === "email" && !value.endsWith("@vnrvjiet.in")) {
      setErrors({ ...errors, email: "Email must end with @vnrvjiet.in" });
    } else if (name === "mobile" && !/^\d{10}$/.test(value)) {
      setErrors({ ...errors, mobile: "Mobile number must be exactly 10 digits" });
    } else if (name === "hrMobile" && !/^\d{10}$/.test(value)) {
      setErrors({ ...errors, hrMobile: "HR mobile number must be exactly 10 digits" });
    } else if (name === "hrEmail" && !/^\S+@\S+\.\S+$/.test(value)) {
      setErrors({ ...errors, hrEmail: "Enter a valid HR email address" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    for (const key in formData) {
      if (formData[key].trim() === "") {
        alert(`${key} is required.`);
        return false;
      }
    }
    if (!offerFile || !approvalFile || !nocFile) {
      alert("All files are required.");
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert("Start Date must be earlier than End Date.");
      return false;
    }
    if (!formData.email.endsWith("@vnrvjiet.in")) {
      alert("Email must end with @vnrvjiet.in");
      return false;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return false;
    }
    if (!/^\d{10}$/.test(formData.hrMobile)) {
      alert("HR Mobile number must be exactly 10 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    let durationValue = formData.duration;
    if (typeof durationValue === 'string') {
      const match = durationValue.match(/\d+/);
      durationValue = match ? match[0] : '';
    }

    const rollNo = formData.rollNo;

    // Rename files with rollNo and appropriate suffix
    const renamedOfferFile = offerFile ? new File([offerFile], `${rollNo}_offer.pdf`, { type: offerFile.type }) : null;
    const renamedApprovalFile = approvalFile ? new File([approvalFile], `${rollNo}_approval.pdf`, { type: approvalFile.type }) : null;
    const renamedNocFile = nocFile ? new File([nocFile], `${rollNo}_noc.pdf`, { type: nocFile.type }) : null;

    const form = new FormData();
    for (const key in formData) {
      if (key === 'duration') {
        form.append(key, durationValue);
      } else {
        form.append(key, formData[key]);
      }
    }
    if (renamedOfferFile) form.append("offerLetter", renamedOfferFile);
    if (renamedApprovalFile) form.append("applicationLetter", renamedApprovalFile);
    if (renamedNocFile) form.append("noc", renamedNocFile);

    try {
      const res = await fetch("http://localhost:5000/api/internships/submit", {
        method: "POST",
        body: form
      });

      if (res.ok) {
        alert("Internship details submitted successfully!");
        navigate("/home");
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
      <button className="back-btn" onClick={() => navigate('/home')}>
        ⬅ Back to Home
      </button>
      <div className="form-container">
        <h1>UG/PG Internship Portal</h1>
        <form className="internship-form" onSubmit={handleSubmit}>
          {["rollNo", "name", "branch", "section", "email", "mobile", "role", "organization", "hrEmail", "hrMobile", "duration", "pay"].map((field) => (
            <div className="form-row" key={field}>
              <input
                type={field === "email" || field === "hrEmail" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                required
              />
              {errors[field] && <span className="error">{errors[field]}</span>}
            </div>
          ))}

          <div className="form-row">
            <label>Semester</label>
            <select name="semester" value={formData.semester} onChange={handleChange} required>
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Start-Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>End-Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Upload Offer Letter:
              <input type="file" accept=".pdf" onChange={(e) => setOfferFile(e.target.files[0])} required />
            </label>
          </div>
          <div className="form-row">
            <label>Upload Approval Letter:
              <input type="file" accept=".pdf" onChange={(e) => setApprovalFile(e.target.files[0])} required />
            </label>
          </div>
          <div className="form-row">
            <label>Upload NOC:
              <input type="file" accept=".pdf" onChange={(e) => setNocFile(e.target.files[0])} required />
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
