const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: String,
    default: ''
  },
  section: {
    type: String,
    default: ''
  },
  subjects: [
    {
      name: String,
      marks: Number,
      totalMarks: Number
    }
  ]
});

studentSchema.methods.getGrade = function(marks, total) {
  const percentage = (marks / total) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

module.exports = mongoose.model('Student', studentSchema);