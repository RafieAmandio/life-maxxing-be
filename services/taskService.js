const prisma = require('../lib/prisma');

class TaskService {
  async createDailyTask(taskData, creatorId) {
    // Check if user is a member of the group
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: taskData.groupId,
          userId: creatorId,
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this group');
    }

    return await prisma.dailyTask.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        groupId: taskData.groupId,
        createdById: creatorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async createPersonalTask(taskData, userId) {
    // Check if user is a member of the group
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: taskData.groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this group');
    }

    return await prisma.personalTask.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        userId,
        groupId: taskData.groupId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getGroupDailyTasks(groupId, userId) {
    // Check if user is a member of the group
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

    const today = new Date().toISOString().split('T')[0];
    
    return await prisma.dailyTask.findMany({
      where: {
        groupId,
        isActive: true,
      },
      include: {
        completions: {
          where: {
            completionDate: new Date(today),
          },
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getGroupPersonalTasks(groupId, userId) {
    // Check if user is a member of the group
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

    const today = new Date().toISOString().split('T')[0];

    return await prisma.personalTask.findMany({
      where: {
        groupId,
        userId,
        isActive: true,
      },
      include: {
        completions: {
          where: {
            completionDate: new Date(today),
          },
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateDailyTask(taskId, updateData, userId) {
    const task = await prisma.dailyTask.findUnique({
      where: { id: taskId },
      include: {
        group: {
          include: {
            members: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.group.members.length === 0) {
      throw new Error('You are not a member of this group');
    }

    // Only creator or group admin can update daily tasks
    const membership = task.group.members[0];
    if (task.createdById !== userId && membership.role !== 'ADMIN') {
      throw new Error('Only the task creator or group admin can update this task');
    }

    return await prisma.dailyTask.update({
      where: { id: taskId },
      data: updateData,
      include: {
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

  async updatePersonalTask(taskId, updateData, userId) {
    const task = await prisma.personalTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.userId !== userId) {
      throw new Error('You can only update your own personal tasks');
    }

    return await prisma.personalTask.update({
      where: { id: taskId },
      data: updateData,
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
  }

  async deleteDailyTask(taskId, userId) {
    const task = await prisma.dailyTask.findUnique({
      where: { id: taskId },
      include: {
        group: {
          include: {
            members: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.group.members.length === 0) {
      throw new Error('You are not a member of this group');
    }

    const membership = task.group.members[0];
    if (task.createdById !== userId && membership.role !== 'ADMIN') {
      throw new Error('Only the task creator or group admin can delete this task');
    }

    await prisma.dailyTask.delete({
      where: { id: taskId },
    });

    return { message: 'Daily task deleted successfully' };
  }

  async deletePersonalTask(taskId, userId) {
    const task = await prisma.personalTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.userId !== userId) {
      throw new Error('You can only delete your own personal tasks');
    }

    await prisma.personalTask.delete({
      where: { id: taskId },
    });

    return { message: 'Personal task deleted successfully' };
  }

  async completeTask(completionData, userId) {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if task exists and user has permission
    let task = null;
    if (completionData.dailyTaskId) {
      task = await prisma.dailyTask.findUnique({
        where: { id: completionData.dailyTaskId },
        include: {
          group: {
            include: {
              members: {
                where: { userId },
              },
            },
          },
        },
      });
    } else if (completionData.personalTaskId) {
      task = await prisma.personalTask.findUnique({
        where: { id: completionData.personalTaskId },
      });

      if (task && task.userId !== userId) {
        throw new Error('You can only complete your own personal tasks');
      }
    }

    if (!task) {
      throw new Error('Task not found');
    }

    // For daily tasks, check if user is a group member
    if (completionData.dailyTaskId && task.group.members.length === 0) {
      throw new Error('You are not a member of this group');
    }

    // Check if already completed today
    const existingCompletion = await prisma.taskCompletion.findFirst({
      where: {
        userId,
        dailyTaskId: completionData.dailyTaskId,
        personalTaskId: completionData.personalTaskId,
        completionDate: new Date(today),
      },
    });

    if (existingCompletion) {
      throw new Error('Task already completed today');
    }

    return await prisma.taskCompletion.create({
      data: {
        userId,
        dailyTaskId: completionData.dailyTaskId,
        personalTaskId: completionData.personalTaskId,
        groupId: completionData.groupId,
        proofImageUrl: completionData.proofImageUrl,
        notes: completionData.notes,
        completionDate: new Date(today),
      },
      include: {
        dailyTask: true,
        personalTask: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getGroupCompletions(groupId, userId, date = null) {
    // Check if user is a member of the group
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

    const targetDate = date ? new Date(date) : new Date();
    const dateStr = targetDate.toISOString().split('T')[0];

    return await prisma.taskCompletion.findMany({
      where: {
        groupId,
        completionDate: new Date(dateStr),
      },
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
        dailyTask: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        personalTask: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserCompletions(userId, groupId = null, date = null) {
    const targetDate = date ? new Date(date) : new Date();
    const dateStr = targetDate.toISOString().split('T')[0];

    return await prisma.taskCompletion.findMany({
      where: {
        userId,
        ...(groupId && { groupId }),
        completionDate: new Date(dateStr),
      },
      include: {
        dailyTask: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        personalTask: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async verifyCompletion(completionId, userId) {
    const completion = await prisma.taskCompletion.findUnique({
      where: { id: completionId },
      include: {
        group: {
          include: {
            members: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!completion) {
      throw new Error('Completion not found');
    }

    if (completion.group.members.length === 0) {
      throw new Error('You are not a member of this group');
    }

    if (completion.userId === userId) {
      throw new Error('You cannot verify your own completion');
    }

    if (completion.isVerified) {
      throw new Error('Completion already verified');
    }

    return await prisma.taskCompletion.update({
      where: { id: completionId },
      data: {
        isVerified: true,
        verifiedById: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        verifiedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        dailyTask: true,
        personalTask: true,
      },
    });
  }

  async getTaskById(taskId, type) {
    if (type === 'daily') {
      return await prisma.dailyTask.findUnique({
        where: { id: taskId },
        select: {
          id: true,
          groupId: true,
          title: true,
        },
      });
    } else if (type === 'personal') {
      return await prisma.personalTask.findUnique({
        where: { id: taskId },
        select: {
          id: true,
          groupId: true,
          title: true,
        },
      });
    }
    return null;
  }
}

module.exports = new TaskService(); 