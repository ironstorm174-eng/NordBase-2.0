import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Workflow, 
  MessageSquare, 
  GraduationCap, 
  Monitor, 
  ChevronDown, 
  ChevronRight,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

interface GlossaryTerm {
  term: string;
  def: string;
  explanation?: string;
  badge?: string;
}

interface GlossaryCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  terms: GlossaryTerm[];
}

export function Module01Glossary() {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    process: true,
    people: true,
    territory: false,
    comm: false,
    academy: false,
    system: false,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories: GlossaryCategory[] = [
    {
      id: 'process',
      title: 'Work Process & Core Lifecycle (Request → Job)',
      icon: Workflow,
      terms: [
        {
          term: 'Request',
          def: "The customer's initial request for work or a service.",
          explanation: 'Can arrive via Portal, Phone, or WhatsApp. Must be logged in NordBase system of record.',
          badge: 'Step 1'
        },
        {
          term: 'Verification',
          def: 'The process of checking and confirming the request and the customer.',
          explanation: 'TP verifies the customer identity, exact address, issue reality, and time frame via live phone call.',
          badge: 'Step 2'
        },
        {
          term: 'Lead',
          def: 'A qualified and verified request prepared for a Specialist.',
          explanation: 'Contains all details needed for a Specialist to make an informed decision before purchase.',
          badge: 'Step 3'
        },
        {
          term: 'Qualified Lead',
          def: 'A thoroughly vetted Lead with verified customer approval, precise address, scope, and timeline.',
          explanation: 'Ready for immediate offer dispatch to eligible Verified Specialists.'
        },
        {
          term: 'Job',
          def: 'A Lead accepted by a Specialist and moved into active work.',
          explanation: 'Created immediately after the Specialist accepts the offered Lead. Status transitions to active execution.',
          badge: 'Step 4'
        },
        {
          term: 'Lead Fee',
          def: 'The fixed or algorithmic fee paid by the Specialist to purchase the Lead.',
          explanation: 'Deducted from Specialist wallet balance upon Lead acceptance.'
        }
      ]
    },
    {
      id: 'people',
      title: 'People & Roles',
      icon: Users,
      terms: [
        {
          term: 'Customer',
          def: 'An individual or entity requesting work or services on the NordBase platform.'
        },
        {
          term: 'Specialist',
          def: 'An independent entrepreneur or company performing technical service work.',
          explanation: 'Purchases Leads, accepts Jobs, and receives direct payment from Customer.'
        },
        {
          term: 'TP — Territory Partner',
          def: 'An independent entrepreneur responsible for managing NordBase operations in a specific territory.',
          explanation: 'Processes Requests, verifies customers, crafts Leads, selects Specialists, and oversees Job execution.'
        },
        {
          term: 'RP — Regional Partner',
          def: 'A partner responsible for managing and developing a region containing multiple Territory Hubs.',
          explanation: 'Supports TPs, handles escalations, and ensures regional compliance.'
        },
        {
          term: 'National Partner',
          def: 'Partner overseeing platform operations and ecosystem expansion across an entire country.'
        },
        {
          term: 'Admin',
          def: 'Operational system administrator assisting with platform technical, moderation, and infrastructure support.'
        },
        {
          term: 'Super Admin',
          def: 'Global system administrator with top-level governance rights across all territories and regions.'
        }
      ]
    },
    {
      id: 'territory',
      title: 'Territory Structure',
      icon: MapPin,
      terms: [
        {
          term: 'Territory',
          def: 'A defined local geographical zone operated by a dedicated Territory Partner (TP).'
        },
        {
          term: 'Hub',
          def: 'The operational unit and digital dashboard center governing a single Territory.'
        },
        {
          term: 'Region',
          def: 'A cluster of geographical territories managed under an RP.',
          explanation: 'A Region typically contains between 3 and 25 Hubs.'
        },
        {
          term: 'Island Hub',
          def: 'An isolated or autonomous territory hub operating on a specific geographic island or remote zone.'
        }
      ]
    },
    {
      id: 'comm',
      title: 'Communication',
      icon: MessageSquare,
      terms: [
        {
          term: 'Chat',
          def: 'Integrated messaging module within NordBase Dashboard for direct communication between participants.'
        },
        {
          term: 'AI Translator',
          def: 'Automated real-time translation tool enabling seamless multi-language communication.'
        },
        {
          term: 'Admin Intervention',
          def: 'Formal step where platform administration steps in to resolve platform rule or technical issues.'
        },
        {
          term: 'Moderation',
          def: 'System and human oversight ensuring all participants adhere to NordBase community and security rules.'
        }
      ]
    },
    {
      id: 'academy',
      title: 'Academy & Programs',
      icon: GraduationCap,
      terms: [
        {
          term: 'NordBase Academy',
          def: 'The central educational portal providing structured training across all platform roles.'
        },
        {
          term: 'TP Academy',
          def: 'Comprehensive training course certifying Territory Partners from onboarding to full operation.'
        },
        {
          term: 'RP Academy',
          def: 'Specialized training program for Regional Partners on scaling and supporting territory networks.'
        },
        {
          term: 'Specialist Academy',
          def: 'Onboarding and operating rules guide for Verified Specialists.'
        },
        {
          term: 'Seeding / Seeding Program',
          def: 'Initial phase of launching a new territory by registering and onboarding foundational Specialists.'
        }
      ]
    },
    {
      id: 'system',
      title: 'System & Tools',
      icon: Monitor,
      terms: [
        {
          term: 'Dashboard',
          def: 'The main web workspace where TPs manage Requests, Leads, Jobs, Specialists, and Financials.'
        },
        {
          term: 'Audit Log',
          def: 'Immutable system log recording all status updates, timestamped actions, and financial events.'
        },
        {
          term: 'Admin Mode',
          def: 'Elevated view in Dashboard allowing administrative oversight and support.'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Intro Summary */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          NordBase Glossary Overview
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Official definitions and terminology used throughout NordBase. Accurate usage of these terms is mandatory for clear communication across Customers, Specialists, TPs, RPs, and System Admins.
        </p>
      </div>

      {/* Critical Terminology Banner — Request -> Verification -> Lead -> Job */}
      <div className="bg-gradient-to-r from-blue-950/80 via-[#0A1128] to-cyan-950/80 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider rounded-full border border-cyan-500/40">
            Critical Workflow Lifecycle
          </span>
        </div>

        <h4 className="text-xl font-black text-white mb-2 font-display">
          Request → Verification → Lead → Job
        </h4>
        <p className="text-slate-300 text-sm mb-6">
          The strict, non-negotiable progression of every service opportunity in NordBase:
        </p>

        {/* Visual Process Flow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative">
            <span className="text-xs font-mono text-cyan-400 font-bold">01. REQUEST</span>
            <h5 className="font-bold text-white text-sm my-1">Customer Request</h5>
            <p className="text-xs text-slate-400">Initial unverified request for work or service submitted via Portal, Phone, or WhatsApp.</p>
          </div>

          <div className="bg-slate-900/90 border border-cyan-800/60 rounded-xl p-4 relative">
            <span className="text-xs font-mono text-cyan-400 font-bold">02. VERIFICATION</span>
            <h5 className="font-bold text-white text-sm my-1">Customer Audit</h5>
            <p className="text-xs text-slate-400">TP confirms customer identity, real problem, precise address, time frame, and readiness.</p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-800/60 rounded-xl p-4 relative">
            <span className="text-xs font-mono text-emerald-400 font-bold">03. LEAD</span>
            <h5 className="font-bold text-white text-sm my-1">Qualified Lead</h5>
            <p className="text-xs text-slate-400">Vetted order prepared for Specialist. The Specialist <strong>purchases</strong> the Lead.</p>
          </div>

          <div className="bg-slate-900/90 border border-purple-800/60 rounded-xl p-4 relative">
            <span className="text-xs font-mono text-purple-400 font-bold">04. JOB</span>
            <h5 className="font-bold text-white text-sm my-1">Active Job</h5>
            <p className="text-xs text-slate-400">Lead accepted by Specialist and transitioned into active work execution.</p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-cyan-900/40 flex items-start gap-3 text-xs text-cyan-200">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            <strong>Rule:</strong> Never use <em>Lead</em> and <em>Job</em> as synonyms. A Lead becomes a Job ONLY after acceptance by the Specialist.
          </p>
        </div>
      </div>

      {/* Interactive Glossary Accordion */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isOpen = openCategories[cat.id] ?? false;

          const filteredTerms = cat.terms.filter(t => 
            searchTerm === '' || 
            t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.def.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (searchTerm !== '' && filteredTerms.length === 0) return null;

          return (
            <div key={cat.id} className="bg-[#050A1A] border border-blue-900/30 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between p-5 text-left bg-[#0A1128]/60 hover:bg-[#0A1128] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-base font-display">{cat.title}</h4>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                    {filteredTerms.length} terms
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {isOpen && (
                <div className="p-5 pt-2 space-y-3 divide-y divide-blue-900/20">
                  {filteredTerms.map((item, idx) => (
                    <div key={idx} className="pt-3 first:pt-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="font-bold text-cyan-300 text-sm font-mono flex items-center gap-2">
                          {item.term}
                          {item.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded">
                              {item.badge}
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed">{item.def}</p>
                      {item.explanation && (
                        <p className="text-slate-400 text-xs mt-1 italic border-l-2 border-slate-700 pl-2">
                          {item.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Standard 5-Point Lesson Framework (Rule 7) */}
      <div className="mt-10 space-y-4 pt-6 border-t border-blue-900/30">
        <h4 className="text-base font-bold text-white uppercase font-mono tracking-wider text-slate-400 mb-2">
          Lesson Framework Summary
        </h4>

        {/* 01. What Happens */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">01</span>
            <h5 className="font-bold text-white text-sm">01. What Happens</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Terms and definitions are introduced to ensure all platform participants speak the same professional operational language across territories.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">02</span>
            <h5 className="font-bold text-white text-sm">02. What TP Does</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Uses precise NordBase terminology in daily logging, communications with Specialists, and reporting in the Dashboard.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">03</span>
            <h5 className="font-bold text-rose-300 text-sm">03. What NOT To Do</h5>
          </div>
          <p className="text-rose-200/80 text-xs leading-relaxed pl-9">
            Do NOT confuse <em>Lead</em> and <em>Job</em>. Do NOT treat unverified Requests as Leads.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">04</span>
            <h5 className="font-bold text-amber-300 text-sm">04. When Help Is Needed</h5>
          </div>
          <p className="text-amber-200/80 text-xs leading-relaxed pl-9">
            If a new operational term or scenario arises that is not covered in the Glossary, contact the RP for clarification.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">05</span>
            <h5 className="font-bold text-white text-sm">05. Practical Example</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            A customer submits a form via WhatsApp (<strong>Request</strong>). TP calls the customer, verifies address and job scope (<strong>Verification</strong>). TP publishes the formatted details (<strong>Qualified Lead</strong>). Specialist accepts and pays Lead Fee; status immediately changes to <strong>Job</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
