const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// @desc    Upload a new version of a document
// @route   POST /api/documents/:id/versions
// @access  Private (Write/Admin)
exports.uploadNewVersion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const document = req.document; // Set by checkDocumentPermission middleware

    // Determine new version number
    const lastVersion = document.versions[document.versions.length - 1];
    const newVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    const newVersion = {
      filePath: req.file.path,
      versionNumber: newVersionNumber,
      uploadedBy: req.user._id,
      uploadedAt: Date.now()
    };

    document.versions.push(newVersion);
    await document.save();

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get document version history
// @route   GET /api/documents/:id/versions
// @access  Private (Read)
exports.getVersionHistory = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .select('versions title')
      .populate('versions.uploadedBy', 'name email');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      count: document.versions.length,
      data: document.versions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Download a specific version
// @route   GET /api/documents/:id/versions/:versionId/download
// @access  Private (Read)
exports.downloadVersion = async (req, res) => {
  try {
    const document = req.document; // Set by middleware
    const version = document.versions.id(req.params.versionId);

    if (!version) {
      return res.status(404).json({ success: false, message: 'Version not found' });
    }

    const filePath = path.resolve(version.filePath);

    if (fs.existsSync(filePath)) {
      res.download(filePath, `${document.title}-v${version.versionNumber}${path.extname(version.filePath)}`);
    } else {
      res.status(404).json({ success: false, message: 'File not found on server' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
