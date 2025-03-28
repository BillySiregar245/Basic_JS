const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true, 
    match: [/^[a-zA-Z0-9._%+-]+@univ\.edu$/, "Invalid email format. Must be @univ.edu"] 
  },
  status: { 
    type: String, 
    enum: ["admitted", "pending", "deleted"], 
    default: "pending" 
  },
  department: { 
    type: String, 
    required: true 
  },
  grades: [
    {
      subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
      testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" }, 
      mark: Number,
      grade: String
    }
  ],
  gpa: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
