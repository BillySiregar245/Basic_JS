const express = require('express');
const router = express.Router();
const { loadData, saveData } = require('../utils/admissions');
const { queueJob, getJobStatus } = require('../utils/jobs');

const API_KEY = "secureapikey123"; // Autentikasi API Key

// Middleware untuk autentikasi API Key
const authenticate = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (apiKey !== API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

// Admit Student (Sync)
router.post('/students', authenticate, (req, res) => {
    const { name, email } = req.body;
    if (!email.endsWith('@univ.edu')) {
        return res.status(400).json({ error: 'Invalid email. Must end with @univ.edu' });
    }
    
    const data = loadData();
    data.students.push({ name, email, status: 'pending' });
    saveData(data);
    
    res.status(201).json({ message: `Student ${name} added with status: pending.` });
});

// Approve Student (Sync)
router.post('/students/:id/approve', authenticate, (req, res) => {
    const data = loadData();
    const student = data.students[parseInt(req.params.id) - 1];

    if (!student || student.status !== 'pending') {
        return res.status(400).json({ error: 'Invalid student or already approved.' });
    }

    student.status = 'approved';
    saveData(data);

    res.json({ message: `Student ${student.name} approved!` });
});

// Get Pending Students
router.get('/students/pending', authenticate, (req, res) => {
    const data = loadData();
    const pendingStudents = data.students.filter(s => s.status === 'pending');

    res.json({ pendingStudents });
});

// Generate Transcript (Async)
router.post('/students/:id/transcript', authenticate, (req, res) => {
    const jobId = queueJob('generate-transcript', { studentId: parseInt(req.params.id) });
    res.json({ jobId, status: "queued" });
});

module.exports = router;
