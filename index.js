import express from "express";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();
const PORT = 8000;

app.use(express.json());

// Dummy route for testing
app.get("/", (_, res) => res.send("Hello world"));

// Projects routes
app.use("/api/v1/project", projectRoutes);

// Tasks routes
app.use("/api/v1/task", taskRoutes);

// Listen
app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));
