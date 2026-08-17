const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `  if (existingRoleUser) {
    if (existingRoleUser.isBlocked) {
      return { error: 'Access denied. Your account is blocked. Please contact support.' };
    }
    if ((targetRole === 'operator' || targetRole === 'regional_admin') && existingRoleUser.dashboardNumber && existingRoleUser.dashboardNumber !== dashboardNumber) {
      return { error: 'Invalid Dashboard Number.' };
    }

    if (existingRoleUser.password && password && existingRoleUser.password !== password) {`;

content = content.replace(`  if (existingRoleUser) {
    if (existingRoleUser.password && password && existingRoleUser.password !== password) {`, replacement);

fs.writeFileSync('server.ts', content);
