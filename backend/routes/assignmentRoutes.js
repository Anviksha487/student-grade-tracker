const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// Get all assignments for a student
router.get('/:studentId', async (req, res) => {
  try {
    const assignments = await Assignment.find({ studentId: req.params.studentId })
    res.json(assignments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// Add assignment
router.post('/', async (req, res) => {
  try {
    const assignment = new Assignment(req.body)
    const newAssignment = await assignment.save()
    res.status(201).json(newAssignment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

// Update assignment status
router.put('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(assignment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

// Delete assignment
router.delete('/:id', async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Assignment deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

module.exports = router;