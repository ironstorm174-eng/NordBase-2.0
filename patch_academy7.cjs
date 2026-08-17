const fs = require('fs');
const content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const targetStr = `    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center`;

const insertion = `    if (expandedSection === 'sec_7_1') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Disputes with Clients</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Conflicts happen, but they can usually be resolved calmly. Here is how to handle disagreements professionally.
          </p>
          
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl mt-4">
            <h4 className="text-lg font-bold text-white mb-4">Steps to Resolve a Dispute</h4>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">1</div>
                <div>
                  <strong className="text-white block text-sm">Stay Calm and Professional</strong>
                  <span className="text-xs text-slate-400">Do not raise your voice or argue. Listen to the client's complaint fully before responding.</span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">2</div>
                <div>
                  <strong className="text-white block text-sm">Review the Agreement</strong>
                  <span className="text-xs text-slate-400">Politely remind the client of the initial agreement (e.g., messages or quotes) regarding price and scope of work.</span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">3</div>
                <div>
                  <strong className="text-white block text-sm">Involve the Operator</strong>
                  <span className="text-xs text-slate-400">If you cannot reach an agreement, contact your Local Operator immediately via the platform chat. Do not try to force a resolution on your own if the situation escalates.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_7_2') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Client Declined the Order</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Sometimes a client changes their mind after you have purchased the lead.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Before You Arrive</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                If you contact the client and they say they no longer need the service, this is a protected case. Request a refund through your Operator.
              </p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">After You Arrive</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                If the client declines the work after you arrive because they disagree with a newly provided estimate, you might still be eligible for a refund depending on the Operator's review of the initial request.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_7_3') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Client Unresponsive</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            You bought the lead, but the client is not answering calls or messages.
          </p>
          
          <div className="p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl mt-4">
            <h4 className="text-lg font-bold text-cyan-400 mb-4">Standard Procedure for Unresponsive Clients</h4>
            <ul className="list-disc list-inside space-y-3 text-sm text-slate-300">
              <li><strong>Attempt 1:</strong> Call immediately after purchasing. If no answer, send a text.</li>
              <li><strong>Attempt 2:</strong> Wait 1-2 hours and call again.</li>
              <li><strong>Attempt 3:</strong> Call one final time the next morning.</li>
              <li><strong>Report:</strong> If 24 hours have passed and there is still no response, notify your Operator. This lead qualifies for a full refund to your Virtual Wallet.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_7_4') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Invalid Leads</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            What counts as an invalid lead, and how do we protect you?
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Valid Grounds for Refund</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  Wrong phone number provided, duplicate request, client lives outside your selected service area, or the client already hired someone before you called (if you called within 10 minutes).
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">NOT Eligible for Refund</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  You called too late (hours after purchasing), the client chose someone cheaper after you provided a high estimate, or you lacked the skills to complete the described job.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_7_5') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">How to File an Appeal</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            If you need a refund or operator mediation, here is the official process.
          </p>
          
          <div className="mt-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl border-l-4 border-l-blue-500">
            <ol className="space-y-4 relative z-10">
              <li className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">1</div>
                <div>
                  <strong className="text-white block text-sm">Open the Chat</strong>
                  <span className="text-xs text-slate-400">Go to your messages and open the direct chat with your Local Operator.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">2</div>
                <div>
                  <strong className="text-white block text-sm">Provide Lead Details</strong>
                  <span className="text-xs text-slate-400">Mention the specific lead ID or client name.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">3</div>
                <div>
                  <strong className="text-white block text-sm">Attach Proof</strong>
                  <span className="text-xs text-slate-400">If the client was unresponsive, upload a screenshot of your call log or messages.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">4</div>
                <div>
                  <strong className="text-white block text-sm">Wait for Review</strong>
                  <span className="text-xs text-slate-400">Operators process appeals daily. If valid, your Virtual Wallet will be credited immediately.</span>
                </div>
              </li>
            </ol>
          </div>
        </div>
      );
    }`;

const modified = content.replace(targetStr, insertion + '\n\n' + targetStr);
fs.writeFileSync('src/components/Academy.tsx', modified);

const targetStr2 = `const [activeModule, setActiveModule] = useState<string>('module_6');`;
const insertion2 = `const [activeModule, setActiveModule] = useState<string>('module_7');`;
const modified2 = fs.readFileSync('src/components/Academy.tsx', 'utf-8').replace(targetStr2, insertion2);

const targetStr3 = `const [expandedSection, setExpandedSection] = useState<string | null>('sec_6_1');`;
const insertion3 = `const [expandedSection, setExpandedSection] = useState<string | null>('sec_7_1');`;
const modified3 = modified2.replace(targetStr3, insertion3);

fs.writeFileSync('src/components/Academy.tsx', modified3);
