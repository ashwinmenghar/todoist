import express from "express";
import {
  createTask,
  findTask,
  removeTask,
  updateTask,
} from "../controllers/task.controller.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

// Get task
router.get("/", verifyToken, findTask);

// Create a task
router.post("/", verifyToken, createTask);

// Update a task by id
router.patch("/:id", verifyToken, updateTask);

// Remove task by id
router.delete("/:id", verifyToken, removeTask);

export default router;
