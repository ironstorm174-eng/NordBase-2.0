const fs = require('fs');
let content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

// 1. Add operatorCurriculum after specialistCurriculum
const specialistEndStr = `        { id: 'sec_9_1', title: 'Frequently Asked Questions' },
      ]
    }
  ];`;
  
const operatorCurriculum = `

  const operatorCurriculum = [
    {
      id: 'module_op_1',
      title: '1. Role of the Local Operator',
      sections: [
        { id: 'sec_op_1_1', title: 'Responsibilities' },
        { id: 'sec_op_1_2', title: 'Authority & Responsibilities' },
        { id: 'sec_op_1_3', title: 'The Mission of a Local Operator' },
      ]
    },
    {
      id: 'module_op_2',
      title: '2. Customer Communication',
      sections: [
        { id: 'sec_op_2_1', title: 'Handling Incoming Calls' },
        { id: 'sec_op_2_2', title: 'Request Qualification' },
        { id: 'sec_op_2_3', title: 'Handling Customer Objections' },
        { id: 'sec_op_2_4', title: 'Managing Difficult Customers' },
      ]
    },
    {
      id: 'module_op_3',
      title: '3. Lead Management',
      sections: [
        { id: 'sec_op_3_1', title: 'Creating Qualified Leads' },
        { id: 'sec_op_3_2', title: 'Verifying Customer Information' },
        { id: 'sec_op_3_3', title: 'Assigning Leads to Specialists' },
        { id: 'sec_op_3_4', title: 'Lead Quality Control' },
      ]
    },
    {
      id: 'module_op_4',
      title: '4. Working with Specialists',
      sections: [
        { id: 'sec_op_4_1', title: 'Selecting the Right Specialist' },
        { id: 'sec_op_4_2', title: 'Selling Leads' },
        { id: 'sec_op_4_3', title: 'Supporting Specialists' },
        { id: 'sec_op_4_4', title: 'Resolving Disputes' },
      ]
    },
    {
      id: 'module_op_5',
      title: '5. CRM & Platform',
      sections: [
        { id: 'sec_op_5_1', title: 'Using the Platform Interface' },
        { id: 'sec_op_5_2', title: 'Request Status Management' },
        { id: 'sec_op_5_3', title: 'Chats & Internal Communication' },
        { id: 'sec_op_5_4', title: 'Documents' },
        { id: 'sec_op_5_5', title: 'Job History' },
      ]
    },
    {
      id: 'module_op_6',
      title: '6. Financial Rules',
      sections: [
        { id: 'sec_op_6_1', title: 'Operator Earnings' },
        { id: 'sec_op_6_2', title: 'Lead Refund Policy' },
        { id: 'sec_op_6_3', title: 'Financial Scenarios' },
      ]
    },
    {
      id: 'module_op_7',
      title: '7. Escalation',
      sections: [
        { id: 'sec_op_7_1', title: 'When to Involve a Local Admin' },
        { id: 'sec_op_7_2', title: 'Conflict Resolution' },
        { id: 'sec_op_7_3', title: 'Handling Complaints' },
        { id: 'sec_op_7_4', title: 'Standards Violations' },
      ]
    },
    {
      id: 'module_op_8',
      title: '8. KPI & Performance',
      sections: [
        { id: 'sec_op_8_1', title: 'Response Time' },
        { id: 'sec_op_8_2', title: 'Conversion Rate' },
        { id: 'sec_op_8_3', title: 'Lead Quality' },
        { id: 'sec_op_8_4', title: 'Operator Rating' },
      ]
    },
    {
      id: 'module_op_9',
      title: '9. FAQ',
      sections: [
        { id: 'sec_op_9_1', title: 'Answers to Frequently Asked Questions for Local Operators' },
      ]
    }
  ];`;
  
content = content.replace(specialistEndStr, specialistEndStr + operatorCurriculum);

// 2. Add state
const stateStr = `  const [activeModule, setActiveModule] = useState<string>('module_9');
  const [expandedSection, setExpandedSection] = useState<string | null>('sec_9_1');`;
  
const newStateStr = `  const isOperatorLevel = userRole === 'operator' || userRole === 'admin' || userRole === 'super_admin';
  const [academyLevel, setAcademyLevel] = useState<'specialist' | 'operator'>('specialist');
  const [activeModule, setActiveModule] = useState<string>('module_1');
  const [expandedSection, setExpandedSection] = useState<string | null>('sec_1_1');`;

