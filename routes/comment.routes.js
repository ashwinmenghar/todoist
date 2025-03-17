import express from "express";
import {
  createComment,
  deleteComment,
  findComment,
  updateComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

// Create new comment
router.post("/", createComment);

// Get comments by projectId or taskId
router.get("/", findComment);

// Update a comment
router.patch("/:id", updateComment);

// Delete a comment
router.delete("/:id", deleteComment);

export default router;
