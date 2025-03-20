const { admitStudent, approveStudent, listPendingStudents } = require('./utils/admissions');
const { createTest, enterMarks } = require('./utils/tests');
const { generateTranscript } = require('./utils/transcript');

const command = process.argv[2];

switch (command) {
  case 'admit':
    admitStudent(process.argv[3], process.argv[4]);
    break;
  case 'approve':
    approveStudent(parseInt(process.argv[3]));
    break;
  case 'list-pending':
    listPendingStudents();
    break;
  case 'create-test':
    createTest(process.argv[3], process.argv[4], parseInt(process.argv[5]));
    break;
  case 'enter-marks':
    enterMarks(parseInt(process.argv[3]), parseInt(process.argv[4]), parseInt(process.argv[5]));
    break;
  case 'generate-transcript':
    generateTranscript(parseInt(process.argv[3]));
    break;
  default:
    console.log('Command not recognized');
}