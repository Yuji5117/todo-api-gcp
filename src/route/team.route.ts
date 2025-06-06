import { Router } from "express";
import { getAllTeam } from "../controller/team.controller";

const router = Router();

// Get all teams that you are joinning
router.get("/", getAllTeam);

// get a team by id

// create team

// update team

// delete team

export default router;
