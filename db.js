import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

/*
 Single pool = uniform connectivity
 All queries go through this object
*/
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
