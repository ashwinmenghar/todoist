import express from "express";
import { login, register, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Update user
// router.put("/:id", updateUser);

// // Delete user
router.delete("/", verifyToken, deleteUser);

export default router;
