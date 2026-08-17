const fs = require('fs');

const data = [
  { "file": "src/components/AITranslatedMessage.tsx", "unusedVars": ["Languages", "Check"] },
  { "file": "src/components/Academy.tsx", "unusedVars": ["BookOpen"] },
  { "file": "src/components/AdminDashboard.tsx", "unusedVars": ["SupportTicket", "Edit2", "Lock", "Mail", "MapPin"] },
  { "file": "src/components/CreateOrderModal.tsx", "unusedVars": ["Plus", "FileText", "CheckCircle2"] },
  { "file": "src/components/CustomerDashboard.tsx", "unusedVars": ["AlertCircle", "ArrowLeft", "ThumbsUp"] },
  { "file": "src/components/Footer.tsx", "unusedVars": ["Sparkles", "NordBaseLogo"] },
  { "file": "src/components/KnowledgeBase.tsx", "unusedVars": ["ShieldCheck", "Tag", "Share2", "ExternalLink", "MessageSquare", "AlertTriangle"] },
  { "file": "src/components/KnowledgeEvolutionPanel.tsx", "unusedVars": ["Plus", "AlertCircle"] },
  { "file": "src/components/LocationSelector.tsx", "unusedVars": ["CornerDownLeft", "Region", "City", "District"] },
  { "file": "src/components/LoginScreen.tsx", "unusedVars": ["HelpCircle", "Sparkles", "CheckCircle"] },
  { "file": "src/components/MarketplaceServicesManager.tsx", "unusedVars": ["useEffect", "X"] },
  { "file": "src/components/MarketplaceView.tsx", "unusedVars": ["Star", "Filter", "Phone", "Mail", "MessageCircle"] },
  { "file": "src/components/OperatorLeadsTerminal.tsx", "unusedVars": ["Message", "Phone", "Eye", "EyeOff", "PhoneCall", "ThumbsUp"] },
  { "file": "src/components/PartnerLandingPage.tsx", "unusedVars": ["Users", "MapPin", "Layers", "Lock", "PhoneCall"] },
  { "file": "src/components/RegionalPartnerApplication.tsx", "unusedVars": ["Mail", "Phone", "Award", "Compass", "Car", "Sparkles", "CheckSquare"] },
  { "file": "src/components/SpecialistDashboard.tsx", "unusedVars": ["NordBaseLogo", "MapPin", "Unlock", "Coins", "Phone", "TrendingUp", "LogOut", "Camera", "Calendar", "ShieldCheck"] },
  { "file": "src/components/SpecialistOnboarding.tsx", "unusedVars": ["CheckCircle", "UploadCloud", "Wrench", "Languages", "Globe", "Check"] },
  { "file": "src/components/SpecialistWelcomeNotice.tsx", "unusedVars": ["ArrowRight", "ShieldCheck"] },
  { "file": "src/components/TerritorialHubsManager.tsx", "unusedVars": ["TerritorialHub", "HubSeat", "AuthUser", "Job", "Specialist", "ShieldCheck", "CheckCircle2", "Sparkles", "AlertCircle"] },
  { "file": "src/components/TerritorialPartnerApplication.tsx", "unusedVars": ["ShieldCheck", "User", "Mail", "Phone", "Calendar", "Globe", "Briefcase", "Clock", "Sparkles", "CheckSquare", "Layers", "ChevronRight", "Region", "City"] },
  { "file": "src/components/academy/OperatorContent.tsx", "unusedVars": ["Shield", "Target", "Users"] },
  { "file": "src/components/academy/SpecialistContent.tsx", "unusedVars": ["Users", "Star", "Target", "User", "Image", "FileSearch", "Wrench", "Map", "Award"] },
  { "file": "src/lib/agentSimulation/advancedPack2Agent.ts", "unusedVars": ["Job"] },
  { "file": "src/lib/agentSimulation/billingVerificationAgent.ts", "unusedVars": ["AuthUser", "Job"] },
  { "file": "src/lib/agentSimulation/customerAgent.ts", "unusedVars": ["Job"] },
  { "file": "src/lib/agentSimulation/faultInjectionAgent.ts", "unusedVars": ["Job"] },
  { "file": "src/lib/agentSimulation/multilingualChatVerificationAgent.ts", "unusedVars": ["Job"] },
  { "file": "src/lib/agentSimulation/specialistAgent.ts", "unusedVars": ["Specialist", "Job"] },
  { "file": "src/lib/agentSimulation/territoryPartnerAgent.ts", "unusedVars": ["AuthUser", "Specialist", "Job"] },
  { "file": "src/lib/agentSimulation/territoryRoutingVerificationAgent.ts", "unusedVars": ["ServiceCategory"] },
  { "file": "src/lib/permissions.ts", "unusedVars": ["Message"] }
];

function cleanFile(fileData) {
  const filePath = fileData.file;
  if (!fs.existsSync(filePath)) return;
  
  let code = fs.readFileSync(filePath, 'utf8');
  let lines = code.split('\n');
  
  fileData.unusedVars.forEach(varName => {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.startsWith('import ')) {
        if (line.includes(varName)) {
          const regex = new RegExp(`\\b${varName}\\b\\s*,?\\s*`);
          line = line.replace(regex, '');
          line = line.replace(/,\\s*}/, ' }');
          line = line.replace(/{\\s*,/, '{ ');
          if (line.includes('{ }') || line.includes('{}') || line.trim() === 'import from' || line.match(/^import\\s+['"][^'"]+['"];?$/)) {
            line = ''; 
          }
          lines[i] = line;
        }
      }
    }
  });
  
  fs.writeFileSync(filePath, lines.filter(l => l !== '').join('\n'));
  console.log(`Cleaned ${filePath}`);
}

data.forEach(cleanFile);
