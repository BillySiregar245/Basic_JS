const express = require('express');
const router = express.Router();
const { createTest, enterMarks } = require('../utils/tests');

router.post('/tests', (req, res) => {
  const { subject, instructor, credits } = req.body;
  createTest(subject, instructor, credits);
  res.status(201).json({ message: 'Test created' });
});

router.post('/tests/:id/marks', (req, res) => {
  const { id } = req.params;
  const { studentId, score } = req.body;
  enterMarks(parseInt(id), parseInt(studentId), parseInt(score));
  res.status(202).json({ message: 'Marks recorded' });
});

module.exports = router;
