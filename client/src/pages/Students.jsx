import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Pages.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    semester: "",
    section: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:5000/api/admin/students?${query}`);
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openModal = async (rollNumber) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/roll/${rollNumber}`);
      setSelectedStudent(res.data);
      console.log(res.data)
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch student details:", err);
    }
  };

  return (
    <div className="page-container">
      <h2 className="section-title">All Students</h2>

      <div className="mb-4 d-flex flex-wrap align-items-center">
        <select
          name="semester"
          onChange={handleChange}
          value={filters.semester}
          className="form-select custom-select-responsive w-auto me-3 mb-2"
        >
          <option value="">Select Semester</option>
          <option value="I-I">1-1</option>
          <option value="I-II">1-2</option>
          <option value="II-I">2-1</option>
          <option value="II-II">2-2</option>
          <option value="III-I">3-1</option>
          <option value="III-II">3-2</option>
          <option value="IV-I">4-1</option>
          <option value="IV-II">4-2</option>
        </select>

        <select
          name="section"
          onChange={handleChange}
          value={filters.section}
          className="form-select custom-select-responsive w-auto mb-2"
        >
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Section</th>
            <th>Semester</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.rollNumber}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.section}</td>
              <td>{student.semester}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => openModal(student.rollNumber)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedStudent && (
  <div
    className="modal"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}
  >
    <div
      className="modal-content"
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto"
      }}
    >
      <h3>{selectedStudent.student.name}</h3>
      <p>Email: {selectedStudent.student.email}</p>
      <p>Phone: {selectedStudent.student.phoneNo}</p>
      <p>Roll No: {selectedStudent.student.rollNumber}</p>
      <p>Semester: {selectedStudent.student.semester}</p>
      <p>Course: {selectedStudent.student.course}</p>
      <p>Section: {selectedStudent.student.section}</p>

      <h4 className="mt-3">Internships:</h4>
      {selectedStudent.internships.length === 0 ? (
        <p>No internships found</p>
      ) : (
        <ul>
          {selectedStudent.internships.map((i, index) => (
            <li key={index}>
              <strong>{i.organizationName}</strong> - {i.role}<br />
              From {new Date(i.startingDate).toLocaleDateString()} to {new Date(i.endingDate).toLocaleDateString()}<br />
              Status: <strong>{i.status}</strong><br />
            </li>
          ))}
        </ul>
      )}

      <button className="btn btn-danger mt-3" onClick={() => setShowModal(false)}>
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Students;
