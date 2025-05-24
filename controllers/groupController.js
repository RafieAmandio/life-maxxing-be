const groupService = require('../services/groupService');

class GroupController {
  async createGroup(req, res) {
    try {
      const { name, description } = req.body;

      const group = await groupService.createGroup(
        { name, description },
        req.user.id
      );

      res.status(201).json({
        message: 'Group created successfully',
        group,
        inviteCode: group.inviteCode,
      });
    } catch (error) {
      console.error('Create group error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async joinGroup(req, res) {
    try {
      const { inviteCode } = req.body;

      const membership = await groupService.joinGroup(inviteCode, req.user.id);

      res.json({
        message: 'Successfully joined the group',
        group: membership.group,
      });
    } catch (error) {
      console.error('Join group error:', error);
      if (error.message === 'Invalid invite code') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Group is full' || error.message === 'Already a member of this group') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserGroups(req, res) {
    try {
      const memberships = await groupService.getUserGroups(req.user.id);

      const groups = memberships.map(membership => ({
        group: membership.group,
        memberCount: membership.group._count.members,
        myRole: membership.role,
        joinedAt: membership.joinedAt,
      }));

      res.json({ groups });
    } catch (error) {
      console.error('Get user groups error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getGroupById(req, res) {
    try {
      const groupId = parseInt(req.params.groupId);

      const group = await groupService.getGroupById(groupId, req.user.id);

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      res.json({ group });
    } catch (error) {
      console.error('Get group error:', error);
      if (error.message === 'You are not a member of this group') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async leaveGroup(req, res) {
    try {
      const groupId = parseInt(req.params.groupId);

      const result = await groupService.leaveGroup(groupId, req.user.id);

      res.json(result);
    } catch (error) {
      console.error('Leave group error:', error);
      if (error.message === 'You are not a member of this group') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getGroupStats(req, res) {
    try {
      const groupId = parseInt(req.params.groupId);
      const { period = 'all' } = req.query;

      const stats = await groupService.getGroupStats(groupId, req.user.id, period);

      res.json(stats);
    } catch (error) {
      console.error('Get group stats error:', error);
      if (error.message === 'You are not a member of this group') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new GroupController(); 