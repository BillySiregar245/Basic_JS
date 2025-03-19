const fs = require('fs');
const { loadData } = require('./admissions');

const getGradePoint = (score) => {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.0;
  if (score >= 70) return 2.0;
  if (score >= 60) return 1.0;
  return 0.0;
};

const getGradeLetter = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

const generateTranscript = (studentIndex) => {
  const data = loadData();
  const student = data.students[studentIndex - 1];
  const grades = data.gradePoints[student.email] || [];

  console.log(`Student: ${student.name}`);
  console.log(`Email: ${student.email}`);
  console.log(`Grades:`);

  let totalPoints = 0;
  let totalCredits = 0;

  grades.forEach(({ test, score }) => {
    const gradePoint = getGradePoint(score);
    const gradeLetter = getGradeLetter(score);
    totalPoints += gradePoint * test.credits;
    totalCredits += test.credits;
    console.log(`- ${test.subject}: ${gradeLetter} (${test.credits} credits)`);
  });

  const gpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
  console.log(`GPA: ${gpa}`);
};

module.exports = { generateTranscript };
