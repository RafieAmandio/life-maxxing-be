const prisma = require('../lib/prisma');
const crypto = require('crypto');

class GroupService {
  generateInviteCode() {
    return crypto.randomBytes(5).toString('hex').toUpperCase();
  }

  async createGroup(groupData, creatorId) {
    const inviteCode = this.generateInviteCode();
    
    return await prisma.group.create({
      data: {
        name: groupData.name,
        description: groupData.description,
        inviteCode,
        createdById: creatorId,
        members: {
          create: {
            userId: creatorId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async joinGroup(inviteCode, userId) {
    const group = await prisma.group.findUnique({
      where: { inviteCode },
      include: {
        members: true,
      },
    });

    if (!group) {
      throw new Error('Invalid invite code');
    }

    if (group.members.length >= group.maxMembers) {
      throw new Error('Group is full');
    }

    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new Error('Already a member of this group');
    }

    const membership = await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId,
      },
      include: {
        group: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return membership;
  }

  async getUserGroups(userId) {
    return await prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            _count: {
              select: { members: true },
            },
            creator: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async getGroupById(groupId, userId) {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this group');
    }

    return await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
        dailyTasks: {
          where: { isActive: true },
          include: {
            creator: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async leaveGroup(groupId, userId) {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      include: {
        group: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this group');
    }

    if (membership.group.createdById === userId && membership.group.members.length > 1) {
      const nextOwner = membership.group.members.find(
        member => member.userId !== userId && member.role === 'ADMIN'
      ) || membership.group.members.find(member => member.userId !== userId);

      if (nextOwner) {
        await prisma.group.update({
          where: { id: groupId },
          data: { createdById: nextOwner.userId },
        });

        await prisma.groupMember.update({
          where: { id: nextOwner.id },
          data: { role: 'ADMIN' },
        });
      }
    }

    if (membership.group.members.length === 1) {
      await prisma.group.delete({
        where: { id: groupId },
      });
    } else {
      await prisma.groupMember.delete({
        where: { id: membership.id },
      });
    }

    return { message: 'Successfully left the group' };
  }

  async getGroupStats(groupId, userId, period = 'all') {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this group');
    }

    const dateFilter = this._getDateFilter(period);
    
    const totalCompletions = await prisma.taskCompletion.count({
      where: {
        groupId,
        ...(dateFilter && { completionDate: dateFilter }),
      },
    });

    const activeTasks = await prisma.dailyTask.count({
      where: { groupId, isActive: true },
    });

    const groupMembers = await prisma.groupMember.count({
      where: { groupId },
    });

    const possibleCompletions = activeTasks * groupMembers * (period === 'week' ? 7 : period === 'month' ? 30 : 1);
    const completionRate = possibleCompletions > 0 ? (totalCompletions / possibleCompletions) * 100 : 0;

    const memberStats = await this._getMemberStats(groupId, dateFilter);
    const taskStats = await this._getTaskStats(groupId, dateFilter);

    return {
      groupStats: {
        totalTasks: activeTasks,
        completionRate: Math.round(completionRate * 100) / 100,
        totalCompletions,
      },
      memberStats,
      taskStats,
    };
  }

  async _getMemberStats(groupId, dateFilter) {
    const members = await prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const memberStats = [];

    for (const member of members) {
      const completions = await prisma.taskCompletion.count({
        where: {
          userId: member.userId,
          groupId,
          ...(dateFilter && { completionDate: dateFilter }),
        },
      });

      memberStats.push({
        user: member.user,
        completionCount: completions,
        role: member.role,
      });
    }

    return memberStats.sort((a, b) => b.completionCount - a.completionCount);
  }

  async _getTaskStats(groupId, dateFilter) {
    const tasks = await prisma.dailyTask.findMany({
      where: { groupId, isActive: true },
      include: {
        completions: {
          where: dateFilter ? { completionDate: dateFilter } : {},
        },
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return tasks.map(task => ({
      task: {
        id: task.id,
        title: task.title,
        creator: task.creator,
      },
      completionCount: task.completions.length,
    })).sort((a, b) => b.completionCount - a.completionCount);
  }

  _getDateFilter(period) {
    const now = new Date();
    
    switch (period) {
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return { gte: weekAgo };
      
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return { gte: monthAgo };
      
      default:
        return null;
    }
  }
}

module.exports = new GroupService(); 