const express = require('express');
const router = express.Router();
const { protect, checkDocumentPermission } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  uploadDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  deleteAllDocuments
} = require('../controllers/documentController');
const {
  uploadNewVersion,
  getVersionHistory,
  downloadVersion
} = require('../controllers/versionController');
const { shareDocument } = require('../controllers/permissionController');

// Apply protection to all routes
router.use(protect);

router.route('/')
  .get(getDocuments)
  .post(upload.single('file'), uploadDocument)
  .delete(deleteAllDocuments);

router.route('/:id')
  .get(checkDocumentPermission('read'), getDocument)
  .put(checkDocumentPermission('write'), updateDocument)
  .delete(checkDocumentPermission('admin'), deleteDocument);

// Share Route
router.route('/:id/share')
  .post(checkDocumentPermission('admin'), shareDocument);

// Version Control Routes
router.route('/:id/versions')
  .get(checkDocumentPermission('read'), getVersionHistory)
  .post(checkDocumentPermission('write'), upload.single('file'), uploadNewVersion);

router.route('/:id/versions/:versionId/download')
  .get(checkDocumentPermission('read'), downloadVersion);

module.exports = router;
