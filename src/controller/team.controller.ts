import { NextFunction, Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../types";
import { AppError } from "../utils/AppError";

export const getAllTeam = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  if (!userId) {
    next(new AppError("userId is required.", 400));
    return;
  }

  try {
    const teams = await prisma.team.findMany({
      where: { TeamMembers: { some: { userId: parseInt(userId, 10) } } },
      include: { TeamMembers: true },
    });

    res
      .status(200)
      .json({ message: "Teams retrieved successfully.", data: { teams } });
  } catch (error) {
    next(new AppError("Internal server error.", 500));
  }
};

export const getTeamById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    next(new AppError("teamId is required.", 400));
    return;
  }

  try {
    const team = await prisma.team.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    res
      .status(200)
      .json({ message: "A team retrieved successfully.", data: { team } });
  } catch (error) {
    console.error("Team created error:", error);
    next(new AppError("Internal server error.", 500));
  }
};

export const createTeam = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const { name } = req.body;

  if (!userId || !name) {
    next(new AppError("userId and name are required.", 400));
    return;
  }

  try {
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
  } catch (error) {
    console.log("Team created error:", error);
    next(new AppError("Internal server error.", 500));
  }
};
