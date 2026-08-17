const fs = require('fs');

const content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const startIdx = content.indexOf('  const renderOperatorContent = () => {');
const endIdx = content.indexOf('  const renderContent = () => {');
if (startIdx === -1 || endIdx === -1) throw new Error('Could not find renderOperatorContent block');

const replacement = `  const renderOperatorContent = () => {
    const currentModule = operatorCurriculum.find(m => m.sections.some(s => s.id === expandedSection));
    const currentSection = currentModule?.sections.find(s => s.id === expandedSection);
    
    switch (expandedSection) {
      case 'sec_op_1_1': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Responsibilities</h3>
          <p className="text-lg text-slate-300 leading-relaxed">As a Local Operator, you are the backbone of NordBase in your region. You manage the marketplace ecosystem locally.</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white mb-2">Request Processing</h4>
              <p className="text-sm text-slate-400">Receive customer calls/requests, verify details, and format them into clear, actionable leads.</p>
            </div>
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white mb-2">Network Management</h4>
              <p className="text-sm text-slate-400">Onboard, verify, and monitor local specialists to ensure high quality of service.</p>
            </div>
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white mb-2">Dispute Resolution</h4>
              <p className="text-sm text-slate-400">Act as a mediator in conflicts between customers and specialists, processing refunds when necessary.</p>
            </div>
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white mb-2">Quality Control</h4>
              <p className="text-sm text-slate-400">Follow up with customers, collect feedback, and maintain the overall reputation of NordBase in your territory.</p>
            </div>
          </div>
        </div>
      );
      case 'sec_op_1_2': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Authority & Responsibilities</h3>
          <div className="p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl mt-4">
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /><span><strong>Pricing Authority:</strong> You set the final price of the lead based on its estimated profitability.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /><span><strong>Verification Authority:</strong> You have the power to approve or reject specialist profiles and documents.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /><span><strong>Moderation:</strong> You can issue warnings or temporarily suspend specialists who violate platform rules.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /><span><strong>Financial Responsibility:</strong> You must fairly adjudicate lead refunds to maintain specialist trust while preventing abuse.</span></li>
            </ul>
          </div>
        </div>
      );
      case 'sec_op_1_3': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">The Mission of a Local Operator</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">Your ultimate goal is to build a thriving local ecosystem where customers get reliable help and specialists earn a good living.</p>
          <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30 border-l-4 border-l-emerald-500">
            <h4 className="text-lg font-bold text-white mb-2">The Win-Win-Win Strategy</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              When a customer is happy, they return to NordBase. When a specialist makes money, they buy more leads. When both succeed, your territory grows and your earnings increase. You are the architect of this success.
            </p>
          </div>
        </div>
      );
      case 'sec_op_2_1': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Handling Incoming Calls</h3>
          <div className="space-y-4 mt-6">
             <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
               <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div></div>
               <div>
                 <h4 className="font-bold text-white text-lg">Professional Greeting</h4>
                 <p className="text-sm text-slate-400 mt-1">"Hello, NordBase Services, [Your Name] speaking. How can we help you today?"</p>
               </div>
             </div>
             <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
               <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div></div>
               <div>
                 <h4 className="font-bold text-white text-lg">Active Listening</h4>
                 <p className="text-sm text-slate-400 mt-1">Let the customer explain the issue fully before jumping in with questions. Take notes.</p>
               </div>
             </div>
             <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
               <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div></div>
               <div>
                 <h4 className="font-bold text-white text-lg">Reassurance</h4>
                 <p className="text-sm text-slate-400 mt-1">"We can certainly help with that. I will connect you with one of our top-rated local specialists right away."</p>
               </div>
             </div>
          </div>
        </div>
      );
      case 'sec_op_2_2': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Request Qualification</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">A poorly qualified request results in a bad lead. Always gather these 4 key details:</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="font-bold text-white mb-2">1. The Core Problem</h4>
              <p className="text-sm text-slate-400">What exactly is broken or needed? Get specific (e.g., "washing machine won't drain" instead of "appliance broken").</p>
            </div>
            <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="font-bold text-white mb-2">2. Location</h4>
              <p className="text-sm text-slate-400">Get the exact address or at least the neighborhood and postal code.</p>
            </div>
            <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="font-bold text-white mb-2">3. Urgency</h4>
              <p className="text-sm text-slate-400">Does it need to be fixed today (emergency) or later this week?</p>
            </div>
            <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/30">
              <h4 className="font-bold text-white mb-2">4. Context</h4>
              <p className="text-sm text-slate-400">Are there parts already purchased? Is it a commercial or residential property?</p>
            </div>
          </div>
        </div>
      );
      case 'sec_op_2_3': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Handling Customer Objections</h3>
          <div className="space-y-4">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-amber-400 mb-2">"Can you give me a price right now?"</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>Response:</strong> "Because every job is unique, the specialist needs to ask a few specific questions or see the issue to give you an accurate quote. I'll have them call you in 5 minutes to discuss the price."
              </p>
            </div>
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-amber-400 mb-2">"Is the specialist licensed and insured?"</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>Response:</strong> "Yes, all professionals on NordBase pass a strict verification process. We check their IDs and credentials before they can accept requests."
              </p>
            </div>
          </div>
        </div>
      );
      case 'sec_op_2_4': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Managing Difficult Customers</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">Not every customer is a good fit for the platform. Protect your specialists.</p>
          <ul className="list-disc list-inside space-y-3 text-sm text-slate-300 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <li><strong>De-escalation:</strong> Keep your voice calm. Let angry customers vent before offering a solution.</li>
            <li><strong>Refusing Service:</strong> If a customer is abusive, excessively drunk, or demanding illegal services, firmly state: "I'm sorry, but we cannot fulfill this request," and end the call.</li>
            <li><strong>Unrealistic Expectations:</strong> If a customer wants a major renovation done for $50 by tomorrow, politely explain market rates. If they refuse to listen, do not create the lead. It will only waste a specialist's money and result in a bad review.</li>
          </ul>
        </div>
      );
      case 'sec_op_3_1': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Creating Qualified Leads</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">The way you write the lead description determines how fast it will sell.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 border border-red-500/20 rounded-2xl bg-red-900/10">
              <h4 className="font-bold text-red-400 mb-3">Bad Example ❌</h4>
              <p className="text-sm text-slate-400 italic">"Needs a plumber asap. Leaking pipe somewhere in the house."</p>
              <p className="text-xs text-red-400 mt-4">Too vague. Specialists won't buy this because they can't estimate the work or tools needed.</p>
            </div>
            <div className="p-5 border border-emerald-500/20 rounded-2xl bg-emerald-900/10">
              <h4 className="font-bold text-emerald-400 mb-3">Good Example ✅</h4>
              <p className="text-sm text-slate-400 italic">"Water leak under the kitchen sink. Suspected P-trap issue. Client is home all day. Needs fix today."</p>
              <p className="text-xs text-emerald-400 mt-4">Clear, specific, and gives the specialist confidence to buy.</p>
            </div>
          </div>
        </div>
      );
      case 'sec_op_3_2': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Verifying Customer Information</h3>
          <div className="p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl">
            <h4 className="text-lg font-bold text-cyan-400 mb-4">The Golden Rule of Verification</h4>
            <p className="text-sm text-slate-300 mb-4">Always double-check the phone number. If the request comes via a web form, call the customer to verify the details before putting the lead on the board.</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• A lead with a fake number is an automatic refund.</li>
              <li>• A lead with a completely wrong address frustrates the specialist.</li>
              <li>• If the customer doesn't pick up the verification call, put the lead on hold.</li>
            </ul>
          </div>
        </div>
      );
      case 'sec_op_3_3': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Assigning Leads to Specialists</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">How do you decide who gets the lead?</p>
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-4 bg-slate-900/50 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">1</div>
              <div><strong className="text-white">Broadcast vs. Direct Assignment:</strong> Most leads go to the general board. For highly specific or premium jobs, you may directly offer the lead to your most trusted "Verified Specialist" first.</div>
            </div>
            <div className="flex gap-4 items-start p-4 bg-slate-900/50 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">2</div>
              <div><strong className="text-white">Proximity:</strong> Specialists closer to the job site are more likely to convert the lead into a successful job.</div>
            </div>
            <div className="flex gap-4 items-start p-4 bg-slate-900/50 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">3</div>
              <div><strong className="text-white">Rating Rotation:</strong> Prioritize specialists with high ratings, but ensure new specialists get a chance to build their reputation with simpler tasks.</div>
            </div>
          </div>
        </div>
      );
      case 'sec_op_3_4': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Lead Quality Control</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">Quality control is what separates NordBase from a simple classifieds site.</p>
          <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/30">
            <h4 className="text-lg font-bold text-white mb-3">The Follow-Up Call</h4>
            <p className="text-sm text-slate-400 mb-4">Randomly select 10-20% of completed jobs and call the customer the next day.</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
              <li>"Did [Specialist Name] resolve your issue?"</li>
              <li>"Were they polite and professional?"</li>
              <li>"Was the final price fair?"</li>
            </ul>
            <p className="text-sm text-slate-400 mt-4 italic">This feedback is invaluable for catching bad specialists early and rewarding the great ones.</p>
          </div>
        </div>
      );
      case 'sec_op_4_1': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Selecting the Right Specialist</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">Reviewing new specialist profiles is a critical daily task.</p>
          <div className="space-y-3 text-sm text-slate-300">
             <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl"><strong>Documents:</strong> Check that the ID matches the profile name and is clear.</div>
             <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl"><strong>Professionalism:</strong> Does their photo look trustworthy? Is their description clear?</div>
             <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl"><strong>The Interview:</strong> The introductory call is your chance to gauge their communication skills. If they are rude to you, they will be rude to customers.</div>
          </div>
        </div>
      );
      case 'sec_op_4_2': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Selling Leads</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">Sometimes, a great lead sits on the board because specialists are hesitant. It's your job to "sell" it.</p>
          <div className="p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl">
            <p className="text-sm text-slate-300 mb-4">If a high-value lead is pending:</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-400">
              <li>Message your top specialists directly: "Hey John, there is a great full-rewiring job in your sector. It's highly profitable. Want me to assign it to you?"</li>
              <li>Highlight the positives: Mention if the client is flexible on time or if it's a large commercial project.</li>
            </ul>
          </div>
        </div>
      );
      case 'sec_op_4_3': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Supporting Specialists</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">You are their business partner. Their success is your success.</p>
          <div className="grid sm:grid-cols-2 gap-4">
             <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/30">
               <h4 className="font-bold text-white mb-2">Onboarding Help</h4>
               <p className="text-sm text-slate-400">Guide new specialists on how to top up their wallet and set their service radius.</p>
             </div>
             <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/30">
               <h4 className="font-bold text-white mb-2">Profile Optimization</h4>
               <p className="text-sm text-slate-400">Advise them on how to improve their descriptions or add portfolio photos to win more trust.</p>
             </div>
          </div>
        </div>
      );
      case 'sec_op_4_4': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Resolving Disputes</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">When a customer and specialist clash, you must remain objective.</p>
          <div className="space-y-4">
             <div className="flex gap-4 items-start p-4 bg-slate-900/50 rounded-xl border border-slate-800">
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">1</div>
               <div><strong className="text-white block">Gather Evidence</strong><span className="text-sm text-slate-400 block mt-1">Ask both sides for their version of events. Request photos of the work if applicable.</span></div>
             </div>
             <div className="flex gap-4 items-start p-4 bg-slate-900/50 rounded-xl border border-slate-800">
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">2</div>
               <div><strong className="text-white block">Review Platform Rules</strong><span className="text-sm text-slate-400 block mt-1">Did the specialist overcharge? Did the customer change the scope of work mid-way?</span></div>
             </div>
             <div className="flex gap-4 items-start p-4 bg-slate-900/50 rounded-xl border border-slate-800">
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">3</div>
               <div><strong className="text-white block">Make a Decision</strong><span className="text-sm text-slate-400 block mt-1">If the specialist is at fault, require them to fix it or face suspension. If the customer is unreasonable, protect the specialist and process a refund if the job collapsed.</span></div>
             </div>
          </div>
        </div>
      );
      case 'sec_op_5_1': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Using the Platform Interface</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">Familiarize yourself with the Operator Dashboard.</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-400 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <li><strong>Lead Board:</strong> Where all active requests are listed.</li>
            <li><strong>Specialist CRM:</strong> Your database of professionals, their statuses, and balances.</li>
            <li><strong>Finance Tab:</strong> Monitor wallet top-ups and your commission metrics.</li>
          </ul>
        </div>
      );
      case 'sec_op_5_2': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Request Status Management</h3>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl"><strong className="text-blue-400">NEW:</strong> Just arrived, needs qualification.</div>
            <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl"><strong className="text-amber-400">PENDING:</strong> Qualified and on the board, waiting for a buyer.</div>
            <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl"><strong className="text-cyan-400">ASSIGNED:</strong> A specialist bought the lead.</div>
            <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl"><strong className="text-emerald-400">COMPLETED:</strong> Job done, ready for review.</div>
            <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl"><strong className="text-red-400">CANCELED:</strong> Invalid lead or customer backed out.</div>
          </div>
        </div>
      );
      case 'sec_op_5_3': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Chats & Internal Communication</h3>
          <p className="text-lg text-slate-300 leading-relaxed">All communication with specialists should happen strictly within the platform's chat system. This creates a permanent record that protects both you and the specialist in case of a dispute. Never use personal WhatsApp or Telegram for official platform business.</p>
        </div>
      );
      case 'sec_op_5_4': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Documents</h3>
          <p className="text-lg text-slate-300 leading-relaxed">When a specialist uploads an ID or certificate, review it in the Documents tab. Ensure the photo is clear, the name matches the profile, and the document is not expired. Click "Verify" to approve, or "Reject" with a reason if it's invalid.</p>
        </div>
      );
      case 'sec_op_5_5': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Job History</h3>
          <p className="text-lg text-slate-300 leading-relaxed">Regularly review the Job History of your top specialists and those with recent warnings. Look for patterns: high cancellation rates might indicate they are cherry-picking leads or providing poor service.</p>
        </div>
      );
      case 'sec_op_6_1': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Operator Earnings</h3>
          <div className="p-6 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl mt-4">
            <h4 className="text-lg font-bold text-emerald-400 mb-2">How You Make Money</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Operators earn a percentage of every lead sold in their territory. Your primary goal is volume and quality: more qualified leads sold = higher earnings.
            </p>
            <p className="text-sm text-slate-400 mt-4 italic">Note: Refunds are deducted from the total sales pool, so qualifying leads accurately directly protects your income.</p>
          </div>
        </div>
      );
      case 'sec_op_6_2': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Lead Refund Policy</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">You are the judge of refund requests. Be fair but firm.</p>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <strong className="text-emerald-400 block mb-1">Approve Refund If:</strong>
              Client doesn't answer after 24h, wrong number provided, client hired someone else BEFORE the specialist called (if they called within 10 mins).
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <strong className="text-red-400 block mb-1">Deny Refund If:</strong>
              Specialist called hours late, specialist couldn't do the job due to lack of skills, or specialist tried to inflate the price and lost the client.
            </div>
          </div>
        </div>
      );
      case 'sec_op_6_3': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Financial Scenarios</h3>
          <p className="text-lg text-slate-300 leading-relaxed">If a customer cancels a job midway through, or a specialist is caught accepting cash to bypass platform fees (if applicable in your region's model), escalate immediately to a Local Admin. Do not process manual custom refunds outside the standard platform flow.</p>
        </div>
      );
      case 'sec_op_7_1': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">When to Involve a Local Admin</h3>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-5 bg-red-900/10 border border-red-500/20 rounded-2xl"><h4 className="font-bold text-red-400 mb-2">Legal Threats</h4><p className="text-sm text-slate-400">If a customer or specialist threatens a lawsuit or involves the police.</p></div>
            <div className="p-5 bg-red-900/10 border border-red-500/20 rounded-2xl"><h4 className="font-bold text-red-400 mb-2">Severe Property Damage</h4><p className="text-sm text-slate-400">If a specialist causes major damage (e.g., flooding a house).</p></div>
            <div className="p-5 bg-red-900/10 border border-red-500/20 rounded-2xl"><h4 className="font-bold text-red-400 mb-2">Platform Bugs</h4><p className="text-sm text-slate-400">If wallet balances are displaying incorrectly or critical systems crash.</p></div>
            <div className="p-5 bg-red-900/10 border border-red-500/20 rounded-2xl"><h4 className="font-bold text-red-400 mb-2">Fraud Detection</h4><p className="text-sm text-slate-400">If you suspect a specialist is using fake accounts or stolen credit cards.</p></div>
          </div>
        </div>
      );
      case 'sec_op_7_2': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Conflict Resolution</h3>
          <p className="text-lg text-slate-300 leading-relaxed">Your role is a neutral mediator. Never take sides immediately. Always gather written statements in the platform chat. Propose a fair compromise (e.g., the specialist returns to fix the issue for free, or provides a partial discount). If compromise fails, enforce platform rules based on the evidence.</p>
        </div>
      );
      case 'sec_op_7_3': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Handling Complaints</h3>
          <p className="text-lg text-slate-300 leading-relaxed">Log every customer complaint on the specialist's profile. One complaint might be a misunderstanding. Three complaints in a month indicate a systemic issue that requires a formal warning or suspension.</p>
        </div>
      );
      case 'sec_op_7_4': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Standards Violations</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">Enforce the rules strictly to protect the platform.</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-400 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <li><strong>1st Offense (Minor):</strong> Written warning in chat.</li>
            <li><strong>2nd Offense:</strong> 3-day account suspension.</li>
            <li><strong>3rd Offense or Severe Violation (Theft, Abuse):</strong> Permanent Ban (requires Admin approval).</li>
          </ul>
        </div>
      );
      case 'sec_op_8_1': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Response Time</h3>
          <p className="text-lg text-slate-300 leading-relaxed">Your most critical KPI. Incoming requests must be qualified and posted to the Lead Board within <strong>15 minutes</strong> during working hours. Speed prevents customers from finding help elsewhere.</p>
        </div>
      );
      case 'sec_op_8_2': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Conversion Rate</h3>
          <p className="text-lg text-slate-300 leading-relaxed">This measures what percentage of qualified leads are successfully bought by specialists. A low conversion rate means leads are priced too high, descriptions are poor, or you don't have enough specialists in that category. Target: >85%.</p>
        </div>
      );
      case 'sec_op_8_3': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Lead Quality</h3>
          <p className="text-lg text-slate-300 leading-relaxed">Measured by the Refund Rate. If more than 10% of your leads result in refunds, your qualification process is failing. You must verify customer intent and details more rigorously.</p>
        </div>
      );
      case 'sec_op_8_4': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Operator Rating</h3>
          <p className="text-lg text-slate-300 leading-relaxed">Specialists can rate their Operator. Maintain good relationships, respond to their chat queries within 1 hour, and process refunds fairly to keep a high rating.</p>
        </div>
      );
      case 'sec_op_9_1': return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">Answers to Frequently Asked Questions</h3>
          <div className="space-y-4 mt-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white text-lg mb-2">Q: A specialist is demanding a refund for a lead that doesn't meet the refund criteria. What do I do?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">A: Politely but firmly decline the refund, citing the specific platform rule. If they become abusive, issue a formal warning.</p>
            </div>
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-white text-lg mb-2">Q: I have a huge job request but no specialist available.</h4>
              <p className="text-sm text-slate-400 leading-relaxed">A: Inform the customer of the delay. Then, actively search for local professionals outside the platform (directories, classifieds) and invite them to join NordBase for this exclusive lead.</p>
            </div>
          </div>
        </div>
      );
      default: return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-3xl font-black text-white tracking-tight mb-4">{currentSection?.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed text-lg">
            Content for this section will be added soon.
          </p>
        </div>
      );
    }
  };`;

const newContent = content.slice(0, startIdx) + replacement + '\n\n' + content.slice(endIdx);
fs.writeFileSync('src/components/Academy.tsx', newContent);
console.log('done');
