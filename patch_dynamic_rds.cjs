const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const dynamicRDsCode = `        const customRDs = users
          .filter(u => u.role === 'regional_admin' && !['Pt-RD-001', 'Pt-RD-002', 'Pt-RD-003', 'Pt-RD-004'].includes(u.dashboardNumber || ''))
          .map(u => {
            const stats = computeRegionStats([u.region || ''], [u.region || '']);
            return {
              id: u.dashboardNumber || \`PT-RD-\${u.id.slice(-3)}\`,
              name: \`\${u.region || 'Regional'} Network\`,
              director: u.name,
              role: 'regional_admin',
              region: u.region || 'Portugal',
              totalRevenue: stats.totalRevenue,
              unlockedLeads: stats.unlockedLeads,
              totalOperators: users.filter(op => op.role === 'operator' && op.region === u.region).length,
              activeJobs: stats.activeJobs,
              avgResponseTime: "2.0 min",
              locationsCount: 1,
              breakdown: [
                { name: u.region || 'Central Zone', places: 1, operators: 1, revenue: stats.totalRevenue, status: "Active" }
              ]
            };
          });

        const REGIONAL_DASHBOARDS = [
`;

content = content.replace(
  '        const REGIONAL_DASHBOARDS = [',
  dynamicRDsCode
);

content = content.replace(
  '        ];\n\n        const totalCommissionVolume = REGIONAL_DASHBOARDS.reduce',
  '        , ...customRDs];\n\n        const totalCommissionVolume = REGIONAL_DASHBOARDS.reduce'
);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content);
console.log('Added dynamic RDs support');
