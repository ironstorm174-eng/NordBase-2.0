const fs = require('fs');
const content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const targetStr = `    if (expandedSection === 'sec_5_2' || expandedSection === 'sec_5_3') {`;

const insertion = `
    if (expandedSection === 'sec_2_1') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Profile Creation</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Your profile is your digital business card on NordBase. A well-filled profile increases trust from your Local Operator and helps you get the best leads.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Personal Details</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Provide your real name, contact number, and a professional photo. Anonymity is not allowed on our platform.</p>
            </div>
            <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Portfolio</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Upload examples of your past work. High-quality photos of your completed projects significantly boost your credibility.</p>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_2_2') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Documents</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            To ensure the safety of our clients, we require all specialists to verify their identity and professional qualifications.
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">ID Verification</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  Upload a clear photo of your passport, national ID card, or driver's license. Your data is securely stored and never shared with clients.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Certifications (Optional but Recommended)</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  If you hold any professional licenses, diplomas, or certificates (e.g., electrical safety certification), uploading them gives you access to premium, high-paying jobs.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_2_3') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Verification Process</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Once you submit your profile and documents, your Local Operator will review them.
          </p>
          
          <div className="relative border-l-2 border-slate-800 ml-4 mt-8 space-y-8 pb-4">
            <div className="relative pl-8">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">1</div>
              <h4 className="text-lg font-bold text-white mb-2">Review</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                The Operator checks your documents for validity and ensures your profile meets our quality standards. This usually takes 1-2 business days.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-500/50 flex items-center justify-center text-xs font-bold text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">2</div>
              <h4 className="text-lg font-bold text-white mb-2">Interview</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your Local Operator may schedule a brief introductory call with you to discuss your experience, expectations, and answer any questions.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-500/50 flex items-center justify-center text-xs font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">3</div>
              <h4 className="text-lg font-bold text-white mb-2">Activation</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Upon successful verification, your account is activated. You will receive a "Verified Specialist" badge and can start purchasing leads immediately.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_2_4') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Specializations</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Choose the specific services you offer to ensure you receive relevant leads.
          </p>
          
          <div className="p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl mt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Select Your Expertise</h4>
                <p className="text-sm text-slate-400">Be precise about the services you provide.</p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
              <li>Don't select categories you aren't fully qualified for. Doing so leads to bad reviews and wasted money on leads you can't fulfill.</li>
              <li>You can update your specializations at any time from your profile settings.</li>
              <li>If you have niche skills, make sure to mention them in your profile description—Operators often look for specific skills for complex requests.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (expandedSection === 'sec_2_5') {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Service Area</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Define the geographical area where you are willing to work.
          </p>
          
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl mt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Map className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Optimize Your Travel Time</h4>
                <p className="text-sm text-slate-400">Set a realistic radius.</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              You will only receive leads from clients located within your specified service area. Consider traffic and travel costs when setting your radius. It's often more profitable to dominate a smaller, local area than to travel long distances for single jobs.
            </p>
          </div>
        </div>
      );
    }
`;

const modified = content.replace(targetStr, insertion + '\n' + targetStr);
fs.writeFileSync('src/components/Academy.tsx', modified);
