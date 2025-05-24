const userService = require('../services/userService');
const path = require('path');

class UserController {
  async getProfile(req, res) {
    try {
      const user = await userService.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProfile(req, res) {
    try {
      const { firstName, lastName } = req.body;
      const updateData = {};

      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;

      const user = await userService.updateUserProfile(req.user.id, updateData);

      res.json({
        message: 'Profile updated successfully',
        user,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const profileImageUrl = `/uploads/avatars/${req.file.filename}`;

      const user = await userService.updateUserProfile(req.user.id, {
        profileImageUrl,
      });

      res.json({
        message: 'Avatar uploaded successfully',
        profileImageUrl,
        user,
      });
    } catch (error) {
      console.error('Upload avatar error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getStats(req, res) {
    try {
      const { groupId, period = 'all' } = req.query;

      const stats = await userService.getUserStats(
        req.user.id,
        groupId ? parseInt(groupId) : null,
        period
      );

      res.json({ stats });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCompletions(req, res) {
    try {
      const { groupId, date } = req.query;
      const taskService = require('../services/taskService');

      const completions = await taskService.getUserCompletions(
        req.user.id,
        groupId ? parseInt(groupId) : null,
        date
      );

      res.json({ completions });
    } catch (error) {
      console.error('Get completions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new UserController(); 