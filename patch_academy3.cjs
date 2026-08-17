const fs = require('fs');
const content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const targetStr = `    if (expandedSection === 'sec_5_2' || expandedSection === 'sec_5_3') {`;

const insertion = `    if (expandedSection === 'sec_3_1') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">What is a Lead?</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            A lead is a verified request from a client who needs a specific service in your area.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Verified</h4>
              <p className="text-sm text-slate-400 leading-relaxed">The Local Operator has already checked the request to ensure it is not spam.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Detailed</h4>
              <p className="text-sm text-slate-400 leading-relaxed">It includes the job description, approximate location, and timeframe.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Priced</h4>
              <p className="text-sm text-slate-400 leading-relaxed">The lead has a fixed price to unlock, based on the potential profit of the job.</p>
            </div>
          </div>
          
          <div className="mt-6 p-5 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex gap-4 items-center">
            <div className="shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Exclusive</h4>
              <p className="text-sm text-slate-300 leading-relaxed mt-1">
                Leads are not sold to an unlimited number of specialists. We limit the number of professionals who can buy the same lead to ensure you have a high chance of winning the job.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_3_2') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">How to Purchase a Lead</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Purchasing a lead gives you access to the client's direct contact information.
          </p>
          
          <div className="relative border-l-2 border-slate-800 ml-4 mt-8 space-y-8 pb-4">
            <div className="relative pl-8">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">1</div>
              <h4 className="text-lg font-bold text-white mb-2">Review the Details</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Carefully read the job description, location, and required time. Make sure you have the skills, tools, and availability to complete the work.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-500/50 flex items-center justify-center text-xs font-bold text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">2</div>
              <h4 className="text-lg font-bold text-white mb-2">Check the Price</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                The lead price is displayed upfront. This amount will be deducted from your Virtual Wallet when you unlock the lead.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-500/50 flex items-center justify-center text-xs font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">3</div>
              <h4 className="text-lg font-bold text-white mb-2">Click "Unlock Lead"</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Once unlocked, the client's phone number and exact address (if provided) become visible. You can now contact them directly.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_3_3') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Fast Customer Connection</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Speed is crucial. The faster you contact the client after purchasing the lead, the higher your chances of winning the job.
          </p>
          
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl mt-4">
            <h4 className="text-lg font-bold text-white mb-4">The Golden Rule: Contact within 5-10 Minutes</h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Clients are often looking for immediate solutions. If you delay calling them, another specialist might reach them first, or they might find someone else outside the platform.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-400"><strong>Call first:</strong> A phone call is always better than a text message. It builds trust instantly.</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-400"><strong>Introduce yourself:</strong> "Hello, my name is [Name], I received your request on NordBase regarding [Service]."</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-400"><strong>If they don't answer:</strong> Send a polite text or WhatsApp message and try calling again later.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_3_4') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">When to Decline an Order</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            You don't have to buy every lead you see. In fact, you should only purchase leads you are confident you can fulfill.
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">You are fully booked</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  If you cannot fit the client into your schedule within their required timeframe, let the lead go to someone else. Don't make clients wait unreasonably long.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">You lack the specific skills or tools</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  Taking on a job you are not qualified for will result in a poor outcome, a bad review, and a damaged reputation on the platform.
                </p>
              </div>
            </div>
            
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">The location is too far</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  If the travel time makes the job unprofitable, skip the lead.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_3_5') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Best Practices for Leads</h3>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Be Prepared</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Keep your Virtual Wallet topped up so you can instantly unlock high-value leads when they appear.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Ask Questions</h4>
              <p className="text-sm text-slate-400 leading-relaxed">During the first call, ask clarifying questions about the job to give a more accurate estimate and avoid surprises.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Confirm the Appointment</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Always send a quick message confirming the date and time of your arrival after the initial call.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Track Your Success</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Pay attention to which types of leads and locations are most profitable for you, and focus on those.</p>
            </div>
          </div>
        </div>
      );
    }`;

const modified = content.replace(targetStr, insertion + '\n\n' + targetStr);
fs.writeFileSync('src/components/Academy.tsx', modified);
