import { Router } from "express";
import {
  createTeam,
  getAllTeam,
  getTeamById,
  updateTeam,
} from "../controller/team.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, getAllTeam);
router.get("/:id", authenticateToken, getTeamById);
router.post("/", authenticateToken, createTeam);
router.patch("/:id", authenticateToken, updateTeam);

// delete team

export default router;
