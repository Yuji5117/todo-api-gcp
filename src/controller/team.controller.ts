import { NextFunction, Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../types";
import { AppError } from "../utils/AppError";

export const getAllTeam = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    throw new AppError("userId is required.", 400);
  }

  const teams = await prisma.team.findMany({
    where: { TeamMembers: { some: { userId: parseInt(userId, 10) } } },
    include: { TeamMembers: true },
  });

  res
    .status(200)
    .json({ message: "Teams retrieved successfully.", data: { teams } });
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

  res
    .status(200)
    .json({ message: "A team retrieved successfully.", data: { team } });
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

  res.status(201).json({
    message: "Team was created successfully.",
    data: {
      newTeam,
      newTeamMember,
    },
  });
};
