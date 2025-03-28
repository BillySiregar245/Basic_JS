const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  result: { type: mongoose.Schema.Types.Mixed, default: null },
  error: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
