const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');
content = content.replace(
  "  Calendar, Clock, LayoutList } from 'lucide-react';",
  "  Calendar, LayoutList } from 'lucide-react';"
);
fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
