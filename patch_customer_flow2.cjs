const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

code = code.replace(
  /onOpenDashboard\n\}: CustomerFlowProps\) \{/,
  "onOpenDashboard,\n  onRequestLogin\n}: CustomerFlowProps) {"
);

fs.writeFileSync('src/components/CustomerFlow.tsx', code);
