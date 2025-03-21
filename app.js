const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { tests, createTest, recordTestScore } = require('./utils/tests');
const { calculateGPA } = require('./utils/transcript');

const app = express();
const port = 8000;
app.use(express.json());

const students = new Map();
const jobs = new Map();

const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== 'secureapikey123') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};


app.post('/students', (req, res) => {
    const studentId = uuidv4();
    students.set(studentId, { id: studentId, name: req.body.name, email: req.body.email, grades: [] });
    res.status(201).json({ message: 'Student admitted', studentId });
});


app.post('/tests', (req, res) => {
    const { subject, credits } = req.body;
    if (!subject || !credits) {
        return res.status(400).json({ error: 'Subject and credits are required' });
    }

    const testId = createTest(subject, credits);
    res.status(201).json({ message: 'Test created', testId });
});


app.post('/tests/:id/marks', authenticate, (req, res) => {
    const { id } = req.params;
    const { studentId, score } = req.body;

    if (!students.has(studentId)) {
        return res.status(404).json({ error: 'Student not found' });
    }

    const result = recordTestScore(id, studentId, score);
    if (!result) {
        return res.status(404).json({ error: 'Test not found' });
    }


    const student = students.get(studentId);
    student.grades.push(result);

    res.status(201).json({ message: 'Score recorded', subject: result.subject, grade: result.grade });
});

app.get('/students/:id/transcript', authenticate, (req, res) => {
    const { id } = req.params;
    if (!students.has(id)) {
        return res.status(404).json({ error: 'Student not found' });
    }

    const student = students.get(id);
    if (student.grades.length === 0) {
        return res.json({ message: 'No grades recorded yet', GPA: 0.0 });
    }

    const GPA = calculateGPA(student.grades);

    res.json({
        student: student.name,
        email: student.email,
        grades: student.grades,
        GPA
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
