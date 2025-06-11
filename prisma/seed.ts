import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Set Up Users
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      password: await bcrypt.hash("password123", 10),
    },
  });
  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      password: await bcrypt.hash("bobpassword", 10),
    },
  });
  const charlie = await prisma.user.create({
    data: {
      email: "charlie@example.com",
      password: await bcrypt.hash("charliepass", 10),
    },
  });

  // Set Up Teams
  const teamA = await prisma.team.create({ data: { name: "Team A" } });
  const teamB = await prisma.team.create({ data: { name: "Team B" } });

  await prisma.teamMember.createMany({
    data: [
      // Team A
      { teamId: teamA.id, userId: alice.id },
      { teamId: teamA.id, userId: bob.id },
      // Team B
      { teamId: teamB.id, userId: bob.id },
      { teamId: teamB.id, userId: charlie.id },
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
