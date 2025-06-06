import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getAllTeam = (req: Request, res: Response) => {
  res.send("get all teams");
};

export const createTeam = async (req: Request, res: Response) => {
  const { userId, name } = req.body;

  if (!userId || !name) {
    res.status(400).json({ message: "userId and name are required." });
  }

  try {
    const newTeam = await prisma.team.create({ data: { name } });

    const newTeamMember = await prisma.teamMember.create({
      data: { userId, teamId: newTeam.id, role: "owner" },
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
