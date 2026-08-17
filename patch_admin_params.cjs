const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

code = code.replace(
  'onRemoveOperatorInvite\n}: AdminDashboardProps) {',
  'onRemoveOperatorInvite,\n  currentUser,\n  onUpdateUsers\n}: AdminDashboardProps) {'
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
