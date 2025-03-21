const fs = require('fs');
const { loadData } = require('./admissions');
const { getGradePoint, getGradeLetter } = require('./grading');

const generateTranscript = (studentIndex) => {
  const data = loadData();
  const student = data.students[studentIndex - 1];
  if (!student) {
    console.log('Student not found.');
    return;
  }

  const grades = data.gradePoints[student.email] || [];

  console.log(`Student: ${student.name}`);
  console.log(`Email: ${student.email}`);
  console.log(`Grades:`);

  let totalPoints = 0;
  let totalCredits = 0;

  grades.forEach(({ test, score }) => {
    const gradePoint = getGradePoint(score);
    totalPoints += gradePoint * test.credits;
    totalCredits += test.credits;
    console.log(`- ${test.subject}: ${getGradeLetter(score)} (${test.credits} credits)`);
  });

  const gpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
  console.log(`GPA: ${gpa}`);
};

module.exports = { generateTranscript };
