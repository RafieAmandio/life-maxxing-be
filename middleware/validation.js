const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
const userValidationRules = {
  register: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('username').isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').optional().isLength({ max: 50 }).withMessage('First name must be less than 50 characters'),
    body('lastName').optional().isLength({ max: 50 }).withMessage('Last name must be less than 50 characters'),
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  updateProfile: [
    body('firstName').optional().isLength({ max: 50 }).withMessage('First name must be less than 50 characters'),
    body('lastName').optional().isLength({ max: 50 }).withMessage('Last name must be less than 50 characters'),
  ],
};

// Group validation rules
const groupValidationRules = {
  create: [
    body('name').isLength({ min: 1, max: 100 }).withMessage('Group name is required (max 100 characters)'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  ],
  join: [
    body('inviteCode').isLength({ min: 1 }).withMessage('Invite code is required'),
  ],
};

// Task validation rules
const taskValidationRules = {
  create: [
    body('title').isLength({ min: 1, max: 200 }).withMessage('Task title is required (max 200 characters)'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  ],
  update: [
    body('title').optional().isLength({ min: 1, max: 200 }).withMessage('Task title must be 1-200 characters'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ],
  complete: [
    body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
  ],
};

// Parameter validation rules
const paramValidationRules = {
  id: [
    param('id').isInt({ min: 1 }).withMessage('Valid ID is required'),
  ],
  groupId: [
    param('groupId').isInt({ min: 1 }).withMessage('Valid group ID is required'),
  ],
  taskId: [
    param('taskId').isInt({ min: 1 }).withMessage('Valid task ID is required'),
  ],
  completionId: [
    param('completionId').isInt({ min: 1 }).withMessage('Valid completion ID is required'),
  ],
};

// Query validation rules
const queryValidationRules = {
  date: [
    query('date').optional().isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
  ],
  period: [
    query('period').optional().isIn(['week', 'month', 'all']).withMessage('Period must be week, month, or all'),
  ],
  groupId: [
    query('groupId').optional().isInt({ min: 1 }).withMessage('Group ID must be a valid integer'),
  ],
};

module.exports = {
  handleValidationErrors,
  userValidationRules,
  groupValidationRules,
  taskValidationRules,
  paramValidationRules,
  queryValidationRules,
}; 