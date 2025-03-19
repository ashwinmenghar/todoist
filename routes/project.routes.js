import express from "express";
import {
  createProject,
  findAllProjects,
  findProject,
  removeAllProject,
  removeProject,
  updateProject,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

// Create a project
router.post("/", verifyToken, createProject);

// Update a project
router.patch("/:id", verifyToken, updateProject);

// Find a project
router.get("/:id", verifyToken, findProject);

// Find all projects
router.get("/", verifyToken, findAllProjects);

// Remove a project
router.delete("/:id", verifyToken, removeProject);

// Remove all projects
router.delete("/", verifyToken, removeAllProject);

export default router;
