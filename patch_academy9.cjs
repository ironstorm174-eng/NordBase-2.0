const fs = require('fs');
const content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const targetStr = `    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center`;

const insertion = `    if (expandedSection === 'sec_9_1') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Frequently Asked Questions</h3>
          
          <div className="space-y-4 mt-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white text-lg mb-2">Q: How much does it cost to join NordBase?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Joining NordBase and creating a profile is completely free. You only pay when you decide to unlock a specific lead to get the client's contact information.
              </p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white text-lg mb-2">Q: Do I have to buy every lead I see?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                No. You have complete freedom to choose which leads you want to purchase based on the job description, location, and your availability.
              </p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white text-lg mb-2">Q: What if I buy a lead but the client doesn't answer?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Follow our communication guidelines (call, wait, text, try again). If there is still no response after 24 hours, contact your Local Operator. We will review the case and refund the lead cost to your Virtual Wallet if the client is unresponsive.
              </p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white text-lg mb-2">Q: How do I get paid by the client?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                You get paid directly by the client (cash, card transfer, etc.) upon completing the job. NordBase takes 0% commission from your final earnings.
              </p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white text-lg mb-2">Q: Can I change my service area or specializations later?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes, you can easily update your service radius and the types of jobs you accept at any time in your profile settings.
              </p>
            </div>
            
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white text-lg mb-2">Q: Who is my Local Operator?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your Local Operator is a dedicated NordBase manager assigned to your specific region. They review leads, manage disputes, and help you succeed on the platform. You can always reach them via the chat in your dashboard.
              </p>
            </div>
          </div>
        </div>
      );
    }`;

const modified = content.replace(targetStr, insertion + '\n\n' + targetStr);
fs.writeFileSync('src/components/Academy.tsx', modified);

const targetStr2 = `const [activeModule, setActiveModule] = useState<string>('module_8');`;
const insertion2 = `const [activeModule, setActiveModule] = useState<string>('module_9');`;
const modified2 = fs.readFileSync('src/components/Academy.tsx', 'utf-8').replace(targetStr2, insertion2);

const targetStr3 = `const [expandedSection, setExpandedSection] = useState<string | null>('sec_8_1');`;
const insertion3 = `const [expandedSection, setExpandedSection] = useState<string | null>('sec_9_1');`;
const modified3 = modified2.replace(targetStr3, insertion3);

fs.writeFileSync('src/components/Academy.tsx', modified3);
