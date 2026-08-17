const fs = require('fs');
const content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const targetStr = `    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center`;

const insertion = `    if (expandedSection === 'sec_8_1') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Quality Standards</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            NordBase stands for excellence. Clients trust our platform because they know we only work with the best.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Technical Competence</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Never take a job you are not fully qualified to do. High-quality workmanship is the baseline expectation for every specialist on our platform.
              </p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Warranty & Guarantees</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                If your work fails within a reasonable timeframe due to poor execution, you are expected to return and fix it at no additional labor cost to the client.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_8_2') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Code of Ethics</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Our Code of Ethics defines the professional boundaries every specialist must respect.
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              </div>
              <div>
                <strong className="text-white block text-sm mb-1">Honesty in Pricing</strong>
                <span className="text-sm text-slate-400 leading-relaxed">Do not invent non-existent problems to inflate the bill. Transparent pricing builds long-term trust and brings referrals.</span>
              </div>
            </div>
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              </div>
              <div>
                <strong className="text-white block text-sm mb-1">Respect for Privacy</strong>
                <span className="text-sm text-slate-400 leading-relaxed">Client contact information and addresses are strictly confidential. Never share or sell this data to third parties.</span>
              </div>
            </div>
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              </div>
              <div>
                <strong className="text-white block text-sm mb-1">Non-Discrimination</strong>
                <span className="text-sm text-slate-400 leading-relaxed">Treat every client with respect, regardless of their background, race, religion, gender, or orientation.</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_8_3') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Communication Guidelines</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Clear, polite, and timely communication is non-negotiable.
          </p>
          
          <div className="p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl mt-4">
            <ul className="list-disc list-inside space-y-4 text-sm text-slate-300">
              <li><strong>No Aggression:</strong> Swearing, threats, or aggressive behavior towards clients or your Local Operator will result in immediate and permanent account suspension.</li>
              <li><strong>Timeliness:</strong> Respond to messages and calls promptly. If you miss a call, always return it.</li>
              <li><strong>Clarity:</strong> Explain technical issues in a way the client can understand. Avoid confusing jargon when discussing the problem and the price.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_8_4') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Protecting NordBase Reputation</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            You represent the platform. When a client hires you, they see you as a NordBase professional.
          </p>
          
          <div className="mt-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl border-l-4 border-l-amber-500">
            <h4 className="font-bold text-white text-lg mb-3">Our Zero-Tolerance Policy</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              NordBase has a zero-tolerance policy for actions that damage the platform's reputation. This includes:
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                <span>Theft, fraud, or intentional property damage.</span>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                <span>Showing up to a job under the influence of drugs or alcohol.</span>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                <span>Publicly slandering the platform or the Operators on social media instead of resolving disputes internally.</span>
              </li>
            </ul>
          </div>
        </div>
      );
    }`;

const modified = content.replace(targetStr, insertion + '\n\n' + targetStr);
fs.writeFileSync('src/components/Academy.tsx', modified);

const targetStr2 = `const [activeModule, setActiveModule] = useState<string>('module_7');`;
const insertion2 = `const [activeModule, setActiveModule] = useState<string>('module_8');`;
const modified2 = fs.readFileSync('src/components/Academy.tsx', 'utf-8').replace(targetStr2, insertion2);

const targetStr3 = `const [expandedSection, setExpandedSection] = useState<string | null>('sec_7_1');`;
const insertion3 = `const [expandedSection, setExpandedSection] = useState<string | null>('sec_8_1');`;
const modified3 = modified2.replace(targetStr3, insertion3);

fs.writeFileSync('src/components/Academy.tsx', modified3);
