const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'board' | 'unlocked' | 'profile' | 'support' | 'notifications' | 'academy'>('board');",
  "const [activeTab, setActiveTab] = useState<'board' | 'unlocked' | 'profile' | 'services' | 'support' | 'notifications' | 'academy'>('board');"
);
fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
