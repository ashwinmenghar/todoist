import express from "express";
import {
  createUser,
  // deleteUser,
  // updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// Create user
router.post("/", createUser);

// Update user
// router.put("/:id", updateUser);

// // Delete user
// router.delete("/:id", deleteUser);

export default router;
