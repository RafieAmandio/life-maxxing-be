const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');
const { uploadProof } = require('../middleware/upload');
const { taskValidationRules, paramValidationRules, queryValidationRules, handleValidationErrors } = require('../middleware/validation');

// Daily Tasks Routes
// POST /api/groups/:groupId/daily-tasks
router.post('/groups/:groupId/daily-tasks',
  authMiddleware,
  paramValidationRules.groupId,
  taskValidationRules.create,
  handleValidationErrors,
  taskController.createDailyTask
);

// GET /api/groups/:groupId/daily-tasks
router.get('/groups/:groupId/daily-tasks',
  authMiddleware,
  paramValidationRules.groupId,
  handleValidationErrors,
  taskController.getGroupDailyTasks
);

// PUT /api/daily-tasks/:taskId
router.put('/daily-tasks/:taskId',
  authMiddleware,
  paramValidationRules.taskId,
  taskValidationRules.update,
  handleValidationErrors,
  taskController.updateDailyTask
);

// DELETE /api/daily-tasks/:taskId
router.delete('/daily-tasks/:taskId',
  authMiddleware,
  paramValidationRules.taskId,
  handleValidationErrors,
  taskController.deleteDailyTask
);

// Personal Tasks Routes
// POST /api/groups/:groupId/personal-tasks
router.post('/groups/:groupId/personal-tasks',
  authMiddleware,
  paramValidationRules.groupId,
  taskValidationRules.create,
  handleValidationErrors,
  taskController.createPersonalTask
);

// GET /api/groups/:groupId/personal-tasks
router.get('/groups/:groupId/personal-tasks',
  authMiddleware,
  paramValidationRules.groupId,
  handleValidationErrors,
  taskController.getGroupPersonalTasks
);

// PUT /api/personal-tasks/:taskId
router.put('/personal-tasks/:taskId',
  authMiddleware,
  paramValidationRules.taskId,
  taskValidationRules.update,
  handleValidationErrors,
  taskController.updatePersonalTask
);

// DELETE /api/personal-tasks/:taskId
router.delete('/personal-tasks/:taskId',
  authMiddleware,
  paramValidationRules.taskId,
  handleValidationErrors,
  taskController.deletePersonalTask
);

// Task Completion Routes
// POST /api/tasks/complete/daily/:taskId
router.post('/complete/daily/:taskId',
  authMiddleware,
  paramValidationRules.taskId,
  uploadProof.single('proofImage'),
  taskValidationRules.complete,
  handleValidationErrors,
  taskController.completeDailyTask
);

// POST /api/tasks/complete/personal/:taskId
router.post('/complete/personal/:taskId',
  authMiddleware,
  paramValidationRules.taskId,
  uploadProof.single('proofImage'),
  taskValidationRules.complete,
  handleValidationErrors,
  taskController.completePersonalTask
);

// GET /api/groups/:groupId/completions
router.get('/groups/:groupId/completions',
  authMiddleware,
  paramValidationRules.groupId,
  queryValidationRules.date,
  handleValidationErrors,
  taskController.getGroupCompletions
);

// POST /api/completions/:completionId/verify
router.post('/completions/:completionId/verify',
  authMiddleware,
  paramValidationRules.completionId,
  handleValidationErrors,
  taskController.verifyCompletion
);

module.exports = router; 