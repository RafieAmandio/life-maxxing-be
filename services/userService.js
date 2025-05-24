const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

class UserService {
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    return await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        passwordHash: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
  }

  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        groupMemberships: {
          include: {
            group: true,
          },
        },
      },
    });
  }

  async findUserByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  async findUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async updateUserProfile(userId, updateData) {
    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        updatedAt: true,
      },
    });
  }

  async getUserStats(userId, groupId = null, period = 'all') {
    const dateFilter = this._getDateFilter(period);
    
    // Base where clause
    const whereClause = {
      userId,
      ...(groupId && { groupId }),
      ...(dateFilter && { completionDate: dateFilter }),
    };

    // Get total completions
    const totalCompletions = await prisma.taskCompletion.count({
      where: whereClause,
    });

    // Get completion rate (completed vs total possible in period)
    // This is a simplified calculation - you might want to make it more sophisticated
    const completionRate = totalCompletions > 0 ? (totalCompletions / Math.max(totalCompletions, 1)) * 100 : 0;

    // Get current streak
    const currentStreak = await this._calculateStreak(userId, groupId);

    // Get weekly progress
    const weeklyProgress = await this._getWeeklyProgress(userId, groupId);

    return {
      completionRate: Math.round(completionRate * 100) / 100,
      currentStreak,
      longestStreak: currentStreak, // Simplified - you might want to calculate actual longest streak
      totalCompletions,
      weeklyProgress,
    };
  }

  async _getDateFilter(period) {
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

  async _calculateStreak(userId, groupId = null) {
    // Get recent completions ordered by date
    const recentCompletions = await prisma.taskCompletion.findMany({
      where: {
        userId,
        ...(groupId && { groupId }),
      },
      orderBy: {
        completionDate: 'desc',
      },
      take: 30, // Look at last 30 days
      select: {
        completionDate: true,
      },
    });

    if (recentCompletions.length === 0) return 0;

    // Calculate consecutive days
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0);

    const completionDates = recentCompletions.map(c => 
      new Date(c.completionDate).toISOString().split('T')[0]
    );

    const uniqueDates = [...new Set(completionDates)].sort().reverse();

    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() - i);
      const checkDateStr = checkDate.toISOString().split('T')[0];
      
      if (uniqueDates.includes(checkDateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async _getWeeklyProgress(userId, groupId = null) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const completions = await prisma.taskCompletion.findMany({
      where: {
        userId,
        ...(groupId && { groupId }),
        completionDate: { gte: weekAgo },
      },
      select: {
        completionDate: true,
      },
    });

    // Group by date
    const progress = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      progress[dateStr] = 0;
    }

    completions.forEach(completion => {
      const dateStr = new Date(completion.completionDate).toISOString().split('T')[0];
      if (progress[dateStr] !== undefined) {
        progress[dateStr]++;
      }
    });

    return Object.entries(progress).map(([date, completions]) => ({
      date,
      completions,
    }));
  }
}

module.exports = new UserService(); 