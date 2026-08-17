import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  CheckSquare,
  ArrowRight
} from 'lucide-react';

interface QuestionItem {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export function Module26FinalAssessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const questions: QuestionItem[] = [
    {
      id: 1,
      category: 'Terminology & Workflow',
      question: 'What is the correct sequential progression of a customer order in NordBase?',
      options: [
        'Lead → Job → Request → Verification',
        'Request → Verification → Lead → Job',
        'Job → Lead → Verification → Request',
        'Verification → Job → Lead → Request'
      ],
      correctIdx: 1,
      explanation: 'Every order begins as a raw Request, undergoes Customer Verification, becomes a published Lead, and transitions into a Job when accepted by a Specialist.'
    },
    {
      id: 2,
      category: 'TP Role Boundaries',
      question: 'Which of the following is directly within a Territory Partner’s standard authority?',
      options: [
        'Adjudicating quality disputes and issuing refunds from NordBase bank accounts',
        'Verifying local customer requests, creating accurate leads, and selecting qualified specialists',
        'Changing regional pricing policies and modifying platform codebase',
        'Granting legal guarantees for specialist workmanship'
      ],
      correctIdx: 1,
      explanation: 'TPs manage daily local operations (verification, lead creation, specialist selection, job progress) within established platform authority.'
    },
    {
      id: 3,
      category: 'Specialist Status',
      question: 'Under the NordBase operating model, what is the legal/operational status of a Specialist?',
      options: [
        'Direct employee of NordBase earning hourly wages',
        'Independent entrepreneur or registered company utilizing NordBase software',
        'Subcontractor hired directly by the Territory Partner',
        'NordBase franchisee'
      ],
      correctIdx: 1,
      explanation: 'Specialists are independent entrepreneurs or companies. NordBase provides marketplace software and lead generation.'
    },
    {
      id: 4,
      category: 'Lead vs Job Definition',
      question: 'What is the key difference between a "Lead" and a "Job" in NordBase?',
      options: [
        'A Lead is an unverified phone call; a Job is an invoice.',
        'A Lead is a verified order offered to Specialists; a Job is an accepted order in active execution.',
        'A Lead is created by the RP; a Job is created by the Admin.',
        'There is no difference; they mean the exact same thing.'
      ],
      correctIdx: 1,
      explanation: 'A Lead is a qualified opportunity offered to suitable specialists; once a Specialist accepts, it transitions into an active Job.'
    },
    {
      id: 5,
      category: 'Official Communication',
      question: 'Why should key project decisions and agreements be recorded inside NordBase Chat?',
      options: [
        'Because external apps are strictly encrypted.',
        'Because NordBase Chat preserves official system logs, enables AI translation, and provides evidence during moderation.',
        'Because TPs earn extra fees for every chat message.',
        'It is not required; voice calls outside the system are preferred.'
      ],
      correctIdx: 1,
      explanation: 'NordBase Chat maintains searchable logs, built-in AI translation, and verifiable evidence if moderation is needed.'
    },
    {
      id: 6,
      category: 'Dispute Boundaries',
      question: 'A Customer demands that NordBase compensate them for a delayed painting job. What is NordBase’s role?',
      options: [
        'NordBase is a contract party and must pay the customer immediately.',
        'NordBase is an independent software platform, not a party to the commercial contract; TP records facts neutrally.',
        'TP must pay the customer using personal commission funds.',
        'RP must judge who is guilty and fine the customer.'
      ],
      correctIdx: 1,
      explanation: 'NordBase is not a party to the commercial agreement between Customer and Specialist. TP records objective facts without promising funds.'
    },
    {
      id: 7,
      category: 'Platform Moderation',
      question: 'When does a commercial dispute become a NordBase Platform Issue requiring Moderation?',
      options: [
        'When the customer asks for a discount on paint.',
        'When a party violates platform rules (e.g. harassment, off-platform circumvention, fraud, fake profiles).',
        'When the specialist arrives 5 minutes early.',
        'Whenever a job takes more than 2 hours.'
      ],
      correctIdx: 1,
      explanation: 'Platform moderation intervenes specifically when platform terms, conduct rules, or security policies are breached.'
    },
    {
      id: 8,
      category: 'Escalation Hierarchy',
      question: 'What is the mandatory escalation path when an operational issue exceeds TP authority?',
      options: [
        'TP → Super Admin → Customer',
        'TP → RP → Admin / Super Admin',
        'TP → External Attorney → RP',
        'TP → Specialist → RP'
      ],
      correctIdx: 1,
      explanation: 'The strict escalation hierarchy is TP → RP → Admin / Super Admin.'
    },
    {
      id: 9,
      category: 'Financial Model & Lead Fee',
      question: 'For a standard €20 Lead Fee paid by a Specialist to NordBase, what is the TP’s commission share?',
      options: [
        '100% (€20)',
        '40% (€8)',
        '10% (€2)',
        '0% (TP works on salary)'
      ],
      correctIdx: 1,
      explanation: 'Specialist keeps 100% of revenue from Customer. Specialist pays Lead Fee to NordBase (€20), and TP receives a 40% commission share (€8).'
    },
    {
      id: 10,
      category: 'Emergency / Safety Protocol',
      question: 'If a TP encounters an unlisted emergency safety situation or undefined security procedure in the field, what rule applies?',
      options: [
        'Invent a custom legal policy on the spot.',
        'Follow established escalation hierarchy (TP → RP) and reference "TBD — requires definition" for missing formal policy.',
        'Ignore the issue completely.',
        'Close all active jobs in the territory.'
      ],
      correctIdx: 1,
      explanation: 'When a formal policy is marked TBD, TP escalates facts to RP immediately without inventing unapproved legal policies.'
    }
  ];

