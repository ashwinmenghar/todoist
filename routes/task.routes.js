import express from "express";
import {
  createTask,
  findTask,
  removeTask,
  updateTask,
} from "../controllers/task.controller.js";

const router = express.Router();

// Get task
router.get("/", findTask);

// Create a task
router.post("/", createTask);

// Update a task by id
router.patch("/:id", updateTask);

// Remove task by id
router.delete("/:id", removeTask);

export default router;
