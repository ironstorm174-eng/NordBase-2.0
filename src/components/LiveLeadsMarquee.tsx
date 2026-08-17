import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { Job } from '../types';

const COLORS = [
  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
];

const CURATED_REALISTIC_LEADS = [
  "🔧 Plumber: Leak repair under kitchen sink (Portimão)",
  "⚡ Electrician: Breaker panel upgrade & short circuit fix (Lagos)",
  "🧹 Cleaning: 3-bedroom villa turnover deep clean (Vilamoura)",
  "🌿 Gardening: Palm tree pruning & lawn irrigation setup (Albufeira)",
  "📦 Moving: Apartment move with furniture disassembly (Faro)",
  "🏊 Pools: Water chemical balance & pump filter check (Quarteira)",
  "❄️ HVAC: Master bedroom AC unit diagnostic & recharge (Tavira)",
  "🧱 Construction: Bathroom wall tile replacement (Silves)",
  "🔑 Locksmith: Front door cylinder replacement & emergency unlock (Alvor)",
  "🪟 Windows: Panoramic villa exterior glass cleaning (Carvoeiro)",
  "🔨 Handyman: TV wall mount & floating shelf installation (Portimão)",
  "🛋️ Assembly: IKEA bedroom wardrobe & bed frame setup (Lagos)",
  "🚗 Transport: Airport transfer to Faro Airport (Vilamoura)",
  "🎨 Painting: Terrace exterior wall repainting (Albufeira)",
  "🧺 Repairs: Washing machine drum bearing replacement (Faro)",
  "🌳 Gardening: Drip irrigation network installation (Monchique)",
  "🔌 Electrician: Wall-mounted EV charger installation (Cascais)",
  "🪚 Carpenter: Custom wooden patio deck restoration (Lagos)",
  "💻 IT Support: Wi-Fi mesh network setup for office (Portimão)",
  "🐱 Care: Daily cat feeding & litter check for 5 days (Tavira)",
  "🎓 Lessons: Conversational Portuguese lessons for expat (Vilamoura)",
  "🍽️ Chef: Private seafood dinner preparation for 6 (Albufeira)",
  "🪟 Blinds: Electric roller shutter motor repair (Faro)",
  "📦 Moving: Upright piano transport with lifting gear (Porto)",
  "🚿 Plumber: Thermostatic shower mixer faucet replacement (Portimão)",
  "🧱 Masonry: Plasterboard ceiling water leak repair (Lagos)",
  "🧼 Cleaning: Sofa upholstery & carpet steam cleaning (Vilamoura)",
  "🏠 Cleaning: Weekly commercial office space maintenance (Faro)",
  "💡 Electrician: Garden LED spotlight & sensor setup (Albufeira)",
  "🧱 Masonry: Retaining stone wall mortar restoration (Silves)",
  "🚐 Courier: Express document delivery to Lisbon (Portimão)",
  "🍳 Repairs: Built-in oven heating element replacement (Lagos)",
  "🌴 Tree Surgery: High pine branch trimming near cables (Olhão)",
  "🏊 Pools: Submersible pool LED light replacement (Vilamoura)",
  "🔑 Locksmith: Car key fob programming & door unlock (Albufeira)",
  "🎸 Lessons: Beginner acoustic guitar private lessons (Faro)",
  "👶 Care: Evening babysitting for two children (Lagos)",
  "📈 Business: Annual NHR tax return filing assistance (Portimão)",
  "📸 Business: Real estate villa drone & interior photoshoot (Vilamoura)",
  "🚛 Moving: Heavy office desk & safe transport (Lisboa)",
  "🪟 Glazier: Double-glazed patio door glass replacement (Albufeira)",
  "🧯 Repairs: Refrigerator ice maker & sensor fix (Portimão)",
  "🧹 Cleaning: Post-renovation deep dust cleanup (Lagos)",
  "🌿 Gardening: Cypress perimeter hedge trimming (Tavira)",
  "👨‍💼 Business: Certified document translation EN/PT (Faro)",
  "⚡ Solar: Rooftop solar inverter diagnostic (Vilamoura)",
  "🐕 Care: Morning Golden Retriever walking (Lagos)",
  "🏋️ Lessons: Personal fitness training sessions (Albufeira)",
  "🛠️ Repairs: Tile replacement after heavy rain leak (Portimão)",
  "🚪 Carpentry: Interior wooden door alignment & hinge fix (Silves)"
];

function formatUserJob(job: Job): string {
  if ((job as any).title && typeof (job as any).title === 'string' && !(job as any).title.includes('undefined')) {
    return `📌 ${(job as any).title} (${job.city || 'Portugal'})`;
  }
  const category = job.subcategory || job.category || 'Service';
  const city = job.city || job.specificLocation || 'Portugal';
  let desc = job.description?.trim();
  if (desc && desc.length > 40) {
    desc = desc.substring(0, 37) + '...';
  }
  const labelText = desc ? `${category}: ${desc}` : category;
  return `📌 ${labelText} (${city})`;
}

export default function LiveLeadsMarquee() {
  const [userJobs, setUserJobs] = useState<Job[]>(() => store.getState().jobs || []);

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setUserJobs(state.jobs || []);
    });
    return () => unsubscribe();
  }, []);

  // Format real user submitted jobs
  const liveUserLeads = userJobs.map(formatUserJob);

  // Combine live user jobs with our curated list of 50 unique realistic leads
  const combinedLeads = Array.from(new Set([...liveUserLeads, ...CURATED_REALISTIC_LEADS]));

  // Duplicate for smooth endless looping
  const displayLeads = [...combinedLeads, ...combinedLeads];

  return (
    <div className="w-full bg-[#030712]/95 border-b border-slate-800/50 overflow-hidden flex items-center relative py-2">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#030712]/95 to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex whitespace-nowrap animate-marquee items-center gap-3 w-max">
        {displayLeads.map((lead, i) => {
          const colorClass = COLORS[i % COLORS.length];
          return (
            <div 
              key={i} 
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${colorClass}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse opacity-75"></span>
              {lead}
            </div>
          );
        })}
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#030712]/95 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}
