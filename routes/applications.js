import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* GET /api/applications - Get applications (role-based) */
router.get("/applications", auth, async (req, res) => {
  const { role, userid } = req.user;

  if (role === "student") {
    // Student sees only their own applications
    const result = await pool.query(
      `SELECT a.profile_code, a.entry_number, a.status, p.company_name, p.designation
       FROM application a
       JOIN profile p ON a.profile_code = p.profile_code
       WHERE a.entry_number = $1`,
      [userid]
    );
    return res.json(result.rows);
  }

  if (role === "recruiter") {
    // Recruiter sees applications for their profiles
    const result = await pool.query(
      `SELECT a.profile_code, a.entry_number, a.status, p.company_name, p.designation
       FROM application a
       JOIN profile p ON a.profile_code = p.profile_code
       WHERE p.recruiter_email = $1`,
      [userid]
    );
    return res.json(result.rows);
  }

  if (role === "admin") {
    // Admin sees all applications
    const result = await pool.query(
      `SELECT a.profile_code, a.entry_number, a.status, p.company_name, p.designation
       FROM application a
       JOIN profile p ON a.profile_code = p.profile_code`
    );
    return res.json(result.rows);
  }

  res.status(403).json({ error: "Forbidden" });
});

/* GET /api/applications/student - Get logged-in student's applications */
router.get("/applications/student", auth, async (req, res) => {
  const { role, userid } = req.user;

  if (role !== "student")
    return res.status(403).json({ error: "Only students can view their applications" });

  const result = await pool.query(
    `SELECT a.profile_code, a.status, p.company_name, p.designation
     FROM application a
     JOIN profile p ON a.profile_code = p.profile_code
     WHERE a.entry_number = $1`,
    [userid]
  );

  res.json(result.rows);
});

/* GET /api/applications/profile/:profile_code - Get applications for a specific profile */
router.get("/applications/profile/:profile_code", auth, async (req, res) => {
  const { role, userid } = req.user;
  const { profile_code } = req.params;

  // Verify ownership for recruiter
  if (role === "recruiter") {
    const owner = await pool.query(
      `SELECT 1 FROM profile
       WHERE profile_code = $1 AND recruiter_email = $2`,
      [profile_code, userid]
    );

    if (!owner.rows.length)
      return res.status(403).json({ error: "Not your profile" });
  }

  const result = await pool.query(
    `SELECT a.profile_code, a.entry_number, a.status
     FROM application a
     WHERE a.profile_code = $1`,
    [profile_code]
  );

  res.json(result.rows);
});

/* POST /api/apply */
router.post("/apply", auth, async (req, res) => {
  const { role, userid } = req.user;
  const { profile_code } = req.body;

  if (role !== "student")
    return res.status(403).json({ error: "Only students can apply" });

  const accepted = await pool.query(
    `SELECT 1 FROM application
     WHERE entry_number = $1 AND status = 'Accepted'`,
    [userid]
  );

  if (accepted.rows.length)
    return res.status(400).json({ error: "Already accepted an offer" });

  // GPA eligibility check
  const userResult = await pool.query(
    `SELECT gpa FROM users WHERE userid = $1`,
    [userid]
  );

  const profileResult = await pool.query(
    `SELECT min_gpa FROM profile WHERE profile_code = $1`,
    [profile_code]
  );

  if (!profileResult.rows.length)
    return res.status(404).json({ error: "Profile not found" });

  const userGpa = userResult.rows[0]?.gpa;
  const minGpa = profileResult.rows[0]?.min_gpa || 0.0;

  if (userGpa === null || userGpa === undefined) {
    return res.status(403).json({ error: "GPA not set. Please update your profile." });
  }

  if (userGpa < minGpa) {
    return res.status(403).json({ 
      error: `GPA below requirement. Required: ${minGpa}, Your GPA: ${userGpa}` 
    });
  }

  await pool.query(
    `INSERT INTO application (profile_code, entry_number)
     VALUES ($1, $2)`,
    [profile_code, userid]
  );

  res.json({ status: "Applied" });
});

/* POST /api/application/change_status */
router.post("/application/change_status", auth, async (req, res) => {
  const { role, userid } = req.user;
  const { profile_code, entry_number, status } = req.body;

  if (role === "student")
    return res.status(403).json({ error: "Forbidden" });

  if (role === "recruiter") {
    const owner = await pool.query(
      `SELECT 1 FROM profile
       WHERE profile_code = $1 AND recruiter_email = $2`,
      [profile_code, userid]
    );

    if (!owner.rows.length)
      return res.status(403).json({ error: "Not your profile" });
  }

  await pool.query(
    `UPDATE application
     SET status = $1
     WHERE profile_code = $2 AND entry_number = $3`,
    [status, profile_code, entry_number]
  );

  res.json({ status: "Updated" });
});

/* POST /api/application/accept */
router.post("/application/accept", auth, async (req, res) => {
  const { role, userid } = req.user;
  const { profile_code } = req.body;

  if (role !== "student")
    return res.status(403).json({ error: "Forbidden" });

  const selected = await pool.query(
    `SELECT 1 FROM application
     WHERE profile_code = $1
     AND entry_number = $2
     AND status = 'Selected'`,
    [profile_code, userid]
  );

  if (!selected.rows.length)
    return res.status(400).json({ error: "Not selectable" });

  await pool.query(
    `UPDATE application
     SET status = 'Accepted'
     WHERE profile_code = $1 AND entry_number = $2`,
    [profile_code, userid]
  );

  res.json({ status: "Accepted" });
});

export default router;
