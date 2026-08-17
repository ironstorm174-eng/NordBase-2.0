const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `      if (existingRoleUser) {
        if (existingRoleUser.is_blocked) {
          return { error: 'Access denied. Your account is blocked. Please contact support.' };
        }
        if ((targetRole === 'operator' || targetRole === 'regional_admin') && existingRoleUser.dashboard_number && existingRoleUser.dashboard_number !== dashboardNumber) {
          return { error: 'Invalid Dashboard Number.' };
        }

        // Verify password if provided`;

content = content.replace(`      if (existingRoleUser) {
        // Verify password if provided`, replacement);

fs.writeFileSync('server.ts', content);
