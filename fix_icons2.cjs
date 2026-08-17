const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');
content = content.replace("  GraduationCap", "  GraduationCap,");
fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
