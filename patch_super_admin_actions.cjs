const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const additionalActions = `
  const handleToggleBlock = (id: string, currentlyBlocked: boolean, name: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, isBlocked: !currentlyBlocked } : u
    );
    onUpdateUsers(updated);
    onAddAuditLog(
      currentlyBlocked ? "User Unblocked" : "User Blocked",
      directorTitle,
      "super_admin",
      "All",
      \`\${currentlyBlocked ? 'Unblocked' : 'Blocked'} partner \${name}\`
    );
  };

  const handleUpdateDashboardNumber = (id: string, newDash: string, name: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, dashboardNumber: newDash } : u
    );
    onUpdateUsers(updated);
    onAddAuditLog(
      "Dashboard Assigned",
      directorTitle,
      "super_admin",
      "All",
      \`Assigned dashboard \${newDash} to \${name}\`
    );
  };
`;

content = content.replace(
  'const handleUpdatePassword = (id: string, newPass: string) => {',
  additionalActions + '\n  const handleUpdatePassword = (id: string, newPass: string) => {'
);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content);
