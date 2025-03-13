import express from "express";
import {
  createProject,
  findAllProjects,
  findProject,
  removeAllProject,
  removeProject,
  updateProject,
} from "../controllers/project.controller.js";

const router = express.Router();

// Create a project
router.post("/", createProject);

// Update a project
router.put("/:id", updateProject);

// Find a project
router.get("/:id", findProject);

// Find all projects
router.get("/", findAllProjects);

// Remove a project
router.delete("/:id", removeProject);

// Remove all projects
router.delete("/", removeAllProject);

export default router;
