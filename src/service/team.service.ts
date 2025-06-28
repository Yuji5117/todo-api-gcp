import { PrismaClient } from "@prisma/client";

export const getAllTeams = async (prisma: PrismaClient, userId: string) => {
  return await prisma.team.findMany({
    where: { TeamMembers: { some: { userId: parseInt(userId, 10) } } },
    include: { TeamMembers: true },
  });
};

export const getTeamById = async (prisma: PrismaClient, userId: string) => {
  return await prisma.team.findUnique({
    where: {
      id: parseInt(userId, 10),
    },
  });
};
