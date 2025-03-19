const fs = require('fs');
const DATA_FILE = 'data.json';

const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { students: [], tests: [], gradePoints: {} };
  }
};

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const admitStudent = (name, email) => {
  if (!email.endsWith('@univ.edu')) {
    console.log('Invalid email. Must end with @univ.edu');
    return;
  }

  const data = loadData();
  data.students.push({ name, email, status: 'pending' });
  saveData(data);
  console.log(`✅ Student ${name} added with status: pending.`);
};

const approveStudent = (index) => {
  const data = loadData();
  if (data.students[index - 1] && data.students[index - 1].status === 'pending') {
    data.students[index - 1].status = 'approved';
    saveData(data);
    console.log(`✅ Student ${data.students[index - 1].name} approved!`);
  } else {
    console.log('Invalid student or already approved.');
  }
};

const listPendingStudents = () => {
  const data = loadData();
  data.students.forEach((student, index) => {
    if (student.status === 'pending') {
      console.log(`${index + 1}. ${student.name} (${student.email}) - Pending`);
    }
  });
};

module.exports = { 
  loadData, 
  saveData, 
  admitStudent, 
  approveStudent, 
  listPendingStudents 
};