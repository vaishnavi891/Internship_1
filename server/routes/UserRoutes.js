const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const Feedback = require('../models/Feedback');

// Middleware to verify JWT token
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key'; // Use process.env.JWT_SECRET in production

const verifyApiKey = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log("Authorization header:", authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("Authorization header missing or malformed");
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  console.log("Token received:", token);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
    const User = require('../models/User');
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("User not found for decoded userId");
      return res.status(403).json({ error: 'Invalid token user' });
    }

    const student = await Student.findOne({ email: user.email });
    if (!student) {
      console.log("Student profile not found for user email:", user.email);
      // Instead of returning 403, attach user profile to req and continue
      req.user = user;
      next();
      return;
    }

    req.student = student;
    next();
  } catch (err) {
    console.log("Token verification error:", err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// GET user profile
router.get('/profile', verifyApiKey, async (req, res) => {
  try {
    if (req.student) {
      const student = req.student;

      const internships = await Internship.find({ rollNumber: student.rollNumber });
      let feedbacks = await Feedback.find({ rollNumber: student.rollNumber});

      // Enrich feedbacks with organizationName from internships
      feedbacks = feedbacks.map(feedback => {
        const internship = internships.find(i => i.rollNumber === feedback.rollNumber);
        return {
          ...feedback.toObject(),
          organizationName: internship ? internship.organizationName : 'Unknown Organization'
        };
      });

      res.json({
        student,
        internships,
        feedbacks,
      });
    } else if (req.user) {
      // If student profile not found, return user profile with empty internships and feedbacks
      res.json({
        user: req.user,
        internships: [],
        feedbacks: [],
      });
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    console.error('Error in /profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;