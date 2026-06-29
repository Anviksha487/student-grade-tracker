const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Graded'],
    default: 'Pending'
  },
  grade: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);