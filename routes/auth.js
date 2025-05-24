const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { userValidationRules, handleValidationErrors } = require('../middleware/validation');

// POST /api/auth/register
router.post('/register', 
  userValidationRules.register,
  handleValidationErrors,
  authController.register
);

// POST /api/auth/login
router.post('/login',
  userValidationRules.login,
  handleValidationErrors,
  authController.login
);

// GET /api/auth/me
router.get('/me',
  authMiddleware,
  authController.getProfile
);

module.exports = router; 