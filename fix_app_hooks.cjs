const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const hookCodeStart = "const navigate = useNavigate();";
const hookCodeEnd = "  }, [isPartnerPage, state.currentRole, customerView, state.selectedCategory]);";

const startIdx = code.indexOf(hookCodeStart);
const endIdx = code.indexOf(hookCodeEnd) + hookCodeEnd.length;

if (startIdx > -1 && endIdx > -1) {
  const hooksCode = code.substring(startIdx, endIdx);
  code = code.substring(0, startIdx) + code.substring(endIdx);
  
  // Insert below isPartnerPage
  const insertPoint = code.indexOf("const [isPartnerPage, setIsPartnerPage] = useState(false);") + "const [isPartnerPage, setIsPartnerPage] = useState(false);".length;
  code = code.substring(0, insertPoint) + "\n" + hooksCode + "\n" + code.substring(insertPoint);
}

// Fix handleSelectCategory type error
code = code.replace("handleSelectCategory(cat);", "handleSelectCategory(cat as any);");

fs.writeFileSync('src/App.tsx', code);
