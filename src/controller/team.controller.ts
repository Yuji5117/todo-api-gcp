import { Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../types";

export const getAllTeam = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ message: "userId are required." });
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
    console.log("Team get error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getTeamById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "teamId are required." });
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
    console.log("Team created error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const createTeam = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { name } = req.body;

  if (!userId || !name) {
    res.status(400).json({ message: "userId and name are required." });
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
    res.status(500).json({ message: "Internal server error." });
  }
};
