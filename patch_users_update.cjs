const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `
        for (const u of users) {
          // Check if user exists
          const res = await client.query('SELECT id FROM app_users WHERE id = $1', [u.id]);
          if (res.rows.length > 0) {
            // Update
            await client.query(
              \`UPDATE app_users 
               SET is_blocked = $1, dashboard_number = $2, name = $3, phone = $4, email = $5, role = $6, password = $7
               WHERE id = $8\`,
              [u.isBlocked || false, u.dashboardNumber || null, u.name || '', u.phone || '', u.email || '', u.role || 'customer', u.password || null, u.id]
            );
          } else {
            // Insert
            await client.query(
              \`INSERT INTO app_users (id, email, phone, name, role, specialist_status, dashboard_number, password, is_blocked)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)\`,
              [u.id, u.email || '', u.phone || '', u.name || '', u.role || 'customer', u.specialistStatus || 'not_requested', u.dashboardNumber || null, u.password || null, u.isBlocked || false]
            );
          }
        }`;

code = code.replace(
  /for \(const u of users\) \{[\s\S]*?WHERE id = \$3\`,[\s\S]*?\[u\.isBlocked \|\| false, u\.dashboardNumber \|\| null, u\.id\][\s\S]*?\);[\s\S]*?\}/,
  replacement
);

// also for in-memory
const inMemoryReplacement = `
      users.forEach(u => {
        const foundIndex = inMemoryUsers.findIndex(x => x.id === u.id);
        if (foundIndex !== -1) {
          inMemoryUsers[foundIndex] = { ...inMemoryUsers[foundIndex], ...u };
        } else {
          inMemoryUsers.push(u);
        }
      });
`;
code = code.replace(
  /users\.forEach\(u => \{[\s\S]*?const found = inMemoryUsers\.find\(x => x\.id === u\.id\);[\s\S]*?if \(found\) \{[\s\S]*?found\.isBlocked = u\.isBlocked;[\s\S]*?found\.dashboardNumber = u\.dashboardNumber;[\s\S]*?\}[\s\S]*?\}\);/,
  inMemoryReplacement
);

fs.writeFileSync('server.ts', code);
