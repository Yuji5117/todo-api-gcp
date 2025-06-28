import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

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

export const updateTeam = async (
  prisma: PrismaClient,
  userId: number,
  teamId: number,
  name: string
) => {
  const isMember = await prisma.teamMember.findFirst({
    where: { teamId: teamId, userId: userId },
  });

  if (!isMember) {
    throw new AppError(`This userId is not a member `);
  }

  return await prisma.team.update({
    where: { id: teamId },
    data: {
      name,
    },
  });
};

export const deleteTeam = async (
  prisma: PrismaClient,
  userId: number,
  teamId: number
) => {
  const isMember = await prisma.teamMember.findFirst({
    where: { teamId: teamId, userId: userId },
  });

  if (!isMember) {
    throw new AppError(`This userId is not a member `);
  }

  await prisma.team.delete({
    where: { id: teamId },
  });
};

export const addTeamMember = async (
  prisma: PrismaClient,
  userId: number,
  teamId: number
) => {
  const exists = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        teamId: teamId,
        userId: userId,
      },
    },
  });

  if (exists) {
    throw new AppError("This user is already a member of the team.", 409);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  return await prisma.teamMember.create({
    data: { teamId: teamId, userId: userId },
  });
};
