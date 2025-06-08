const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  adminID: String,
  name: String,
  email: String,
  phoneNo: Number,
  department: String,
  password: String,
});

module.exports = mongoose.model('Admin', AdminSchema);
