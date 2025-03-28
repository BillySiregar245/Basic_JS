const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  corrector: { type: String, required: true }, // Disimpan sebagai string
  credits: { type: Number, required: true },
  department: { type: String, required: true },
  marks: [
    {
      studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Student" 
      },
      score: { type: Number },
      grade: { type: String }
    }
  ]
});

module.exports = mongoose.model("Test", testSchema);
