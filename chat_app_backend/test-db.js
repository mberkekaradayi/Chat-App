const pool = require("./config/db");

(async () => {
  try {
    const res = await pool.query("SELECT NOW()"); // Query the current time
    console.log("Connected to database:", res.rows[0]);
  } catch (err) {
    console.error("Database connection error:", err);
  } finally {
    pool.end();
  }
})();