content = content.replace(stateStr, newStateStr);

// 3. Add renderOperatorContent before renderContent
const renderContentStr = `  const renderContent = () => {`;
const renderOperatorContent = `  const renderOperatorContent = () => {
    const currentModule = operatorCurriculum.find(m => m.sections.some(s => s.id === expandedSection));
    const currentSection = currentModule?.sections.find(s => s.id === expandedSection);
    
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <h3 className="text-3xl font-black text-white tracking-tight mb-4">{currentSection?.title}</h3>
        <p className="text-sm text-slate-300 leading-relaxed text-lg">
          Content for this section will be added soon.
        </p>
      </div>
    );
  };
  
`;
content = content.replace(renderContentStr, renderOperatorContent + renderContentStr);

// 4. Update JSX to use currentCurriculum
// First, find the active curriculum
const activeCurriculumDef = `  const currentCurriculum = academyLevel === 'specialist' ? specialistCurriculum : operatorCurriculum;`;
// Wait, I can inject it right before the return statement of Academy
const returnStr = `  return (
    <div className="flex flex-col h-full bg-[#030712]">`;
const newReturnStr = `  const currentCurriculum = academyLevel === 'specialist' ? specialistCurriculum : operatorCurriculum;
  
  const handleLevelChange = (level: 'specialist' | 'operator') => {
    setAcademyLevel(level);
    if (level === 'specialist') {
      setActiveModule('module_1');
      setExpandedSection('sec_1_1');
    } else {
      setActiveModule('module_op_1');
      setExpandedSection('sec_op_1_1');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#030712]">`;

content = content.replace(returnStr, newReturnStr);

// Replace specialistCurriculum with currentCurriculum in JSX mapping
content = content.replace(/specialistCurriculum\.map/g, 'currentCurriculum.map');
content = content.replace(/specialistCurriculum\.find/g, 'currentCurriculum.find');

// Add level toggles
const sidebarTop = `        {/* Sidebar Navigation */}
        <div className="w-80 border-r border-blue-900/30 bg-[#050A1A] overflow-y-auto hidden md:block">
          <div className="p-4">
            <div className="space-y-1">`;
const newSidebarTop = `        {/* Sidebar Navigation */}
        <div className="w-80 border-r border-blue-900/30 bg-[#050A1A] overflow-y-auto hidden md:block flex flex-col">
          <div className="p-4 border-b border-blue-900/30 mb-4 sticky top-0 bg-[#050A1A] z-10">
            {isOperatorLevel && (
              <div className="flex p-1 bg-slate-900/50 rounded-lg mb-2">
                <button
                  onClick={() => handleLevelChange('specialist')}
                  className={\`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors \${academyLevel === 'specialist' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}\`}
                >
                  Specialist
                </button>
                <button
                  onClick={() => handleLevelChange('operator')}
                  className={\`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors \${academyLevel === 'operator' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}\`}
                >
                  Local Operator
                </button>
              </div>
            )}
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
              {academyLevel === 'specialist' ? 'Specialist Academy' : 'Operator Academy'}
            </h2>
          </div>
          <div className="p-4 pt-0">
            <div className="space-y-1">`;
content = content.replace(sidebarTop, newSidebarTop);

const mobileTop = `          {/* Mobile Navigation Dropdown */}
          <div className="md:hidden border-b border-blue-900/30 p-4 bg-[#050A1A]">
            <select`;
const newMobileTop = `          {/* Mobile Navigation Dropdown */}
          <div className="md:hidden border-b border-blue-900/30 p-4 bg-[#050A1A] space-y-3">
            {isOperatorLevel && (
              <div className="flex p-1 bg-slate-900/50 rounded-lg">
                <button
                  onClick={() => handleLevelChange('specialist')}
                  className={\`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors \${academyLevel === 'specialist' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}\`}
                >
                  Specialist
                </button>
                <button
                  onClick={() => handleLevelChange('operator')}
                  className={\`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors \${academyLevel === 'operator' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}\`}
                >
                  Operator
                </button>
              </div>
            )}
            <select`;
content = content.replace(mobileTop, newMobileTop);

// Update renderContent call to use renderOperatorContent if academyLevel === 'operator'
const contentCall = `{renderContent()}`;
const newContentCall = `{academyLevel === 'specialist' ? renderContent() : renderOperatorContent()}`;
content = content.replace(contentCall, newContentCall);

fs.writeFileSync('src/components/Academy.tsx', content);
console.log('Done');
