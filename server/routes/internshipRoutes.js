console.log("✅ internshipRoutes.js loaded");

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Internship = require('../models/Internship');

// Ensure uploads directory exists
const uploadPath = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST: Submit internship form with file uploads
router.post('/submit', upload.fields([
  { name: 'offerLetter', maxCount: 1 },
  { name: 'applicationLetter', maxCount: 1 },
  { name: 'noc', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Files received:', req.files);
    console.log('Body received:', req.body);

    const body = req.body;

    const internshipData = {
      rollNumber: body.rollNo,
      name: body.name,
      branch: body.branch,
      semester: body.semester,
      section: body.section,
      email: body.email,
      phoneNo: body.mobile,
      role: body.role,
      organizationName: body.organization,
      hrEmail: body.hrEmail,
      hrPhone: Number(body.hrMobile),
      duration: Number(body.duration),
      package: Number(body.pay),
      startingDate: body.startDate,
      endingDate: body.endDate,
      offerLetter: req.files['offerLetter'] ? `/uploads/${req.files['offerLetter'][0].filename}` : undefined,
      applicationLetter: req.files['applicationLetter'] ? `/uploads/${req.files['applicationLetter'][0].filename}` : undefined,
      noc: req.files['noc'] ? `/uploads/${req.files['noc'][0].filename}` : undefined,
    };

    // Validate required fields
    const requiredFields = ['rollNumber', 'name', 'branch', 'semester', 'email', 'role', 'organizationName', 'hrEmail', 'duration', 'package'];
    for (const field of requiredFields) {
      if (!internshipData[field]) {
        console.error(`Missing required field: ${field}`);
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const newInternship = new Internship(internshipData);
    await newInternship.save();

    // Update Student document
    const Student = require('../models/Student');
    let student = await Student.findOne({ rollNumber: body.rollNo });
    if (student) {
      student.internships.push(newInternship._id);
      await student.save();
    } else {
      student = new Student({
        rollNumber: body.rollNo,
        name: body.name,
        email: body.email,
        branch: body.branch,
        semester: body.semester,
        section: body.section,
        phoneNo: body.mobile,
        internships: [newInternship._id]
      });
      await student.save();
      console.log(`Created new student with roll number ${body.rollNo}`);
    }
    res.status(201).json({ message: 'Internship submitted successfully' });
  } catch (error) {
    console.error('Internship submission error:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: 'Failed to save internship data' });
  }
});

// GET: Fetch all submitted internships
router.get('/all', async (req, res) => {
  try {
    const internships = await Internship.find();

    const now = new Date();
    internships.forEach(internship => {
      if (internship.startingDate && internship.endingDate) {
        if (now < internship.startingDate) {
          internship.status = 'Upcoming';
        } else if (now >= internship.startingDate && now <= internship.endingDate) {
          internship.status = 'Ongoing';
        } else if (now > internship.endingDate) {
          internship.status = 'Completed';
        }
      }
    });

    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

module.exports = router;
