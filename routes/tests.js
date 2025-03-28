const express = require("express");
const router = express.Router();
const Test = require("../models/testModel");
const Student = require("../models/studentModel");
const { getGradeLetter } = require("../utils/transcript"); 
const { createJob, getJobStatus } = require("../utils/jobs");


router.post("/", async (req, res) => {
  try {
    const { subject, corrector, credits } = req.body;
    
    if (!subject || !corrector || !credits) {
      return res.status(400).json({ error: "Subject, corrector, and credits are required" });
    }

    const newTest = new Test({ subject, corrector, credits });
    await newTest.save();
    
    res.status(201).json({ message: `Test ${subject} created.`, test: newTest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})



router.put("/:id", async (req, res) => {
  try {
    const { credits } = req.body;
    if (!credits || credits < 1) {
      return res.status(400).json({ error: "Credits must be ≥ 1" });
    }

    const updatedTest = await Test.findByIdAndUpdate(
      req.params.id,
      { credits },
      { new: true }
    );

    if (!updatedTest) return res.status(404).json({ error: "Test not found" });

    res.json({ message: "Test updated successfully", test: updatedTest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/:testId/marks", async (req, res) => {
  try {
    const { testId } = req.params;
    const { studentId, score } = req.body;

    
    const test = await Test.findById(testId);
    const student = await Student.findById(studentId);

    if (!test) return res.status(404).json({ error: "Test not found" });
    if (!student) return res.status(404).json({ error: "Student not found" });

    
    const grade = getGradeLetter(score);

    
    test.marks.push({
      studentId: student._id,
      score,
      grade
    });
    await test.save();

    
    student.grades.push({
      testId: test._id,
      mark: score,
      grade
    });
    await student.save();

    res.status(200).json({ message: "Marks added successfully", grade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get("/jobs/:jobId", (req, res) => {
  const jobStatus = getJobStatus(req.params.jobId);
  if (!jobStatus) return res.status(404).json({ error: "Job not found" });

  res.json(jobStatus);
});

module.exports = router;
