const mongoose = require('mongoose');

const focusSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  minutes: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  day: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Focus', focusSchema);
