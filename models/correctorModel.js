const mongoose = require("mongoose");

const correctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  correctedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }]
});

module.exports = mongoose.model("Corrector", correctorSchema);
