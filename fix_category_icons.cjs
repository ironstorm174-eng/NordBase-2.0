const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf-8');

// Replace Briefcase with Coins in import
content = content.replace("  Briefcase,\n", "  Coins,\n");

// Add case 'Coins' to getCategoryIcon
content = content.replace(
  "      default: return <HelpCircle className={className} />;",
  "      case 'Coins': return <Coins className={className} />;\n      default: return <HelpCircle className={className} />;"
);

fs.writeFileSync('src/components/CustomerFlow.tsx', content);
