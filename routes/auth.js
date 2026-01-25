import express from "express";
import { pool } from "../db.js";
import { signToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/auth/login", async (req, res) => {
  const { userid, password_md5 } = req.body;

  const result = await pool.query(
    "SELECT userid, role, password_hash FROM users WHERE userid = $1",
    [userid]
  );

  if (result.rows.length === 0)
    return res.status(401).json({ error: "Invalid credentials" });

  const user = result.rows[0];

  if (user.password_hash !== password_md5)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user);
  res.json({ token, role: user.role });
});

export default router;
