import { Router } from "express";
import {
  addTeamMemberController,
  createTeamController,
  deleteTeamController,
  getAllTeamController,
  getTeamByIdController,
  updateTeamController,
} from "../controller/team.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, getAllTeamController);
router.get("/:id", authenticateToken, getTeamByIdController);
router.post("/", authenticateToken, createTeamController);
router.patch("/:id", authenticateToken, updateTeamController);
router.delete("/:id", authenticateToken, deleteTeamController);
router.post("/:teamId/members", authenticateToken, addTeamMemberController);

export default router;
