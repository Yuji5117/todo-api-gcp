import { Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../types";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/sendResponse";

export const getAllTeam = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    throw new AppError("userId is required.", 400);
  }

  const teams = await prisma.team.findMany({
    where: { TeamMembers: { some: { userId: parseInt(userId, 10) } } },
    include: { TeamMembers: true },
  });

  sendSuccess(res, "Teams retrieved successfully.", teams);
};

export const getTeamById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("teamId is required.", 400);
  }

  const team = await prisma.team.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });

  sendSuccess(res, "A team retrieved successfully.", team);
};

export const createTeam = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { name } = req.body;

  if (!userId || !name) {
    throw new AppError("userId and name are required.", 400);
  }

  const newTeam = await prisma.team.create({ data: { name } });

  const newTeamMember = await prisma.teamMember.create({
    data: { userId: parseInt(userId, 10), teamId: newTeam.id, role: "owner" },
  });

  sendSuccess(
    res,
    "Team was created successfully.",
    {
      newTeam,
      newTeamMember,
    },
    201
  );
};

export const updateTeam = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id: teamId } = req.params;
  const { name } = req.body;
  if (!userId || !teamId || !name) {
    throw new AppError("teamId and name are required.", 400);
  }

  const isMember = await prisma.teamMember.findFirst({
    where: { teamId: parseInt(teamId, 10), userId: parseInt(userId, 10) },
  });

  if (!isMember) {
    throw new AppError(`This userId is not a member `);
  }

  const updatedTeam = await prisma.team.update({
    where: { id: parseInt(teamId, 10) },
    data: {
      name,
    },
  });

  sendSuccess(res, "Team was updated successfully.", updatedTeam);
};
