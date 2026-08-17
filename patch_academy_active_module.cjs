const fs = require('fs');
const content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const targetStr = `const [activeModule, setActiveModule] = useState<string>('module_1');`;
const insertion = `const [activeModule, setActiveModule] = useState<string>('module_6');`;
const modified = content.replace(targetStr, insertion);

const targetStr2 = `const [expandedSection, setExpandedSection] = useState<string | null>('sec_1_1');`;
const insertion2 = `const [expandedSection, setExpandedSection] = useState<string | null>('sec_6_1');`;
const modified2 = modified.replace(targetStr2, insertion2);

fs.writeFileSync('src/components/Academy.tsx', modified2);
