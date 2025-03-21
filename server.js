const express = require('express');
const bodyParser = require('body-parser');
const studentsRoutes = require('./routes/students');
const jobsRoutes = require('./routes/jobs');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(studentsRoutes);
app.use(jobsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
