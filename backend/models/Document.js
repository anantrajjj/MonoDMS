const mongoose = require('mongoose');
const documentVersionSchema = require('./DocumentVersion');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    access: {
      type: String,
      enum: ['read', 'write', 'admin'],
      default: 'read'
    }
  }],
  versions: [documentVersionSchema]
}, {
  timestamps: true
});

// Index for search on title and tags
documentSchema.index({ title: 'text', tags: 'text' });

module.exports = mongoose.model('Document', documentSchema);
