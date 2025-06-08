import React, { useEffect, useState } from "react";
import axios from "axios";

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
    });
    fetchInternships();
  };

  // Helper to render colored status badge
  const renderStatusBadge = (status) => {
    let color = "secondary";
    if (status === "ongoing") color = "success";
    else if (status === "past") color = "danger";
    else if (status === "future") color = "info";

    return (
      <span className={`badge border border-${color} text-${color} text-capitalize`}>{status}</span>
    );
  };

  return (
    <div className="container-fluid mt-5">
      <h1 className="text-center mb-4 fw-bold border-bottom pb-2">Internships</h1>

      <h5 className="card-title mb-3 fw-semibold cursor-pointer" onClick={toggleFilters}>
        <button className="btn btn-outline-dark">{showFilters ? 'Hide Filters' : 'Show Filters'}</button>
      </h5>
      {/* Filter Panel */}
      {showFilters && (
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <h5 className="card-title mb-3 fw-semibold">Filter Internships</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Company</label>
              <input
                type="text"
                className="form-control"
                name="company"
                onChange={handleChange}
                value={filters.company}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="type"
                onChange={handleChange}
                value={filters.type}
              >
                <option value="">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="past">Past</option>
                <option value="future">Upcoming</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Semester</label>
              <select
                className="form-select"
                name="semester"
                onChange={handleChange}
                value={filters.semester}
              >
                <option value="">All Semesters</option>
                <option value="II-I">2-1</option>
                <option value="II-II">2-2</option>
                <option value="III-I">3-1</option>
                <option value="III-II">3-2</option>
                <option value="IV-I">4-1</option>
                <option value="IV-II">4-2</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Section</label>
              <select
                className="form-select"
                name="section"
                onChange={handleChange}
                value={filters.section}
              >
                <option value="">All Sections</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Start Year</label>
              <select
                className="form-select"
                name="year"
                onChange={handleChange}
                value={filters.year}
              >
                <option value="">All Years</option>
                {[2023, 2024, 2025, 2026].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Start Month</label>
              <select
                className="form-select"
                name="month"
                onChange={handleChange}
                value={filters.month}
              >
                <option value="">All Months</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">End Month</label>
              <select
                className="form-select"
                name="endMonth"
                onChange={handleChange}
                value={filters.endMonth}
              >
                <option value="">All Months</option>
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December",
                ].map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">End Year</label>
              <select
                className="form-select"
                name="endYear"
                onChange={handleChange}
                value={filters.endYear}
              >
                <option value="">All Years</option>
                {[2023, 2024, 2025, 2026].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-primary w-100" onClick={handleFilter}>
                Apply Filter
              </button>
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={handleClear}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
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
                {internships.map((i) => (
                  <tr key={i._id} className="fw-normal">
                    <td>{i.rollNumber}</td>
                    <td>{i.organizationName}</td>
                    <td>{i.role}</td>
                    <td>{new Date(i.startingDate).toLocaleDateString()}</td>
                    <td>{new Date(i.endingDate).toLocaleDateString()}</td>
                    <td>{renderStatusBadge(i.status)}</td>
                    <td>{i.semester || "-"}</td>
                    <td>{i.section || "-"}</td>
                    <td>
                    <div className="d-flex flex-column">
                      {i.applicationLetter && (
                        <a
                          href={convertDriveLink(i.applicationLetter)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary mb-1"
                        >
                          📄 Application
                        </a>
                      )}
                      {i.offerLetter && (
                        <a
                          href={convertDriveLink(i.offerLetter)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-success mb-1"
                        >
                          📄 Offer
                        </a>
                      )}
                      {i.noc ? (
                        <a
                          href={convertDriveLink(i.noc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-warning"
                        >
                          📄 NOC
                        </a>
                      ) : (
                        <span className="text-muted small">NOC not uploaded</span>
                      )}
                    </div>
                  </td>
                  </tr>
                ))}
                {internships.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No internships found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Internships;
