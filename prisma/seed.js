const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      username: 'john_doe',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      username: 'jane_smith',
      passwordHash: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
    },
  });

  console.log('✅ Created sample users');

  const group = await prisma.group.upsert({
    where: { inviteCode: 'DEMO123' },
    update: {},
    create: {
      name: 'Fitness Buddies',
      description: 'Daily fitness and wellness accountability group',
      inviteCode: 'DEMO123',
      createdById: user1.id,
    },
  });

  await prisma.groupMember.upsert({
    where: {
      groupId_userId: {
        groupId: group.id,
        userId: user1.id,
      },
    },
    update: {},
    create: {
      groupId: group.id,
      userId: user1.id,
      role: 'ADMIN',
    },
  });

  await prisma.groupMember.upsert({
    where: {
      groupId_userId: {
        groupId: group.id,
        userId: user2.id,
      },
    },
    update: {},
    create: {
      groupId: group.id,
      userId: user2.id,
      role: 'MEMBER',
    },
  });

  console.log('✅ Created sample group and memberships');

  await prisma.dailyTask.create({
    data: {
      title: 'Morning Workout',
      description: 'Complete a 30-minute workout session',
      groupId: group.id,
      createdById: user1.id,
    },
  });

  console.log('✅ Created sample daily tasks');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 