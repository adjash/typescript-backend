import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("beats / route");
});

router.get("/about", (req: Request, res: Response) => {
  res.send("beats / about route");
});

export { router as beatRouter };
