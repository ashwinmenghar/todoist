import express from "express";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import usersRoutes from "./routes/user.routes.js";
import { DB } from "./utils/connect.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Dummy route for testing
app.get("/", (_, res) => res.send("Hello world"));

// Projects routes
app.use("/api/v1/project", projectRoutes);

// Tasks routes
app.use("/api/v1/task", taskRoutes);

// Comments routes
app.use("/api/v1/comment", commentRoutes);

// Users routes
app.use("/api/v1/user", usersRoutes);

// Listen
app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));
