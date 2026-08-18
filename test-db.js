import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query("UPDATE app_users SET role='super_admin' WHERE email='timeplace.internal@gmail.com'", (err, res) => {
  if (err) console.error(err);
  else console.log("Updated timeplace.internal@gmail.com rows: " + res.rowCount);
  pool.end();
});
