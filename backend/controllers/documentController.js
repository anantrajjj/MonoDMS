const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// @desc    Upload a new document
// @route   POST /api/documents
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { title, description, tags } = req.body;

    // Create initial version
    const initialVersion = {
      filePath: req.file.path,
      versionNumber: 1,
      uploadedBy: req.user._id
    };

    const document = await Document.create({
      title: title || req.file.originalname,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      owner: req.user._id,
      versions: [initialVersion],
      permissions: [{ user: req.user._id, access: 'admin' }] // Owner gets admin access
    });

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (err) {
    // If error, delete the uploaded file to save space
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all documents (that user has access to) with search and filter
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res) => {
  try {
    const { search, tags, owner } = req.query;

    // Base query: User must be owner OR have explicit permission
    let query = {
      $or: [
        { owner: req.user._id },
        { 'permissions.user': req.user._id }
      ]
    };

    // Search by keyword (title or tags) using text index
    if (search) {
      query = {
        $and: [
          query,
          { $text: { $search: search } }
        ]
      };
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      // Use $and to ensure we don't overwrite previous conditions
      if (!query.$and) query.$and = [];
      query.$and.push({ tags: { $in: tagArray } });
    }

    // Filter by owner (if user wants to see docs owned by specific person)
    // Note: They still must have permission to see them via the base query
    if (owner) {
      if (!query.$and) query.$and = [];
      query.$and.push({ owner: owner });
    }

    const documents = await Document.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res) => {
  try {
    // req.document is set by checkDocumentPermission middleware
    const document = await Document.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('versions.uploadedBy', 'name')
      .populate('permissions.user', 'name email');

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update document metadata
// @route   PUT /api/documents/:id
// @access  Private
exports.updateDocument = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    // req.document is set by middleware
    const document = req.document;

    if (title) document.title = title;
    if (description) document.description = description;
    if (tags) document.tags = tags.split(',').map(tag => tag.trim());

    await document.save();

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const document = req.document;

    // Delete all version files
    document.versions.forEach(version => {
      if (fs.existsSync(version.filePath)) {
        fs.unlinkSync(version.filePath);
      }
    });

    await document.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete all documents owned by user
// @route   DELETE /api/documents
// @access  Private
exports.deleteAllDocuments = async (req, res) => {
  try {
    // Find all documents owned by the user
    const documents = await Document.find({ owner: req.user._id });

    // Delete files for each document
    documents.forEach(doc => {
      doc.versions.forEach(version => {
        if (fs.existsSync(version.filePath)) {
          try {
            fs.unlinkSync(version.filePath);
          } catch (e) {
            console.error(`Failed to delete file: ${version.filePath}`, e);
          }
        }
      });
    });

    // Delete documents from DB
    await Document.deleteMany({ owner: req.user._id });

    res.status(200).json({
      success: true,
      message: 'All documents cleared'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
