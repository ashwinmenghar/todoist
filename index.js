import express from "express";
import projectRoute from "./routes/project.routes.js";

const app = express();
const PORT = 8000;

app.use(express.json());

// Dummy route for testing
app.get("/", (_, res) => res.send("Hello world"));

// Projects routes
app.use("/api/v1/project", projectRoute);

app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));
