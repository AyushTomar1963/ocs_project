import jwt from "jsonwebtoken";
import { SECRET } from "../utils/jwt.js";

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { userid, role }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
