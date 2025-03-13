import express from "express";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (_, res) => res.send("Hello world"));
app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));
