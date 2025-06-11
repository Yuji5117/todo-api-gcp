import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  status: number = 200
) => {
  return res.status(status).json({ success: true, message, data });
};
