import express from "express";
import userRouter from "./routes/user";
import beatRouter from "./routes/beats";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Hello from Express + TypeScript!");
});
app.use("/user", userRouter);
app.use("/beats", beatRouter);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
