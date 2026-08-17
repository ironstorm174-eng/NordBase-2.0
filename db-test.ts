import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

async function testDB() {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) {
    console.log("No database connection URL (DATABASE_URL / POSTGRES_URL) found in environment");
    return;
  }
  
  const pool = new Pool({
    connectionString: dbUrl,
  });

  try {
    const res = await pool.query('SELECT NOW() as time');
    console.log("Successfully connected to Neon! Server time:", res.rows[0].time);
    
    // Check tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables in DB:", tables.rows.map(r => r.table_name));

    const users = await pool.query('SELECT COUNT(*) FROM app_users');
    console.log("Users count:", users.rows[0].count);

  } catch (e) {
    console.error("Database connection error:", e);
  } finally {
    await pool.end();
  }
}

testDB();
