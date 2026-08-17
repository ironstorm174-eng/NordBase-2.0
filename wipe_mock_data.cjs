const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function wipe() {
  const client = await pool.connect();
  try {
    await client.query(`
      DELETE FROM app_users 
      WHERE (email LIKE '%@example.com' OR email LIKE '%@example.fr' OR email LIKE '%simulation%' OR name LIKE '%[Simulation]%' OR name LIKE '%[Test]%')
      AND id NOT IN ('user-super-01', 'user-super_admin');
    `);
    await client.query(`
      DELETE FROM specialists 
      WHERE phone LIKE '+351 920%' OR name LIKE '%[Simulation]%' OR name LIKE '%[Test]%';
    `);
    await client.query(`
      DELETE FROM jobs 
      WHERE description LIKE '%[Simulation]%' OR description LIKE '%[Test]%';
    `);
    console.log("Mock data wiped.");
  } finally {
    client.release();
    pool.end();
  }
}
wipe();
