const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const updateUsersRoute = `
app.post('/api/users/update', async (req, res) => {
  try {
    const { users } = req.body;
    if (!Array.isArray(users)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    
    if (pool) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const u of users) {
          await client.query(
            \`UPDATE app_users 
             SET is_blocked = $1, dashboard_number = $2
             WHERE id = $3\`,
            [u.isBlocked || false, u.dashboardNumber || null, u.id]
          );
        }
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } else {
      // Memory update
      users.forEach(u => {
        const found = inMemoryUsers.find(x => x.id === u.id);
        if (found) {
          found.isBlocked = u.isBlocked;
          found.dashboardNumber = u.dashboardNumber;
        }
      });
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating users:', err);
    res.status(500).json({ error: 'Failed to update users' });
  }
});
`;

content = content.replace(
  'app.post(\'/api/onboard\', async (req, res) => {',
  updateUsersRoute + '\napp.post(\'/api/onboard\', async (req, res) => {'
);

fs.writeFileSync('server.ts', content);

let storeContent = fs.readFileSync('src/store.ts', 'utf8');
storeContent = storeContent.replace(
  'public updateUsers(users: AuthUser[]) {\n    this.state.users = users;\n    this.saveState();\n  }',
  `public async updateUsers(users: AuthUser[]) {
    this.state.users = users;
    this.saveState();
    try {
      await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users })
      });
    } catch (e) {
      console.error('Failed to sync users update:', e);
    }
  }`
);
fs.writeFileSync('src/store.ts', storeContent);
