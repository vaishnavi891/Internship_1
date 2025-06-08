// src/components/DashboardStats.js
import React from "react";
import "./DashboardStats.css";

const DashboardStats = ({ stats }) => {
  const statItems = [
    { label: "Total Students", value: stats.totalStudents },
    { label: "Total Internships", value: stats.totalInternships },
    { label: "Total Feedbacks", value: stats.totalFeedbacks },
  ];

  return (
    <div className="row">
      {statItems.map((item, index) => (
        <div key={index} className="col-md-3 mb-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{item.label}</h5>
              <p className="card-text fs-4">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
