import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/users/me", auth, async (req, res) => {
  const { userid } = req.user;

  const result = await pool.query(
    "SELECT userid, role FROM users WHERE userid = $1",
    [userid]
  );

  res.json(result.rows[0]);
});

router.get("/users", auth, async (req, res) => {
  const { role } = req.user;

  if (role !== "admin")
    return res.status(403).json({ error: "Admin only" });

  const result = await pool.query(
    "SELECT userid, role FROM users"
  );

  res.json(result.rows);
});

export default router;
