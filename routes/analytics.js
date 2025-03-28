const express = require("express");
const router = express.Router();
const Student = require("../models/studentModel");
const Test = require("../models/testModel");
const Department = require("../models/departmentModel");
const Subject = require("../models/subjectModel")
const Corrector = require("../models/correctorModel");

// 1. Laporan Siswa Berisiko
router.get("/at-risk-students", async (req, res) => {
  try {
    const students = await Student.aggregate([
      { $unwind: "$grades" },
      { $match: { "grades.grade": "F" } },
      { $group: { _id: "$_id", name: { $first: "$name" }, failingSubjects: { $sum: 1 } } },
      { $match: { failingSubjects: { $gte: 2 } } }
    ]);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Rata-rata GPA Per Departemen
router.get("/department-performance", async (req, res) => {
  try {
    const performance = await Student.aggregate([
      { $match: { status: "admitted" } },
      { $group: { _id: "$department", averageGPA: { $avg: "$gpa" } } },
      { $sort: { averageGPA: -1 } }
    ]);
    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Tren Pendaftaran Mata Kuliah
router.get("/subject-trends", async (req, res) => {
  try {
    const subjects = await Subject.aggregate([
      {
        $lookup: {
          from: "students",
          let: { subjId: "$_id" }, 
          pipeline: [
            { $unwind: "$grades" },
            {
              $match: {
                $expr: {
                  $eq: ["$grades.subjectId", "$$subjId"]
                }
              }
            }
          ],
          as: "enrolledStudents"
        }
      },
      {
        $addFields: {
          enrollment: { $size: "$enrolledStudents" }
        }
      },
      {
        $match: {
          enrollment: { $gt: 2 }
        }
      },
      {
        $sort: { enrollment: -1 }
      },
      {
        $project: {
          _id: 0,
          subject: "$name",
          enrollment: 1
        }
      }
    ]);
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Laporan Tahunan
router.get("/annual-report", async (req, res) => {
  try {
    const report = await Student.aggregate([
      {
        $facet: {
          departmentStats: [
            { $group: { _id: "$department", totalStudents: { $sum: 1 } } }
          ],
          subjectGPAs: [
            { $unwind: "$grades" },
            { $group: { _id: "$grades.testId", avgGPA: { $avg: "$grades.mark" } } }
          ],
          scholarshipStudents: [
            { $match: { gpa: { $gte: 3.8 } } },
            { $project: { _id: 0, name: 1, gpa: 1 } }
          ]
        }
      }
    ]);
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Paginated Corrector Workload
router.get("/corrector-workload", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const paginated = await Corrector.aggregate([
      {
        $lookup: {
          from: "tests",
          localField: "name",
          foreignField: "corrector",
          as: "assignedTests"
        }
      },
      {
        $addFields: {
          testCount: { $size: "$assignedTests" }
        }
      },
      {
        $sort: { testCount: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 0,
          corrector: "$name",
          testCount: 1
        }
      }
    ]);

    res.status(200).json(paginated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 6. Histogram Distribusi Nilai
router.get("/grade-distribution", async (req, res) => {
  try {
    const histogram = await Test.aggregate([
      { $unwind: "$marks" },
      { $group: { _id: "$marks.grade", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json(histogram);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
