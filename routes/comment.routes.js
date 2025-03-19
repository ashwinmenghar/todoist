import express from "express";
import {
  createComment,
  deleteComment,
  findComment,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

// Create new comment
router.post("/", verifyToken, createComment);

// Get comments by projectId or taskId
router.get("/", verifyToken, findComment);

// Update a comment
router.patch("/:id", verifyToken, updateComment);

// Delete a comment
router.delete("/:id", verifyToken, deleteComment);

export default router;
