const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const adminID = 'A1';
const name = 'Admin User';
const email = 'admin@example.com';
const phoneNo = 1234567890;
const department = 'IT';
const password = 'Sarika@123'; // Plain text password

mongoose.connect('mongodb://127.0.0.1:27017/inter', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');

  const existingAdmin = await Admin.findOne({ adminID });
  if (existingAdmin) {
    console.log('Admin with this ID already exists.');
    process.exit(0);
  }

  const newAdmin = new Admin({
    adminID,
    name,
    email,
    phoneNo,
    department,
    password,
  });

  await newAdmin.save();
  console.log('Admin user created successfully.');
  process.exit(0);
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
