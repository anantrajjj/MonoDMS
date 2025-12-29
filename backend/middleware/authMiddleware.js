const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Document = require('../models/Document');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles (Global User Roles)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check Document Permissions (Resource Level)
// roles: 'owner', 'admin' (write), 'read'
exports.checkDocumentPermission = (...allowedAccessLevels) => {
  return async (req, res, next) => {
    try {
      const docId = req.params.id;
      const document = await Document.findById(docId);

      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }

      // 1. Owner always has access
      if (document.owner.toString() === req.user._id.toString()) {
        req.document = document;
        return next();
      }

      // 2. Check permissions array
      // allowedAccessLevels might be ['read'] or ['read', 'write']
      // If user has 'write', they also have 'read' implicitly in many systems, 
      // but here we'll check for exact match or hierarchy if needed.
      // Let's assume hierarchy: admin > write > read
      
      const userPerm = document.permissions.find(
        p => p.user.toString() === req.user._id.toString()
      );

      if (!userPerm) {
         return res.status(403).json({ success: false, message: 'No permission to access this document' });
      }

      const accessHierarchy = { 'read': 1, 'write': 2, 'admin': 3 };
      const userLevel = accessHierarchy[userPerm.access];
      
      // Check if any of the allowed levels are satisfied
      // e.g. if allowed is 'read', user with 'write' (2) should pass if we treat it as minimum
      // But the prompt says "Role-based authorization (owner, editor, viewer)"
      // Let's simplify: if the route requires 'write', user must have 'write' or 'admin'.
      
      let hasAccess = false;
      for (const level of allowedAccessLevels) {
          if (level === 'owner') continue; // Handled above
          if (accessHierarchy[level] <= userLevel) {
              hasAccess = true;
              break;
          }
      }

      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Insufficient permissions' });
      }

      req.document = document;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
};
