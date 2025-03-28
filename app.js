const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const studentsRoutes = require("./routes/students");
const testsRoutes = require("./routes/tests");
const jobsRoutes = require("./routes/jobs");
const { reloadData } = require("./utils/maps");

dotenv.config(); 

const app = express();
app.use(express.json());

const port = process.env.PORT || 8000;
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/University";

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log(`Database Connected: ${mongoURL}`);
    reloadData();

    
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });


app.use("/students", studentsRoutes);
app.use("/tests", testsRoutes);
app.use("/jobs", jobsRoutes);

module.exports = app;
