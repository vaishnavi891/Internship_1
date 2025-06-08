const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const Feedback = require('../models/Feedback');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Basic test route for admin
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json({ message: "admin", payload: admins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filter internships with query params including company acronym matching
router.get('/internships/filter', async (req, res) => {
  const { type, semester, section, year, month, company } = req.query;
  const today = new Date();

  const matchesAcronym = (query, name) => {
    const acronym = name
      .split(/\s+/)
      .map(word => word[0].toUpperCase())
      .join('');
    return acronym.includes(query.toUpperCase());
  };

  try {
    // Date filtering
    let dateQuery = {};
    if (type === 'ongoing') {
      dateQuery = { startingDate: { $lte: today }, endingDate: { $gte: today } };
    } else if (type === 'past') {
      dateQuery = { endingDate: { $lt: today } };
    } else if (type === 'future') {
      dateQuery = { startingDate: { $gt: today } };
    }

    let internships = await Internship.find(dateQuery);

    if (year) {
      internships = internships.filter(i => new Date(i.startingDate).getFullYear().toString() === year);
    }

    if (month) {
      internships = internships.filter(i => (new Date(i.startingDate).getMonth() + 1).toString() === month);
    }

    if (company) {
      internships = internships.filter(i => {
        const regex = new RegExp(company, 'i');
        return regex.test(i.organizationName) || matchesAcronym(company, i.organizationName);
      });
    }

    // Find matching students by section & semester
    const studentQuery = {};
    if (section) studentQuery.section = section;
    if (semester) studentQuery.semester = semester;

    const students = await Student.find(studentQuery);
    const studentMap = {};
    students.forEach(s => { studentMap[s.rollNumber] = s; });

    // Filter internships that have a matching student
    const filteredInternships = internships
      .filter(i => studentMap[i.rollNumber])
      .map(i => {
        const start = new Date(i.startingDate);
        const end = new Date(i.endingDate);
        let status = "";

        if (today < start) status = "future";
        else if (today > end) status = "past";
        else status = "ongoing";

        return {
          ...i.toObject(),
          status,
          semester: studentMap[i.rollNumber]?.semester || null,
          section: studentMap[i.rollNumber]?.section || null,
        };
      });

    res.json(filteredInternships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update internship status
router.patch('/internships/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Internship.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get students with optional semester and section filters
router.get('/students', async (req, res) => {
  try {
    const { semester, section } = req.query;
    let query = {};
    if (semester) query.semester = semester;
    if (section) query.section = section;

    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalInternships = await Internship.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();
    const pendingInternships = await Internship.countDocuments({ status: 'Pending' });

    res.json({
      totalStudents,
      totalInternships,
      totalFeedbacks,
      pendingInternships,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all internships
router.get('/internships', async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all feedbacks
// Get all feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // latest first
    res.json(feedbacks);
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Submit feedback with basic validation
router.post('/feedbacks', async (req, res) => {
  try {
    const {
      rollNumber,
      internshipID,
      skillsLearned,
      technicalSkill,
      communicationSkill,
      teamWork,
      timeManagement,
      overallExperience,
    } = req.body;

    // Basic validation
    if (
      !rollNumber ||
      !internshipID ||
      !skillsLearned ||
      !technicalSkill ||
      !communicationSkill ||
      !teamWork ||
      !timeManagement ||
      !overallExperience
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newFeedback = new Feedback({
      rollNumber,
      internshipID,
      skillsLearned,
      technicalSkill,
      communicationSkill,
      teamWork,
      timeManagement,
      overallExperience,
    });

    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Feedback submission error:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Analytics route: branch & semester counts for internships with optional filters
router.get('/analytics', async (req, res) => {
  try {
    const { status, year, month } = req.query;

    const internships = await Internship.find();
    const students = await Student.find();

    const studentMap = {};
    students.forEach((s) => { studentMap[s.rollNumber] = s; });

    const today = new Date();

    const filtered = internships.filter((i) => {
      const student = studentMap[i.rollNumber];
      if (!student) return false;

      const start = new Date(i.startingDate);
      const end = new Date(i.endingDate);

      let calculatedStatus = '';
      if (today < start) calculatedStatus = 'future';
      else if (today > end) calculatedStatus = 'past';
      else calculatedStatus = 'ongoing';

      if (status && status !== 'all' && status !== calculatedStatus) return false;
      if (year && start.getFullYear() !== parseInt(year)) return false;
      if (month && start.getMonth() + 1 !== parseInt(month)) return false;

      i.branch = student.branch;
      i.semester = student.semester;
      return true;
    });

    const branchCounts = {};
    const semesterCounts = {};

    filtered.forEach((item) => {
      const branch = item.branch || 'Unknown';
      const semester = item.semester || 'Unknown';

      branchCounts[branch] = (branchCounts[branch] || 0) + 1;
      semesterCounts[semester] = (semesterCounts[semester] || 0) + 1;
    });

    res.json({
      branchData: Object.entries(branchCounts).map(([branch, count]) => ({ branch, count })),
      semesterData: Object.entries(semesterCounts).map(([semester, count]) => ({ semester, count })),
    });
  } catch (err) {
    console.error('Analytics Fetch Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get student + their internships by roll number
router.get('/roll/:rollNumber', async (req, res) => {
  try {
    const rollNumber = req.params.rollNumber;

    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const internships = await Internship.find({ rollNumber });
    const today = new Date();

    const detailedInternships = internships.map((internship) => {
      const start = new Date(internship.startingDate);
      const end = new Date(internship.endingDate);

      let status = "";
      if (today < start) status = "future";
      else if (today > end) status = "past";
      else status = "ongoing";

      return {
        internshipID: internship.internshipID,
        organizationName: internship.organizationName,
        role: internship.role,
        startingDate: internship.startingDate,
        endingDate: internship.endingDate,
        status,
      };
    });

    res.json({
      student,
      internships: detailedInternships
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin login with JWT token generation
router.get('/login/:adminID/:password', async (req, res) => {
  const { adminID, password } = req.params;

  try {
    const admin = await Admin.findOne({ adminID });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // If you store hashed passwords, use bcrypt.compare here
    // For now, comparing plain text as per your example
    if (admin.password !== password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { adminID: admin.adminID, name: admin.name };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '2h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
