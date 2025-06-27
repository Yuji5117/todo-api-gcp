import { Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../types";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/sendResponse";
import { getAllTeams } from "../service/team.service";

export const getAllTeamController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.userId;

  if (!userId) {
    throw new AppError("userId is required.", 400);
  }

  const teams = await getAllTeams(prisma, userId);

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
    data: { userId: parseInt(userId, 10), teamId: newTeam.id },
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

export const deleteTeam = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id: teamId } = req.params;

  if (!userId || !teamId) {
    throw new AppError("teamId and name are required.", 400);
  }

  const isMember = await prisma.teamMember.findFirst({
    where: { teamId: parseInt(teamId, 10), userId: parseInt(userId, 10) },
  });

  if (!isMember) {
    throw new AppError(`This userId is not a member `);
  }

  await prisma.team.delete({
    where: { id: parseInt(teamId, 10) },
  });

  res.status(204).send();
};

export const addTeamMember = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { userId } = req.body;
  const { teamId } = req.params;

  if (!userId || !teamId) {
    throw new AppError("teamId and userId are required.", 400);
  }

  const exists = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        teamId: parseInt(teamId, 10),
        userId: parseInt(userId, 10),
      },
    },
  });

  if (exists) {
    throw new AppError("This user is already a member of the team.", 409);
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const team = await prisma.team.findUnique({
    where: { id: parseInt(teamId, 10) },
  });

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  const newMember = await prisma.teamMember.create({
    data: { teamId: parseInt(teamId, 10), userId: parseInt(userId, 10) },
  });

  sendSuccess(res, "Added new Member successfully", newMember, 201);
};
