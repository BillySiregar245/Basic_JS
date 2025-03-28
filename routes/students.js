const express = require('express');
const router = express.Router();
const { admitStudent } = require('../utils/admissions');
const Student = require('../models/studentModel');
const { createJob, getJobStatus } = require('../utils/jobs')
const { generateTranscript } = require('../utils/transcript')

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const newStudent = await admitStudent(name, email);
    res.status(201).json({ message: `Student ${name} added.`, student: newStudent });

  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});


router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student || student.status === "deleted") {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const validStatus = ["pending", "admitted"];

    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status query" });
    }

    const query = status ? { status } : { status: { $ne: "deleted" } };
    const students = await Student.find(query);
    
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put('/:id/approve', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id, 
      { status: "admitted" }, 
      { new: true }
    );

    if (!student || student.status === "deleted") {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: `Student ${student.name} approved.`, student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/transcript", async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    
    const jobId = createJob(async () => {
      const gpa = await generateTranscript(studentId);
      return { gpa };
    });

    res.status(202).json({ message: "Transcript generation in progress", jobId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: "deleted" }, 
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: `Student ${student.name} marked as deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
