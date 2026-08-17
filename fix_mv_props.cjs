const fs = require('fs');
let content = fs.readFileSync('src/components/MarketplaceView.tsx', 'utf-8');

content = content.replace(
  "interface MarketplaceViewProps {\n  category: ServiceCategory;",
  "interface MarketplaceViewProps {\n  category: ServiceCategory;\n  specialty?: string;"
);

content = content.replace(
  "export default function MarketplaceView({ category, onGoBack, currentUser, onSubmitDirectRequest }: MarketplaceViewProps) {",
  "export default function MarketplaceView({ category, specialty, onGoBack, currentUser, onSubmitDirectRequest }: MarketplaceViewProps) {"
);

content = content.replace(
  "const [searchQuery, setSearchQuery] = useState('');",
  "const [searchQuery, setSearchQuery] = useState(specialty || '');"
);

fs.writeFileSync('src/components/MarketplaceView.tsx', content);
