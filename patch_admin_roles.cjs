const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Props
code = code.replace(
  'onRemoveOperatorInvite: (email: string) => void;',
  'onRemoveOperatorInvite: (email: string) => void;\n  currentUser?: AuthUser | null;\n  onUpdateUsers?: (users: AuthUser[]) => void;'
);

code = code.replace(
  'onRemoveOperatorInvite\n}: AdminDashboardProps) {',
  'onRemoveOperatorInvite,\n  currentUser,\n  onUpdateUsers\n}: AdminDashboardProps) {'
);

code = code.replace(
  'onRemoveOperatorInvite\n}: AdminDashboardProps) {', // Try alternative
  'onRemoveOperatorInvite,\n  currentUser,\n  onUpdateUsers\n}: AdminDashboardProps) {'
);

// We should replace Regional Admin 1 -> Regional Director 1
code = code.replace(/Regional Admin/g, 'Regional Director');
code = code.replace(/Regional Admins/g, 'Regional Directors');
code = code.replace(/regional admin/g, 'regional director');

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
