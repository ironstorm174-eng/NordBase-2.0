const fs = require('fs');
let code = fs.readFileSync('src/components/MarketplaceView.tsx', 'utf8');

// Add onRequestLogin to props
code = code.replace(
  /onSubmitDirectRequest: \(specialistId: string, description: string\) => void;/,
  "onSubmitDirectRequest: (specialistId: string, description: string) => void;\n  onRequestLogin?: () => void;"
);

code = code.replace(
  /export default function MarketplaceView\(\{ category, specialty, onGoBack, currentUser, onSubmitDirectRequest \}: MarketplaceViewProps\) \{/,
  "export default function MarketplaceView({ category, specialty, onGoBack, currentUser, onSubmitDirectRequest, onRequestLogin }: MarketplaceViewProps) {"
);

// Update handleDirectRequest to check login
code = code.replace(
  /const handleDirectRequest = \(\) => \{/,
  `const handleDirectRequest = () => {
    if (!currentUser) {
      if (onRequestLogin) onRequestLogin();
      return;
    }`
);

fs.writeFileSync('src/components/MarketplaceView.tsx', code);