  const handleSelect = (qId: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIdx) score++;
    });
    return score;
  };

  const score = calculateScore();
  const passed = score >= 8; // 80% passing threshold

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 26</span>
            <h3 className="text-xl font-bold text-white font-display">Final Assessment — TP Certification</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This comprehensive evaluation tests practical understanding of the NordBase operating model, terminology, boundaries, financial flow, and escalation protocol.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Evaluation Requirement:</strong>
        Score 80% or higher (at least 8 out of 10 correct) to demonstrate readiness for independent Territory Partner operations.
      </div>

      {/* Questions Form */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selectedOpt = answers[q.id];
          const isSelected = selectedOpt !== undefined;

          return (
            <div key={q.id} className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold uppercase">Question {idx + 1} of 10</span>
                <span className="text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">{q.category}</span>
              </div>

              <h5 className="text-sm font-bold text-white font-display leading-snug">
                {q.question}
              </h5>

              <div className="space-y-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isChoice = selectedOpt === optIdx;
                  let style = "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-cyan-500/40";

                  if (submitted) {
                    if (optIdx === q.correctIdx) {
                      style = "bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-medium";
                    } else if (isChoice) {
                      style = "bg-rose-950/40 border-rose-500/60 text-rose-200";
                    } else {
                      style = "bg-slate-900/30 border-slate-800/60 text-slate-500 opacity-60";
                    }
                  } else if (isChoice) {
                    style = "bg-cyan-950/40 border-cyan-500 text-cyan-200 font-medium";
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-3 ${style}`}
                    >
                      <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] text-slate-300">
                  <strong className="text-cyan-400 font-mono block mb-0.5">Explanation:</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Results Actions */}
      {!submitted ? (
        <div className="p-6 bg-[#050A1A] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            <span>Answered: </span>
            <strong className="text-cyan-400 font-mono font-bold text-sm">{Object.keys(answers).length} / 10</strong>
          </div>
          <button
            disabled={Object.keys(answers).length < 10}
            onClick={() => setSubmitted(true)}
            className="w-full sm:w-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>Submit Final Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className={`p-6 rounded-2xl border ${passed ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-rose-950/30 border-rose-500/50'} space-y-4`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {passed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-display">
                {passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
              </h4>
              <p className="text-xs font-mono text-slate-300">
                Score: <strong className={passed ? 'text-emerald-400' : 'text-rose-400'}>{score} / 10 ({score * 10}%)</strong>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {passed 
              ? 'Congratulations! You have demonstrated a thorough understanding of NordBase territory operations, dispute boundaries, financial mechanics, and escalation protocols.' 
              : 'Please review the course modules and retake the assessment to reach the required 80% passing score.'}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
              }}
              className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs text-slate-200 rounded-xl font-mono flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
