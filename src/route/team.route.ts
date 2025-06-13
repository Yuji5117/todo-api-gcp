import { Router } from "express";
import {
  addTeamMember,
  createTeam,
  deleteTeam,
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
router.delete("/:id", authenticateToken, deleteTeam);
router.post("/:teamId/members", authenticateToken, addTeamMember);

export default router;
