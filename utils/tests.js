const { loadData, saveData } = require('./admissions');
const { tests, reloadData } = require("./maps");

const createTest = (subject, instructor, credits) => {
  if (credits < 1) {
    throw new Error('❌ Credits must be ≥ 1.');
  }

  const data = loadData();
  const newTestId = data.tests.length > 0 ? data.tests[data.tests.length - 1].id + 1 : 1;
  const newTest = { id: newTestId, subject, instructor, credits };

  data.tests.push(newTest);
  saveData(data);
  reloadData(); 

  return newTest;
};

module.exports = { createTest };
