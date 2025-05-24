const taskService = require('../services/taskService');

class TaskController {
  // Daily Tasks
  async createDailyTask(req, res) {
    try {
      const groupId = parseInt(req.params.groupId);
      const { title, description } = req.body;

      const task = await taskService.createDailyTask(
        { title, description, groupId },
        req.user.id
      );

      res.status(201).json({
        message: 'Daily task created successfully',
        task,
      });
    } catch (error) {
      console.error('Create daily task error:', error);
      if (error.message === 'You are not a member of this group') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getGroupDailyTasks(req, res) {
    try {
      const groupId = parseInt(req.params.groupId);

      const tasks = await taskService.getGroupDailyTasks(groupId, req.user.id);

      res.json({ tasks });
    } catch (error) {
      console.error('Get group daily tasks error:', error);
      if (error.message === 'You are not a member of this group') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateDailyTask(req, res) {
    try {
      const taskId = parseInt(req.params.taskId);
      const updateData = req.body;

      const task = await taskService.updateDailyTask(taskId, updateData, req.user.id);

      res.json({
        message: 'Daily task updated successfully',
        task,
      });
    } catch (error) {
      console.error('Update daily task error:', error);
      if (error.message.includes('not a member') || error.message.includes('Only the task creator')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteDailyTask(req, res) {
    try {
      const taskId = parseInt(req.params.taskId);

      const result = await taskService.deleteDailyTask(taskId, req.user.id);

      res.json(result);
    } catch (error) {
      console.error('Delete daily task error:', error);
      if (error.message.includes('not a member') || error.message.includes('Only the task creator')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Personal Tasks
  async createPersonalTask(req, res) {
    try {
      const groupId = parseInt(req.params.groupId);
      const { title, description } = req.body;

      const task = await taskService.createPersonalTask(
        { title, description, groupId },
        req.user.id
      );

      res.status(201).json({
        message: 'Personal task created successfully',
        task,
      });
    } catch (error) {
      console.error('Create personal task error:', error);
      if (error.message === 'You are not a member of this group') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getGroupPersonalTasks(req, res) {
    try {
      const groupId = parseInt(req.params.groupId);

      const tasks = await taskService.getGroupPersonalTasks(groupId, req.user.id);

      res.json({ tasks });
    } catch (error) {
      console.error('Get group personal tasks error:', error);
      if (error.message === 'You are not a member of this group') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updatePersonalTask(req, res) {
    try {
      const taskId = parseInt(req.params.taskId);
      const updateData = req.body;

      const task = await taskService.updatePersonalTask(taskId, updateData, req.user.id);

      res.json({
        message: 'Personal task updated successfully',
        task,
      });
    } catch (error) {
      console.error('Update personal task error:', error);
      if (error.message === 'You can only update your own personal tasks') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deletePersonalTask(req, res) {
    try {
      const taskId = parseInt(req.params.taskId);

      const result = await taskService.deletePersonalTask(taskId, req.user.id);

      res.json(result);
    } catch (error) {
      console.error('Delete personal task error:', error);
      if (error.message === 'You can only delete your own personal tasks') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Task Completions
  async completeDailyTask(req, res) {
    try {
      const taskId = parseInt(req.params.taskId);
      const { notes } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'Proof image is required' });
      }

      const proofImageUrl = `/uploads/proofs/${req.file.filename}`;

      // Get task to find groupId
      const task = await taskService.getTaskById(taskId, 'daily');
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const completion = await taskService.completeTask({
        dailyTaskId: taskId,
        groupId: task.groupId,
        proofImageUrl,
        notes,
      }, req.user.id);

      res.status(201).json({
        message: 'Task completed successfully',
        completion,
      });
    } catch (error) {
      console.error('Complete daily task error:', error);
      if (error.message.includes('not a member') || error.message.includes('already completed')) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async completePersonalTask(req, res) {
    try {
      const taskId = parseInt(req.params.taskId);
      const { notes } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'Proof image is required' });
      }

      const proofImageUrl = `/uploads/proofs/${req.file.filename}`;

      // Get task to find groupId
      const task = await taskService.getTaskById(taskId, 'personal');
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const completion = await taskService.completeTask({
        personalTaskId: taskId,
        groupId: task.groupId,
        proofImageUrl,
        notes,
      }, req.user.id);

      res.status(201).json({
        message: 'Task completed successfully',
        completion,
      });
    } catch (error) {
      console.error('Complete personal task error:', error);
      if (error.message.includes('only complete your own') || error.message.includes('already completed')) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getGroupCompletions(req, res) {
    try {
      const groupId = parseInt(req.params.groupId);
      const { date } = req.query;

      const completions = await taskService.getGroupCompletions(groupId, req.user.id, date);

      res.json({ completions });
    } catch (error) {
      console.error('Get group completions error:', error);
      if (error.message === 'You are not a member of this group') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async verifyCompletion(req, res) {
    try {
      const completionId = parseInt(req.params.completionId);

      const completion = await taskService.verifyCompletion(completionId, req.user.id);

      res.json({
        message: 'Completion verified successfully',
        completion,
      });
    } catch (error) {
      console.error('Verify completion error:', error);
      if (error.message.includes('not a member') || error.message.includes('cannot verify your own')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Completion not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Completion already verified') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new TaskController(); 