import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Internships.css";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    semester: "",
    section: "",
    year: "",
    month: "",
    endMonth: "",
    endYear: "",
    company: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const convertDriveLink = (url) => {
    if (!url) return null;
    const match = url.match(/[-\w]{25,}/);
    return match ? `https://drive.google.com/file/d/${match[0]}/view` : url;
  };

  const fetchInternships = async () => {
    try {
      const query = Object.entries(filters)
        .filter(([_, value]) => value !== "")
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const res = await axios.get(
        `http://localhost:5000/api/admin/internships/filter?${query}`
      );
      setInternships(res.data);
    } catch (error) {
      console.error("Error fetching internships:", error);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    fetchInternships();
  };

  const handleClear = () => {
    setFilters({
      type: "",
      semester: "",
      section: "",
      year: "",
      month: "",
      endMonth: "",
      endYear: "",
      company: "",
    });
    fetchInternships();
  };

  const renderStatusBadge = (status) => {
    const statusMap = {
      ongoing: "badge-green",
      past: "badge-red",
      future: "badge-blue",
    };
    return (
      <span className={`badge ${statusMap[status] || "badge-gray"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container">
      <h1 className="title">Internships</h1>

      <button className="toggle-btn" onClick={toggleFilters}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {showFilters && (
        <div className="filter-card">
          <h2 className="filter-title">Filter Internships</h2>
          <div className="filters-grid">
            {[
              ["Company", "company"],
              ["Status", "type", ["", "ongoing", "past", "future"]],
              ["Semester", "semester", ["", "II-I", "II-II", "III-I", "III-II", "IV-I", "IV-II"]],
              ["Section", "section", ["", "A", "B", "C", "D"]],
              ["Start Year", "year", ["", 2023, 2024, 2025, 2026]],
              ["Start Month", "month", ["", ...Array.from({ length: 12 }, (_, i) => i + 1)]],
              ["End Month", "endMonth", ["", ...Array.from({ length: 12 }, (_, i) => i + 1)]],
              ["End Year", "endYear", ["", 2023, 2024, 2025, 2026]],
            ].map(([label, name, options]) => (
              <div className="form-group" key={name}>
                <label>{label}</label>
                {options ? (
                  <select name={name} value={filters[name]} onChange={handleChange}>
                    {options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt || `All ${label}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input type="text" name={name} value={filters[name]} onChange={handleChange} />
                )}
              </div>
            ))}

            <div className="form-group full">
              <button className="btn primary" onClick={handleFilter}>
                Apply Filter
              </button>
              <button className="btn secondary" onClick={handleClear}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Organization</th>
                <th>Role</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Documents</th>
              </tr>
            </thead>
            <tbody>
              {internships.length > 0 ? (
                internships.map((i) => (
                  <tr key={i._id}>
                    <td>{i.rollNumber}</td>
                    <td>{i.organizationName}</td>
                    <td>{i.role}</td>
                    <td>{new Date(i.startingDate).toLocaleDateString()}</td>
                    <td>{new Date(i.endingDate).toLocaleDateString()}</td>
                    <td>{renderStatusBadge(i.status)}</td>
                    <td>{i.semester || "-"}</td>
                    <td>{i.section || "-"}</td>
                    <td className="docs">
                      {i.applicationLetter && (
                        <a href={convertDriveLink(i.applicationLetter)} target="_blank" rel="noreferrer">
                          📄 Application
                        </a>
                      )}
                      {i.offerLetter && (
                        <a href={convertDriveLink(i.offerLetter)} target="_blank" rel="noreferrer">
                          📄 Offer
                        </a>
                      )}
                      {i.noc ? (
                        <a href={convertDriveLink(i.noc)} target="_blank" rel="noreferrer">
                          📄 NOC
                        </a>
                      ) : (
                        <span className="muted">NOC not uploaded</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="muted center">
                    No internships found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Internships;
