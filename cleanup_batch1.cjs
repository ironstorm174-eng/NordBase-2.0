const fs = require('fs');

const data = [
  {
    "file": "src/App.tsx",
    "unusedVars": ["Settings", "RefreshCw", "PlusCircle", "Shield", "Clock", "CheckCircle", "Loader2", "Sparkles", "ShieldAlert", "Building2", "BookOpen"]
  },
  {
    "file": "src/components/PitchDeck.tsx",
    "unusedVars": ["Calculator", "ArrowRight", "Layers", "Sparkles", "PieChart", "Lock", "PhoneCall", "RefreshCw", "BarChart3", "Check", "tpMaxTheoreticalLimit", "rpMonthlyIncomeYear1", "rpMonthlyIncomeYear2Base", "rpMonthlyIncomeYear2Sub"]
  },
  {
    "file": "src/components/CustomerFlow.tsx",
    "unusedVars": ["CITIES", "Message", "Clock", "CheckCircle", "Wrench", "Sparkle", "Search", "Cpu", "Beer", "FileSpreadsheet", "CATEGORY_SOLID_COLORS", "PORTUGAL_GEO", "Region", "SOLID_PALETTE", "getCityIconComponent", "getRegionMetadata"]
  },
  {
    "file": "src/components/OperatorDashboard.tsx",
    "unusedVars": ["Message", "ServiceCategory", "PORTUGAL_GEO", "Headphones", "MessageSquare", "Send", "Clock", "Euro", "MapPin", "Phone", "Search", "Filter", "Check", "Lock", "Unlock", "Bell", "Plus", "PhoneCall", "LogOut", "ALL_80_OPERATORS"]
  },
  {
    "file": "src/components/SuperAdminDashboard.tsx",
    "unusedVars": ["useEffect", "Message", "UserCheck", "MoreVertical", "Activity", "ChevronRight", "Key", "Eye"]
  },
  {
    "file": "src/store.ts",
    "unusedVars": ["parseErr", "res", "e"]
  }
];

function cleanFile(fileData) {
  const filePath = fileData.file;
  if (!fs.existsSync(filePath)) return;
  
  let code = fs.readFileSync(filePath, 'utf8');
  let lines = code.split('\n');
  
  fileData.unusedVars.forEach(v => {
    const varName = v;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Clean from imports
      if (line.startsWith('import ')) {
        if (line.includes(varName)) {
          // Replace exact word match
          const regex = new RegExp(`\\b${varName}\\b\\s*,?\\s*`);
          line = line.replace(regex, '');
          
          // Cleanup trailing commas in braces
          line = line.replace(/,\s*}/, ' }');
          line = line.replace(/{\s*,/, '{ ');
          
          if (line.includes('{ }') || line.includes('{}')) {
            line = ''; // Delete empty import
          }
          lines[i] = line;
        }
      }
      
      // Clean simple unused const assignments
      if (varName === 'tpMaxTheoreticalLimit' || varName === 'rpMonthlyIncomeYear1' || varName === 'rpMonthlyIncomeYear2Base' || varName === 'rpMonthlyIncomeYear2Sub') {
         if (line.includes(`const ${varName} =`)) {
             lines[i] = '';
         }
      }
    }
  });
  
  fs.writeFileSync(filePath, lines.filter(l => l !== '').join('\n'));
  console.log(`Cleaned ${filePath}`);
}

data.forEach(cleanFile);
