const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/auth');
const { groupValidationRules, paramValidationRules, queryValidationRules, handleValidationErrors } = require('../middleware/validation');

// POST /api/groups
router.post('/',
  authMiddleware,
  groupValidationRules.create,
  handleValidationErrors,
  groupController.createGroup
);

// POST /api/groups/join
router.post('/join',
  authMiddleware,
  groupValidationRules.join,
  handleValidationErrors,
  groupController.joinGroup
);

// GET /api/groups/my-groups
router.get('/my-groups',
  authMiddleware,
  groupController.getUserGroups
);

// GET /api/groups/:groupId
router.get('/:groupId',
  authMiddleware,
  paramValidationRules.groupId,
  handleValidationErrors,
  groupController.getGroupById
);

// DELETE /api/groups/:groupId/leave
router.delete('/:groupId/leave',
  authMiddleware,
  paramValidationRules.groupId,
  handleValidationErrors,
  groupController.leaveGroup
);

// GET /api/groups/:groupId/stats
router.get('/:groupId/stats',
  authMiddleware,
  paramValidationRules.groupId,
  queryValidationRules.period,
  handleValidationErrors,
  groupController.getGroupStats
);

module.exports = router; 