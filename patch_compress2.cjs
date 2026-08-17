const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');

// replace all
content = content.replace(/type: file\.type \|\| 'image\/jpeg'/g, "type: 'image/jpeg'");
content = content.replace(/file\.type \|\| 'image\/jpeg'/g, "'image/jpeg'");

fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
