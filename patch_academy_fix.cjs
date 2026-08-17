const fs = require('fs');
let content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const returnStr = `  return (
    <div className="h-full flex flex-col bg-[#030712] text-slate-200">`;
const newReturnStr = `  const currentCurriculum = academyLevel === 'specialist' ? specialistCurriculum : operatorCurriculum;
  
  const handleLevelChange = (level) => {
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
    <div className="h-full flex flex-col bg-[#030712] text-slate-200">`;

content = content.replace(returnStr, newReturnStr);

fs.writeFileSync('src/components/Academy.tsx', content);
console.log('Done');
