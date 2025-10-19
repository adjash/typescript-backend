import express from "express";
import type { Request, Response } from "express";
import SQLInstance from "../utils/sql";

const router = express.Router();

const db = new SQLInstance("db/db.db");

router.get("/", (req: Request, res: Response) => {
  res.send("GET /users - List all users");
});

router.get("/profile", (req: Request, res: Response) => {
  res.send("GET /users/profile - Get user profile");
});

router.post("/create", async (req: Request, res: Response) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).send("Missing required fields");
  }

  try {
    await db.insertRow(
      "user",
      ["username", "name", "password"],
      [username, name, password]
    );
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).send("Failed to create user");
  }
});

router.put("/update", async (req: Request, res: Response) => {
  const { username, name } = req.body;

  if (!username || !name) {
    return res.status(400).send("Missing required fields");
  }

  try {
    await db.updateRow("user", { name }, "username = ?", [username]);
    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Failed to update user");
  }
});

router.delete("/delete", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const user: any = await new Promise((resolve, reject) => {
      db.db.get(
        "SELECT password FROM user WHERE username = ?",
        [username],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.password !== password) {
      return res.status(401).send("Incorrect password");
    }

    await db.deleteRow("user", "username = ?", [username]);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Failed to delete user");
  }
});

export default router;
