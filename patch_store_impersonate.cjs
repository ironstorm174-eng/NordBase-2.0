const fs = require('fs');

// 1. Update src/types.ts
let typesContent = fs.readFileSync('src/types.ts', 'utf8');
if (!typesContent.includes('impersonatedUser?:')) {
  typesContent = typesContent.replace(
    'currentUser: AuthUser | null;',
    'currentUser: AuthUser | null;\n  impersonatedUser?: AuthUser | null;\n  superAdminBackupUser?: AuthUser | null;'
  );
  fs.writeFileSync('src/types.ts', typesContent);
  console.log('Updated src/types.ts');
}

// 2. Update src/store.ts
let storeContent = fs.readFileSync('src/store.ts', 'utf8');

if (!storeContent.includes('impersonateUser(')) {
  const impersonateMethods = `
  public impersonateUser(user: AuthUser) {
    if (!this.state.superAdminBackupUser) {
      this.state.superAdminBackupUser = this.state.currentUser;
    }
    this.state.impersonatedUser = user;
    this.state.currentUser = user;
    this.state.currentRole = user.role;
    if (user.role === 'operator') {
      this.state.activeOperatorId = user.id;
    }
    this.saveState();
    this.notifyListeners();
    this.addAuditLog('Dashboard Takeover', 'SuperAdmin / 01', 'super_admin', 'All', \`SuperAdmin switched control to dashboard \${user.dashboardNumber || user.id} (\${user.name})\`);
  }

  public impersonateByDashboardNumber(dashboardNumber: string): boolean {
    const cleanNum = dashboardNumber.trim().toLowerCase();
    if (!cleanNum) return false;

    const target = this.state.users.find(u => 
      (u.dashboardNumber && u.dashboardNumber.trim().toLowerCase() === cleanNum) ||
      (u.id && u.id.toLowerCase() === cleanNum) ||
      (u.role === 'regional_admin' && cleanNum.includes('rd') && u.dashboardNumber?.toLowerCase().includes(cleanNum)) ||
      (u.role === 'operator' && cleanNum.includes('op') && u.dashboardNumber?.toLowerCase().includes(cleanNum))
    );

    if (target) {
      this.impersonateUser(target);
      return true;
    }

    const isRegional = cleanNum.includes('rd') || cleanNum.startsWith('0');
    const role: import('./types').UserRole = isRegional ? 'regional_admin' : 'operator';
    
    const constructedUser: import('./types').AuthUser = {
      id: \`u_dash_\${cleanNum.replace(/[^a-z0-9]/g, '')}\`,
      email: \`partner_\${cleanNum.replace(/[^a-z0-9]/g, '')}@nordbase.pt\`,
      name: \`Dashboard Partner (\${dashboardNumber.toUpperCase()})\`,
      phone: '+351 912 000 000',
      role: role,
      region: isRegional ? 'Big Lisboa' : 'Portimão',
      dashboardNumber: dashboardNumber.toUpperCase(),
      isNewUser: false,
    };

    this.impersonateUser(constructedUser);
    return true;
  }

  public stopImpersonation() {
    if (this.state.superAdminBackupUser) {
      this.state.currentUser = this.state.superAdminBackupUser;
      this.state.superAdminBackupUser = null;
    } else {
      const superAdminUser = this.state.users.find(u => u.role === 'super_admin') || {
        id: 'u_super_admin_01',
        email: 'olegadmin',
        name: 'Director NordBase /01',
        phone: '+351 900 000 001',
        role: 'super_admin',
        region: 'All',
        dashboardNumber: '01',
        isNewUser: false,
      };
      this.state.currentUser = superAdminUser;
    }
    this.state.impersonatedUser = null;
    this.state.currentRole = 'super_admin';
    this.saveState();
    this.notifyListeners();
    this.addAuditLog('Control Returned', 'SuperAdmin / 01', 'super_admin', 'All', 'SuperAdmin returned to National Command Center (/01)');
  }
`;

  storeContent = storeContent.replace(
    'public logout() {',
    impersonateMethods + '\n  public logout() {'
  );

  // Also reset impersonatedUser on logout
  storeContent = storeContent.replace(
    'public logout() {\n    this.state.currentUser = null;',
    'public logout() {\n    this.state.currentUser = null;\n    this.state.impersonatedUser = null;\n    this.state.superAdminBackupUser = null;'
  );

  fs.writeFileSync('src/store.ts', storeContent);
  console.log('Updated src/store.ts');
}
