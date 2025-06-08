const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  feedbackID: String,
  date: Date,
  skillsLearned: String,
  technicalSkill: Number,
  communicationSkill: Number,
  problemSolvingSkill: Number,
  teamWork: Number,
  timeManagement: Number,
  technologiesUsed: String,
  curriculumImprovement: String,
  coursesOrWorkshops: String,
  suggestions: String,
  participationCertificate: String,
  rollNumber: String,
  relevantToField: String,
  usefulness: String,
  overallExperience: String,
  recommend: String,
});

module.exports = mongoose.model('feedback', FeedbackSchema);
