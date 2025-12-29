// @desc    Share document with another user
// @route   POST /api/documents/:id/share
// @access  Private (Owner/Admin)
exports.shareDocument = async (req, res) => {
  try {
    const { email, access } = req.body; // access: 'read', 'write', 'admin'
    const document = req.document; // Set by middleware

    // Find user to share with
    const User = require('../models/User');
    const userToShare = await User.findOne({ email });

    if (!userToShare) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already shared
    const existingPermIndex = document.permissions.findIndex(
      p => p.user.toString() === userToShare._id.toString()
    );

    if (existingPermIndex > -1) {
      // Update existing permission
      document.permissions[existingPermIndex].access = access;
    } else {
      // Add new permission
      document.permissions.push({
        user: userToShare._id,
        access: access
      });
    }

    await document.save();

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
