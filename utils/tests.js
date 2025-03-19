const fs = require('fs');
const { loadData, saveData } = require('./admissions');

const createTest = (subject, instructor, credits) => {
  if (credits < 1) {
    console.log('❌ Credits must be ≥ 1.');
    return;
  }
  const data = loadData();
  data.tests.push({ subject, instructor, credits });
  saveData(data);
  console.log(`✅ Test ${subject} created.`);
};

const enterMarks = (testIndex, studentIndex, score) => {
  const data = loadData();
  const test = data.tests[testIndex - 1];
  const student = data.students[studentIndex - 1];
  if (test && student) {
    if (!data.gradePoints[student.email]) {
      data.gradePoints[student.email] = [];
    }
    data.gradePoints[student.email].push({ test, score });
    saveData(data);
    console.log(`✅ Marks updated for test ${testIndex}, student ${studentIndex}.`);
  } else {
    console.log('Invalid test or student.');
  }
};

module.exports = { createTest, enterMarks };