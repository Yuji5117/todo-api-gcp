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

export const createTeam = async (
  prisma: PrismaClient,
  userId: string,
  name: string
) => {
  const newTeam = await prisma.team.create({ data: { name } });

  const newTeamMember = await prisma.teamMember.create({
    data: { userId: parseInt(userId, 10), teamId: newTeam.id },
  });

  return {
    newTeam,
    newTeamMember,
  };
};
