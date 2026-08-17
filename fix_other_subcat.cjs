const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf-8');

content = content.replace(
  "      case 'Professional Services':\n        return <HelpCircle className={className} />;",
  "      case 'Other':\n        return <HelpCircle className={className} />;"
);

fs.writeFileSync('src/components/CustomerFlow.tsx', content);
