const Student = require("../models/studentModel");


function getGradePoint(score) {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.0;
  if (score >= 70) return 2.0;
  if (score >= 60) return 1.0;
  return 0.0;
}

function getGradeLetter(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const generateTranscript = async (studentId) => {
  const student = await Student.findById(studentId).populate("grades.testId");
  if (!student) {
    console.log("Student not found");
    return 0;
  }

  let totalPoints = 0;
  let totalCredits = 0;

  for (const g of student.grades) {
    const credits = g.testId ? g.testId.credits : 0;
    const gradePoint = getGradePoint(g.mark);
    totalPoints += gradePoint * credits;
    totalCredits += credits;
  }

  const gpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);

  student.gpa = gpa;
  await student.save();

  console.log(`Student: ${student.name}`);
  console.log(`Email: ${student.email}`);
  console.log(`GPA: ${gpa}`);

  return gpa;
};

module.exports = { generateTranscript, getGradeLetter };
