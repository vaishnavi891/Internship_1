const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  rollNumber: String,
  name: String,
  semester: String,
  email: String,
  course: String,
  branch: String,
  section: String,
  phoneNo: Number,
});

module.exports = mongoose.model('student', StudentSchema);
