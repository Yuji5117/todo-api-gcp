import { Router } from "express";
import { createTeam, getAllTeam } from "../controller/team.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Get all teams that you are joinning
router.get("/", authenticateToken, getAllTeam);

// get a team by id

// create team
router.post("/", authenticateToken, createTeam);

// update team

// delete team

export default router;
