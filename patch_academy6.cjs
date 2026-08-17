const fs = require('fs');
const content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const targetStr = `    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center`;

const insertion = `    if (expandedSection === 'sec_6_1') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">How Ratings Work</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Your rating is a reflection of your quality and reliability. It directly impacts your ability to get the best leads on the platform.
          </p>
          
          <div className="relative border-l-2 border-slate-800 ml-4 mt-8 space-y-8 pb-4">
            <div className="relative pl-8">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-500/50 flex items-center justify-center text-xs font-bold text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]"><Star className="w-4 h-4" /></div>
              <h4 className="text-lg font-bold text-white mb-2">The 5-Star System</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                After a job is completed, clients can rate you from 1 to 5 stars. Your overall rating is the average of all these reviews.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-blue-500/50 flex items-center justify-center text-xs font-bold text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">2</div>
              <h4 className="text-lg font-bold text-white mb-2">Algorithm Visibility</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Specialists with higher ratings (e.g., 4.8 and above) get notified about new, high-value leads faster than those with lower ratings.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-500/50 flex items-center justify-center text-xs font-bold text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">3</div>
              <h4 className="text-lg font-bold text-white mb-2">Operator Trust</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your Local Operator monitors ratings. If your rating drops too low, they will contact you to discuss the issues, which may lead to account suspension.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_6_2') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Reviews & Feedback</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Written reviews provide context to your star rating and are visible to Operators.
          </p>
          
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl mt-4">
            <h4 className="text-lg font-bold text-white mb-4">How to Get Great Reviews</h4>
            <ul className="list-disc list-inside space-y-3 text-sm text-slate-300">
              <li><strong>Always be punctual:</strong> Arriving on time is half the battle.</li>
              <li><strong>Clean up:</strong> Leaving the space spotless shows respect.</li>
              <li><strong>Clear communication:</strong> Keep the client updated throughout the process.</li>
              <li><strong>Ask for it!</strong> At the end of a successful job, simply ask: "If you're happy with my work, I'd really appreciate a good review on NordBase."</li>
            </ul>
          </div>
          
          <div className="mt-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl border-l-4 border-l-blue-500">
            <p className="text-sm text-slate-400 leading-relaxed">
              If you receive an unfair or fake review, contact your Local Operator immediately. They can investigate and potentially remove it if it violates our guidelines.
            </p>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_6_3') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Verified Specialist Status</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            This is the highest level of trust on the NordBase platform.
          </p>
          
          <div className="p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl mt-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Shield className="w-32 h-32 text-cyan-400" />
            </div>
            <h4 className="text-lg font-bold text-cyan-400 mb-3 relative z-10">Benefits of the Badge</h4>
            
            <ul className="space-y-3 text-sm text-slate-300 relative z-10">
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Priority Lead Access:</strong> You see premium leads before anyone else.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Higher Client Trust:</strong> If a client requests a specific specialist, you're more likely to be recommended by the Operator.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Faster Dispute Resolution:</strong> Your track record speaks for itself during conflict mediation.</span>
              </li>
            </ul>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_6_4') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Reasons for Rating Drops</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Avoid these common mistakes to maintain a high rating and stay on the platform.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Lateness or No-Shows</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  Failing to arrive without notifying the client is the fastest way to get a 1-star review and a warning from your Operator.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Hidden Costs</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  Changing the agreed price after arriving or finishing the work will almost certainly result in negative feedback.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Poor Quality Work</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  If the problem persists immediately after you leave, the client will complain. Always verify your work before departing.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Unprofessional Behavior</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  Rude communication, making a mess, or smoking on the client's property are common complaints.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }`;

const modified = content.replace(targetStr, insertion + '\n\n' + targetStr);
fs.writeFileSync('src/components/Academy.tsx', modified);
