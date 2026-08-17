import React, { useState } from 'react';
import { 
  PlayCircle, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  ShieldAlert,
  MessageSquare,
  DollarSign,
  UserCheck,
  Globe,
  Clock,
  Briefcase
} from 'lucide-react';

interface ScenarioItem {
  id: number;
  title: string;
  situation: string;
  question: string;
  options: { label: string; correct: boolean; feedback: string }[];
  expectedPrinciple: string;
  fullExplanation: string;
  icon: React.ElementType;
}

export function Module25PracticalScenarios() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExpl, setShowExpl] = useState<Record<number, boolean>>({});

  const scenarios: ScenarioItem[] = [
    {
      id: 1,
      title: 'Scenario 1 — Suspicious / Fake Request',
      icon: AlertTriangle,
      situation: 'A Customer submits a strange Request with incomplete details and an invalid address. When you attempt verification via call/chat, the Customer repeatedly refuses to clarify work scope or verify details.',
      question: 'What should the TP do?',
      options: [
        { label: 'Create the Lead anyway and send it to the nearest Specialist to deal with.', correct: false, feedback: 'Incorrect. Sending unverified or suspicious leads wastes specialist time and harms trust.' },
        { label: 'Do not create an unverified Lead. Hold the Request and attempt verification or cancel according to verification protocol.', correct: true, feedback: 'Correct! Never push unverified Requests into the marketplace.' },
        { label: 'Pay the Specialist out of TP commission to check the address.', correct: false, feedback: 'Incorrect. TPs do not pay specialists or create fake assignments.' }
      ],
      expectedPrinciple: 'Do not create an unverified Lead.',
      fullExplanation: 'Quality control begins at verification. If a Customer refuses to verify basic details or details appear fake, the TP must never publish an unverified Lead into the Specialist pool.'
    },
    {
      id: 2,
      title: 'Scenario 2 — Wrong Specialist vs Distance',
      icon: Briefcase,
      situation: 'A Lead requires a certified electrician for high-voltage panel repair. The closest available Specialist is a general handyman 2 km away, while a certified electrician is 12 km away.',
      question: 'What should the TP do?',
      options: [
        { label: 'Assign the handyman because they are closest and distance is the only metric.', correct: false, feedback: 'Incorrect. Skill mismatches lead to failed jobs, safety hazards, and complaints.' },
        { label: 'Choose suitability over distance: Select the certified electrician qualified for high-voltage work.', correct: true, feedback: 'Correct! Competence and trade qualifications always precede geographic proximity.' },
        { label: 'Cancel the Request completely without checking further.', correct: false, feedback: 'Incorrect. Qualified specialists within reasonable distance must be selected.' }
      ],
      expectedPrinciple: 'Choose suitability over distance.',
      fullExplanation: 'Matching the correct trade competence and qualification to the task requirement is essential for job success and safety.'
    },
    {
      id: 3,
      title: 'Scenario 3 — Specialist Declines Lead',
      icon: UserCheck,
      situation: 'You dispatch a qualified Lead to a selected Specialist, but the Specialist declines the offer due to schedule conflict.',
      question: 'What should the TP do?',
      options: [
        { label: 'Find another suitable Specialist according to the established selection workflow.', correct: true, feedback: 'Correct! Decline handling follows standard candidate succession.' },
        { label: 'Penalize the Customer and close the Request immediately.', correct: false, feedback: 'Incorrect. Specialist decline is a normal workflow step.' },
        { label: 'Force the Specialist to accept by calling them repeatedly.', correct: false, feedback: 'Incorrect. Specialists are independent entrepreneurs with autonomy.' }
      ],
      expectedPrinciple: 'Find another suitable Specialist according to the established workflow.',
      fullExplanation: 'Specialists have full autonomy to accept or decline offers. Upon decline, the TP smoothly re-routes the Lead to the next qualified candidate.'
    },
    {
      id: 4,
      title: 'Scenario 4 — Customer Quality Dispute',
      icon: ShieldAlert,
      situation: 'A Customer contacts the TP expressing dissatisfaction with the quality of paint work performed by a Specialist and demands a direct refund from NordBase.',
      question: 'What should the TP do?',
      options: [
        { label: 'Promise the Customer that NordBase will issue a full refund immediately.', correct: false, feedback: 'Incorrect. NordBase is not a party to the commercial contract and cannot promise refunds.' },
        { label: 'Remain neutral, record factual statements without taking sides, and remind both parties that NordBase is a platform recorder.', correct: true, feedback: 'Correct! TP preserves neutrality and documents objective facts.' },
        { label: 'Block the Specialist’s account immediately without checking.', correct: false, feedback: 'Incorrect. Quality disputes between independent parties are not automatic platform suspensions.' }
      ],
      expectedPrinciple: 'Remain neutral. NordBase is not a party to the commercial relationship.',
      fullExplanation: 'NordBase provides software infrastructure connecting independent parties. TP records facts objectively and never takes financial liability or side in commercial disputes.'
    },
    {
      id: 5,
      title: 'Scenario 5 — Specialist No-Show',
      icon: Clock,
      situation: 'The scheduled meeting time passes, and the Customer reports that the Specialist has not arrived at the job location.',
      question: 'What should the TP do?',
      options: [
        { label: 'Ignore the Customer and wait 24 hours to see if they show up.', correct: false, feedback: 'Incorrect. No-shows require immediate communication recovery.' },
        { label: 'Restore communication with Specialist, inform Customer politely, log the incident, and initiate replacement workflow if needed.', correct: true, feedback: 'Correct! Timely communication and factual status recording restores control.' },
        { label: 'Argue with the Customer and blame them for not waiting long enough.', correct: false, feedback: 'Incorrect. Never argue or blame customers.' }
      ],
      expectedPrinciple: 'Restore communication, inform the Customer, record the situation and follow the appropriate procedure.',
      fullExplanation: 'Prompt intervention keeps participants informed, documents the exact timeline in NordBase, and arranges a replacement specialist if necessary.'
    },
    {
      id: 6,
      title: 'Scenario 6 — Language Barrier',
      icon: Globe,
      situation: 'A Portuguese-speaking Customer and a Russian-speaking Specialist are connected on a Job and struggling to communicate.',
      question: 'What tools should the TP utilize?',
      options: [
        { label: 'Direct both parties to communicate inside NordBase Chat using the built-in real-time AI Translator.', correct: true, feedback: 'Correct! NordBase Chat automatically translates messages across languages seamlessly.' },
        { label: 'Tell them to cancel the Job because cross-language work is prohibited.', correct: false, feedback: 'Incorrect. AI Translator exists specifically to enable multi-lingual cooperation.' },
        { label: 'Translate manually via external personal SMS.', correct: false, feedback: 'Incorrect. Unofficial off-platform channels lose system logs and translation support.' }
      ],
      expectedPrinciple: 'NordBase Chat and AI Translator.',
      fullExplanation: 'NordBase Chat provides built-in real-time AI translation, allowing international customers and specialists to converse smoothly without leaving official channels.'
    },
    {
      id: 7,
      title: 'Scenario 7 — Payment Disagreements',
      icon: DollarSign,
      situation: 'The Customer states they paid cash directly to the Specialist, but the Specialist claims they were only partially paid.',
      question: 'What should the TP do?',
      options: [
        { label: 'Check available information, avoid verbal promises or cash guarantees, record facts neutrally, and follow the payment protocol.', correct: true, feedback: 'Correct! TP reviews documented logs without making financial guarantees.' },
        { label: 'Pay the Specialist out of TP’s personal bank account.', correct: false, feedback: 'Incorrect. TPs must never use personal funds for participant disputes.' },
        { label: 'Call the Customer and threaten them with legal action immediately.', correct: false, feedback: 'Incorrect. Unprofessional aggression violates NordBase conduct.' }
      ],
      expectedPrinciple: 'Check the available information, avoid promises, record the issue and follow the payment procedure.',
      fullExplanation: 'Direct payments occur strictly between Customer and Specialist. TP inspects chat history, logs the statement, and follows standard financial review procedures.'
    },
    {
      id: 8,
      title: 'Scenario 8 — Deliberate Platform Abuse',
      icon: ShieldAlert,
      situation: 'A Specialist routinely asks Customers in chat to bypass NordBase, cancel the Job on platform, and pay them privately off-platform.',
      question: 'What should the TP do?',
      options: [
        { label: 'Ignore the behavior as long as the Specialist does good technical work.', correct: false, feedback: 'Incorrect. Off-platform circumvention damages marketplace safety and policy.' },
        { label: 'Document chat evidence and timestamps, then escalate immediately for NordBase platform moderation.', correct: true, feedback: 'Correct! Rule violations and platform circumvention require RP/Admin moderation.' },
        { label: 'Shout at the Specialist over a phone call.', correct: false, feedback: 'Incorrect. Professional factual reporting to moderation is required.' }
      ],
      expectedPrinciple: 'Document facts and escalate for NordBase moderation.',
      fullExplanation: 'Off-platform circumvention and terms violations are platform-level infractions. The TP collects chat logs and escalates to Moderation for account enforcement.'
    }
  ];

  const handleSelectOption = (scenarioId: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [scenarioId]: optionIdx }));
    setShowExpl(prev => ({ ...prev, [scenarioId]: true }));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 25</span>
            <h3 className="text-xl font-bold text-white font-display">Practical Scenarios — Real TP Situations</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This interactive module tests decision-making across 8 realistic operational scenarios encountered during daily territory management in NordBase.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Apply core NordBase principles (verification strictness, trade suitability, platform neutrality, AI translation, factual escalation) to practical field scenarios.
      </div>

      {/* Scenario Cards */}
      <div className="space-y-6">
        {scenarios.map((sc) => {
          const IconComp = sc.icon;
          const selectedIdx = selectedAnswers[sc.id];
          const isAnswered = selectedIdx !== undefined;

          return (
            <div key={sc.id} className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white font-display">{sc.title}</h4>
              </div>

              {/* Situation Box */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 font-mono block mb-1">SITUATION:</strong>
                {sc.situation}
              </div>

              <p className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                {sc.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {sc.options.map((opt, optIdx) => {
                  const isSelected = selectedIdx === optIdx;
                  let btnStyle = "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-cyan-500/40";
                  if (isAnswered) {
                    if (opt.correct) {
                      btnStyle = "bg-emerald-950/40 border-emerald-500/60 text-emerald-200";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-950/40 border-rose-500/60 text-rose-200";
                    } else {
                      btnStyle = "bg-slate-900/30 border-slate-800/60 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(sc.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isAnswered && opt.correct ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isAnswered && isSelected && !opt.correct ? (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-mono">
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <span>{opt.label}</span>
                        {isAnswered && isSelected && (
                          <p className={`text-[11px] font-mono ${opt.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {opt.feedback}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Revealed Explanation & Principle */}
              {isAnswered && (
                <div className="mt-4 p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold uppercase">
                    <Sparkles className="w-4 h-4" />
                    Key Operating Principle:
                  </div>
                  <p className="font-bold text-white text-sm">
                    “{sc.expectedPrinciple}”
                  </p>
                  <p className="text-slate-300 leading-relaxed text-[11px] border-t border-cyan-900/40 pt-2">
                    {sc.fullExplanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
