import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("DELETE FROM app_users WHERE email='ironstorm174@gmail.com' AND id NOT IN (SELECT id FROM app_users WHERE email='ironstorm174@gmail.com' LIMIT 1);", (err, res) => {
  if (err) console.error(err);
  else console.log("Deleted duplicate rows: " + res.rowCount);
  pool.end();
});
