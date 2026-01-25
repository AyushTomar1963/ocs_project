import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* GET /api/profiles */
router.get("/profiles", auth, async (req, res) => {
  const { role, userid } = req.user;

  if (role === "recruiter") {
    const result = await pool.query(
      `SELECT profile_code, company_name, designation
       FROM profile WHERE recruiter_email = $1`,
      [userid]
    );
    return res.json(result.rows);
  }

  const result = await pool.query(
    "SELECT profile_code, company_name, designation FROM profile"
  );
  res.json(result.rows);
});

/* GET /api/profiles/recruiter - Get recruiter's profiles */
router.get("/profiles/recruiter", auth, async (req, res) => {
  const { role, userid } = req.user;

  if (role !== "recruiter")
    return res.status(403).json({ error: "Recruiter only" });

  const result = await pool.query(
    `SELECT profile_code, company_name, designation
     FROM profile WHERE recruiter_email = $1`,
    [userid]
  );
  res.json(result.rows);
});

/* POST /api/profiles */
router.post("/profiles", auth, async (req, res) => {
  const { role, userid } = req.user;
  const { company_name, designation, recruiter_email } = req.body;

  if (role === "student")
    return res.status(403).json({ error: "Forbidden" });

  const owner = role === "admin" ? recruiter_email : userid;

  await pool.query(
    `INSERT INTO profile (recruiter_email, company_name, designation)
     VALUES ($1, $2, $3)`,
    [owner, company_name, designation]
  );

  res.json({ status: "Profile created" });
});

export default router;
