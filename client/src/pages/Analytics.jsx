import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const [branchData, setBranchData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  const fetchAnalytics = async (status = 'all', year = '', month = '') => {
    try {
      const res = await axios.get('/api/admin/analytics', {
        params: { status, year, month }
      });
      console.log('Analytics Data:', res.data);
      setBranchData(res.data.branchData);
      setSemesterData(res.data.semesterData);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics(statusFilter, yearFilter, monthFilter);
  }, [statusFilter, yearFilter, monthFilter]);

  return (
    <div className="analytics-container" style={{ padding: '1rem' }}>
      <h2>Internship Analytics</h2>

      {/* Filters */}
      <div className="d-flex mb-4">
        <select
          className="form-select me-2"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">Select Year</option>
          {[2023, 2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="">Select Month</option>
          {[
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 
            'August', 'September', 'October', 'November', 'December'
          ].map((month, i) => (
            <option key={i + 1} value={i + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <h3>Branch-wise Internships</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={branchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="branch" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Semester-wise Internships</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={semesterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="semester" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
