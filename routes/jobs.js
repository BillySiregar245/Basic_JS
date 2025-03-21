const express = require('express');
const router = express.Router();
const { getJobStatus } = require('../utils/jobs');

const API_KEY = "secureapikey123"; // Autentikasi API Key

// Middleware untuk autentikasi API Key
const authenticate = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (apiKey !== API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

// Check Job Status
router.get('/jobs/:id', authenticate, (req, res) => {
    const jobId = req.params.id;
    const jobStatus = getJobStatus(jobId);

    if (!jobStatus) {
        return res.status(404).json({ error: "Job not found" });
    }

    res.json(jobStatus);
});

module.exports = router;
