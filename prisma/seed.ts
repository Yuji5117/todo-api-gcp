import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create User
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alice@example.com",
        password: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        password: await bcrypt.hash("bobpassword", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "charlie@example.com",
        password: await bcrypt.hash("charliepass", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "dave@example.com",
        password: await bcrypt.hash("davepass", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "eve@example.com",
        password: await bcrypt.hash("evepass", 10),
      },
    }),
  ]);

  // Create team
  const teamA = await prisma.team.create({ data: { name: "Team A" } });
  const teamB = await prisma.team.create({ data: { name: "Team B" } });

  // Add team member
  await prisma.teamMember.createMany({
    data: [
      { teamId: teamA.id, userId: users[0].id },
      { teamId: teamA.id, userId: users[1].id },
      { teamId: teamA.id, userId: users[2].id },
      { teamId: teamB.id, userId: users[1].id },
      { teamId: teamB.id, userId: users[3].id },
      { teamId: teamB.id, userId: users[4].id },
    ],
  });

  // Create Projects
  const projectA = await prisma.project.create({
    data: {
      name: "Project Alpha",
      description: "First project for Team A",
      teamId: teamA.id,
    },
  });
  const projectB = await prisma.project.create({
    data: {
      name: "Project Beta",
      description: "First project for Team B",
      teamId: teamB.id,
    },
  });

  // Create Tasks
  const taskA1 = await prisma.task.create({
    data: {
      title: "Design UI",
      description: "Create user interface design",
      projectId: projectA.id,
    },
  });
  const taskA2 = await prisma.task.create({
    data: {
      title: "Set up database",
      description: "Initialize database schema",
      projectId: projectA.id,
    },
  });
  const taskB1 = await prisma.task.create({
    data: {
      title: "Write API",
      description: "Develop backend APIs",
      projectId: projectB.id,
    },
  });

  // Assign member
  await prisma.taskAssignee.createMany({
    data: [
      { taskId: taskA1.id, teamMemberId: 1 },
      { taskId: taskA2.id, teamMemberId: 2 },
      { taskId: taskB1.id, teamMemberId: 4 },
    ],
  });

  // Comment
  await prisma.comment.createMany({
    data: [
      {
        taskId: taskA1.id,
        userId: users[0].id,
        content: "Started working on UI",
      },
      {
        taskId: taskA2.id,
        userId: users[1].id,
        content: "Database set up complete",
      },
      {
        taskId: taskB1.id,
        userId: users[3].id,
        content: "Working on API endpoints",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
