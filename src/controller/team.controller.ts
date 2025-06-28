import { Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../types";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/sendResponse";
import {
  addTeamMember,
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
} from "../service/team.service";

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

export const getTeamByIdController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("teamId is required.", 400);
  }

  const team = await getTeamById(prisma, id);

  sendSuccess(res, "A team retrieved successfully.", team);
};

export const createTeamController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.userId;
  const { name } = req.body;

  if (!userId || !name) {
    throw new AppError("userId and name are required.", 400);
  }

  const result = await createTeam(prisma, userId, name);

  sendSuccess(res, "Team was created successfully.", result, 201);
};

export const updateTeamController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.userId;
  const { id: teamId } = req.params;
  const { name } = req.body;
  if (!userId || !teamId || !name) {
    throw new AppError("teamId and name are required.", 400);
  }

  const result = await updateTeam(
    prisma,
    parseInt(userId, 10),
    parseInt(teamId, 10),
    name
  );

  sendSuccess(res, "Team was updated successfully.", result);
};

export const deleteTeamController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.userId;
  const { id: teamId } = req.params;

  if (!userId || !teamId) {
    throw new AppError("teamId and name are required.", 400);
  }

  await deleteTeam(prisma, parseInt(userId, 10), parseInt(teamId, 10));

  res.status(204).send();
};

export const addTeamMemberController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { userId } = req.body;
  const { teamId } = req.params;

  if (!userId || !teamId) {
    throw new AppError("teamId and userId are required.", 400);
  }

  const result = await addTeamMember(
    prisma,
    parseInt(userId, 10),
    parseInt(teamId, 10)
  );

  sendSuccess(res, "Added new Member successfully", result, 201);
};
