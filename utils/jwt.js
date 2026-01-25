import jwt from "jsonwebtoken";

export const SECRET = "ocs-secret";

export function signToken(user) {
  return jwt.sign(
    { userid: user.userid, role: user.role },
    SECRET,
    { expiresIn: "15m" }
  );
}
