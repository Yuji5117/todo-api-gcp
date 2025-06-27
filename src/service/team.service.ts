import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

export const getAllTeams = async (prisma: PrismaClient, userId: string) => {
  if (!userId) {
    throw new AppError("userId is required.", 400);
  }

  return await prisma.team.findMany({
    where: { TeamMembers: { some: { userId: parseInt(userId, 10) } } },
    include: { TeamMembers: true },
  });
};
