const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const { userValidationRules, queryValidationRules, handleValidationErrors } = require('../middleware/validation');

// GET /api/users/profile
router.get('/profile',
  authMiddleware,
  userController.getProfile
);

// PUT /api/users/profile
router.put('/profile',
  authMiddleware,
  userValidationRules.updateProfile,
  handleValidationErrors,
  userController.updateProfile
);

// POST /api/users/upload-avatar
router.post('/upload-avatar',
  authMiddleware,
  uploadAvatar.single('avatar'),
  userController.uploadAvatar
);

// GET /api/users/stats
router.get('/stats',
  authMiddleware,
  queryValidationRules.groupId,
  queryValidationRules.period,
  handleValidationErrors,
  userController.getStats
);

// GET /api/users/my-completions
router.get('/my-completions',
  authMiddleware,
  queryValidationRules.groupId,
  queryValidationRules.date,
  handleValidationErrors,
  userController.getCompletions
);

module.exports = router; 