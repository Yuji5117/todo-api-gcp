import { Request, Response } from "express";

export const getAllTeam = (req: Request, res: Response) => {
  res.send("get all teams");
};
