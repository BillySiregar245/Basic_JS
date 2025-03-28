const express = require("express");
const router = express.Router();
const Job = require("../models/jobModel");


router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findOne({ id: req.params.id });

    if (!job) return res.status(404).json({ error: "Job not found" });

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
