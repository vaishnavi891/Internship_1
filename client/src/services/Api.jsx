import axios from 'axios';

// 👇 Update the backend port here
const BASE_URL = 'http://localhost:5000';

// Route-specific base URLs
const INTERNSHIP_BASE_URL = `${BASE_URL}/api/internships`;
const ADMIN_BASE_URL = `${BASE_URL}/api/admin`;
const AUTH_BASE_URL = `${BASE_URL}/auth`;

/* 📊 Admin-related APIs */
export const getDashboardStats = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/dashboard-stats`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

/* 🎓 Internship-related APIs */
export const getAllInternships = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/internships`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateInternshipStatus = async (id, status) => {
  try {
    const res = await axios.patch(`${INTERNSHIP_BASE_URL}/${id}/status`, { status });
    return res.data;
  } catch (err) {
    throw err;
  }
};

/* ===========================
   🔐 Authentication APIs
=========================== */
export const registerUser = async (form) => {
  try {
    const { rollNo, name, email, branch, semester, password } = form;
    const res = await axios.post(`${AUTH_BASE_URL}/register`, {
      rollNo, name, email, branch, semester, password
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${AUTH_BASE_URL}/login`, credentials);
    return res.data;
  } catch (err) {
    throw err;
  }
};
