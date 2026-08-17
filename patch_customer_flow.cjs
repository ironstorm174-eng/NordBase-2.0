const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

code = code.replace(
  /onOpenDashboard\?: \(\) => void;/,
  "onOpenDashboard?: () => void;\n  onRequestLogin?: () => void;"
);

code = code.replace(
  /export default function CustomerFlow\(\{[\s\S]*?\}\: CustomerFlowProps\) \{/,
  (match) => match.replace("onOpenDashboard,", "onOpenDashboard,\n  onRequestLogin,")
);

// If the replace for export default function doesn't work, let's just do a specific replacement.
fs.writeFileSync('src/components/CustomerFlow.tsx', code);
