import app from "./app.js";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const PORT = process.env.PORT || 3000;

// Configure the PostgreSQL connection pool
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,
  ssl: {
    rejectUnauthorized: false,
    require: true,
  },
});

// Test database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to database successfully....");
    client.release();
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server starts listening on port ${PORT}....`);
});

export default pool;
