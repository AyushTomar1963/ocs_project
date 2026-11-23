import "dotenv/config";
import jwt from "jsonwebtoken";

// The signing secret comes from the environment (see .env.example). There is deliberately
// no fallback value: a default in the source would let anyone who can read the code forge tokens.
const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  throw new Error(
    "JWT_SECRET is missing or shorter than 32 characters. Generate one with: " +
      "node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
  );
}

export const SECRET = secret;

export function signToken(user) {
  return jwt.sign(
    { userid: user.userid, role: user.role },
    SECRET,
    { expiresIn: "15m" }
  );
}
