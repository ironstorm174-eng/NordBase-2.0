const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');

// Remove the incorrect store calls
content = content.replace(/      \/\/ We don't submit to review if marketplace, they go to subscription\n      if \(\!isMarketplace\) \{\n        store\.submitSpecialistForReview\(currentUser\.id\);\n      \}/, "");

fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
console.log('Fixed SpecialistDashboard');
