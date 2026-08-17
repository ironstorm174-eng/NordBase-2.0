const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');

content = content.replace(
  "{currentUser?.isMarketplaceSpecialist && (",
  "{(currentUser?.categories?.some((c: any) => ['Care', 'Lessons', 'Other'].includes(c.name || c))) && ("
);

fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
