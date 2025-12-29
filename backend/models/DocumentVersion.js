const mongoose = require('mongoose');

const documentVersionSchema = new mongoose.Schema({
  filePath: {
    type: String,
    required: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = documentVersionSchema;
