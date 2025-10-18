import express from "express";
import beatRouter from "./routes/beats";

const app = express();

app.get("/", (req, res) => res.send("Hello from Express + TypeScript!"));
app.use("/beats", beatRouter);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
