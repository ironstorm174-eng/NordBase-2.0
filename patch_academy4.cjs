const fs = require('fs');
const content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const targetStr = `    if (expandedSection === 'sec_5_2' || expandedSection === 'sec_5_3') {`;

const insertion = `    if (expandedSection === 'sec_4_1') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">The First Call</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            The first phone call sets the tone for your entire relationship with the client. Make it count.
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Introduce Yourself Professionally</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  Start with a clear introduction: "Hello, this is [Your Name] from NordBase. I'm calling about your request for [Service]." This instantly builds trust.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Clarify the Problem</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  Ask a few targeted questions to understand the scope of work. E.g., "Could you describe the leak?" or "What brand is the appliance?" This helps you prepare the right tools and parts.
                </p>
              </div>
            </div>
            
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Set Expectations</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  Give them a rough estimate of when you can arrive and what the diagnostic or starting fee might be. Transparency prevents misunderstandings later.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_4_2') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Communication Before Arrival</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Keeping the client informed reduces anxiety and shows you are reliable.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Confirm the ETA</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Send a quick text message when you are on your way, letting them know your estimated time of arrival (ETA).</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Handle Delays Professionally</h4>
              <p className="text-sm text-slate-400 leading-relaxed">If you are running late due to traffic or a previous job taking longer, call the client immediately to inform them.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Verify Address Details</h4>
              <p className="text-sm text-slate-400 leading-relaxed">If the address is tricky to find, ask for specific directions, gate codes, or parking instructions in advance.</p>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_4_3') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Communication On-Site</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Your behavior while performing the service directly impacts your rating.
          </p>
          
          <div className="p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl mt-4">
            <ul className="list-disc list-inside space-y-3 text-sm text-slate-300">
              <li><strong>Be Respectful of Property:</strong> Ask before entering, wear shoe covers if appropriate, and keep your workspace tidy.</li>
              <li><strong>Explain the Process:</strong> Don't just work in silence. Briefly explain what you found during the diagnosis and how you plan to fix it. Use simple, non-technical terms.</li>
              <li><strong>Maintain Professional Boundaries:</strong> Be friendly, but remain professional. Avoid overly personal questions or complaining about other clients.</li>
              <li><strong>Safety First:</strong> If the job requires turning off water or power, inform the client before doing so.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_4_4') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Confirming the Price</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Clear pricing is the number one factor in avoiding client disputes.
          </p>
          
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl border-l-4 border-l-amber-500 mt-6">
            <h4 className="font-bold text-white text-sm mb-2">The Golden Rule of Pricing</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              <strong>Never start work until the final price is agreed upon.</strong>
            </p>
          </div>
          
          <div className="space-y-4 mt-6">
            <p className="text-sm text-slate-300">1. After inspecting the issue, give a clear breakdown of costs (labor + materials).</p>
            <p className="text-sm text-slate-300">2. If you discover additional problems while working, stop and explain the situation to the client before proceeding with extra costs.</p>
            <p className="text-sm text-slate-300">3. Avoid vague estimates. Give a precise number or a tight range.</p>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_4_5') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Completing the Order</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Leaving a good final impression guarantees great reviews and repeat business.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Show the Result</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Demonstrate that the problem is fixed. Let the client test it themselves if applicable.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Clean Up</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Always leave the work area cleaner than you found it. Dispose of old parts or packaging.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Process Payment</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Accept payment according to your agreed method. Provide a receipt if requested.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="text-lg font-bold text-white mb-2">Ask for a Review</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Politely ask the client to leave a review on your NordBase profile. Reviews are essential for getting more leads.</p>
            </div>
          </div>
        </div>
      );
    }`;

const modified = content.replace(targetStr, insertion + '\n\n' + targetStr);
fs.writeFileSync('src/components/Academy.tsx', modified);
