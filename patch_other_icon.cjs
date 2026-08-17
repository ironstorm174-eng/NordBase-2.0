const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf-8');

content = content.replace(
  "      case 'Legalization':\n        return <FileCheck className={className} />;",
  "      case 'Legalization':\n        return <FileCheck className={className} />;\n      case 'Other':\n        return <HelpCircle className={className} />;"
);

fs.writeFileSync('src/components/CustomerFlow.tsx', content);
