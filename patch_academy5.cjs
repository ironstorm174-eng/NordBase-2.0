const fs = require('fs');
const content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const targetStrStart = `    if (expandedSection === 'sec_5_2' || expandedSection === 'sec_5_3') {`;
const targetStrEnd = `    }`;

const blockStartIdx = content.indexOf(targetStrStart);
const blockEndIdx = content.indexOf(targetStrEnd, blockStartIdx + targetStrStart.length) + targetStrEnd.length;

const originalBlock = content.substring(blockStartIdx, blockEndIdx);

const replacement = `    if (expandedSection === 'sec_5_1') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">How Leads Are Priced</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Our pricing model is transparent and designed to ensure you only pay a fair amount for the potential value of the job.
          </p>
          
          <div className="p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl mt-4">
            <h4 className="text-lg font-bold text-white mb-2">Dynamic Pricing</h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              The price of a lead is not fixed. It varies based on several factors:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-400">
              <li><strong>Job Type & Complexity:</strong> A simple diagnostic will cost less than a full system replacement.</li>
              <li><strong>Expected Profit:</strong> We aim to keep the lead cost between 5% and 15% of the estimated total job value.</li>
              <li><strong>Urgency:</strong> Emergency requests might have a slightly different pricing structure.</li>
            </ul>
          </div>
          
          <div className="mt-4 p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong>Remember:</strong> You see the exact price of the lead before you buy it. You decide if it's worth the investment.
            </p>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_5_2') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Specialist Virtual Wallet</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Your Virtual Wallet is your central financial hub on NordBase. You use it to purchase leads seamlessly.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Coins className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Topping Up</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                You can add funds to your wallet using various secure methods (credit card, bank transfer). Keep a healthy balance so you never miss a great lead.
              </p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Instant Purchasing</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                When you click "Unlock Lead", the amount is instantly deducted from your balance, giving you immediate access to the client.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_5_3') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Lead Refunds</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            We understand that not every lead converts into a job. We protect you from invalid requests.
          </p>
          
          <div className="p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl mt-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Shield className="w-32 h-32 text-cyan-400" />
            </div>
            <h4 className="text-lg font-bold text-cyan-400 mb-3 relative z-10">When Can You Get a Refund?</h4>
            
            <ul className="space-y-3 text-sm text-slate-300 relative z-10">
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>The client provided an invalid phone number.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>The client lives far outside your specified service area (due to a system error or client mistake).</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>The request is a duplicate or obvious spam.</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-6 p-5 bg-slate-900 border border-slate-800 rounded-2xl border-l-4 border-l-amber-500">
            <h4 className="font-bold text-white text-sm mb-2">Important Note on Refunds</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Refunds are issued back to your <strong>Virtual Wallet</strong> as credits, not to your bank account. You can use these credits immediately for new leads. Contact your Operator via chat to request a refund.
            </p>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_5_4') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Direct Payments from Clients</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            On NordBase, you are in control of your earnings. We do not process payments from clients.
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">0% Commission</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  Once you buy the lead, 100% of the money you make on the job is yours to keep. You charge the client directly.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Accepting Payments</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  You decide how you want to be paid: cash, card transfer, or any other method you prefer. Ensure you communicate this clearly to the client before starting the work.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_5_5') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">NordBase Financial Rules</h3>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-6 border border-red-500/20 rounded-2xl bg-red-900/10">
              <h4 className="text-lg font-bold text-white mb-2 text-red-400">No Overcharging</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Do not artificially inflate prices. We monitor client feedback, and consistent reports of overcharging will lead to account suspension.</p>
            </div>
            <div className="p-6 border border-emerald-500/20 rounded-2xl bg-emerald-900/10">
              <h4 className="text-lg font-bold text-white mb-2 text-emerald-400">Taxes</h4>
              <p className="text-sm text-slate-400 leading-relaxed">As an independent professional, you are entirely responsible for reporting your income and paying your own taxes according to local laws.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30 sm:col-span-2">
              <h4 className="text-lg font-bold text-white mb-2">Transparency</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Always provide the client with a clear breakdown of costs (parts vs. labor) if requested. Honesty builds a strong reputation.</p>
            </div>
          </div>
        </div>
      );
    }`;

const modified = content.replace(originalBlock, replacement);
fs.writeFileSync('src/components/Academy.tsx', modified);
