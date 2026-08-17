import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Plus, 
  PhoneCall, 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  FileText, 
  Upload, 
  Calculator, 
  CheckCircle2, 
  Globe, 
  UserCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ServiceCategory, Specialist } from '../types';
import { CATEGORY_SPECIALTIES } from '../data';
import { store } from '../store';
import { uploadImage } from '../utils/upload';
const CATEGORY_SUBCATEGORIES: Record<ServiceCategory, string[]> = CATEGORY_SPECIALTIES;
function calculateLeadPrice(jobValue: number) {
  const value = Math.max(50, Math.round(jobValue || 50));
  let fee = 0;
  let formulaText = '';
  if (value <= 100) {
    fee = Math.round(value * 0.20);
    formulaText = '20% of job value (up to €100)';
  } else {
    const calculated = Math.round(value * 0.15);
    fee = Math.max(20, calculated);
    formulaText = '15% of job value (above €100, min. €20)';
  }
  const tpShare = Number((fee * 0.40).toFixed(2));
  return { leadFee: fee, tpShare, formulaText, value };
}
interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorCity?: string;
  operatorId: string;
  specialists?: Specialist[];
  onOrderCreated?: (orderId: string) => void;
}
export default function CreateOrderModal({
  isOpen,
  onClose,
  operatorCity = 'Portimão',
  operatorId,
  specialists = [],
  onOrderCreated
}: CreateOrderModalProps) {
  const { t } = useTranslation();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+351 ');
  const [city, setCity] = useState(operatorCity || 'Portimão');
  const [specificLocation, setSpecificLocation] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Home Services');
  const [subcategory, setSubcategory] = useState(CATEGORY_SUBCATEGORIES['Home Services'][0]);
  const [description, setDescription] = useState('');
  const [estimatedValueStr, setEstimatedValueStr] = useState('100');
  const [customerConfirmed, setCustomerConfirmed] = useState(true);
  const [distributionMode, setDistributionMode] = useState<'marketplace' | 'direct'>('marketplace');
  const [selectedSpecialistIds, setSelectedSpecialistIds] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  if (!isOpen) return null;
  const rawValue = parseFloat(estimatedValueStr) || 0;
  const calcResult = calculateLeadPrice(rawValue);
  const isValueValid = rawValue >= 50;
  const handleCategoryChange = (cat: ServiceCategory) => {
    setCategory(cat);
    const subList = CATEGORY_SUBCATEGORIES[cat] || [];
    setSubcategory(subList[0] || 'General Works');
  };
  const processFiles = async (files: File[]) => {
    if (!files.length) return;
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    for (const f of files) {
      if (f.size > 15 * 1024 * 1024) {
        alert(`File ${f.name} exceeds 15MB.`);
        continue;
      }
      try {
        const url = await uploadImage(f);
        if (url) uploadedUrls.push(url);
      } catch (err) {
        console.warn('Upload err:', err);
      }
    }
    setAttachments((prev) => [...prev, ...uploadedUrls]);
    setIsUploading(false);
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    await processFiles(files);
    e.target.value = '';
  };
  const availableSpecialistsInCat = specialists.filter(
    (s) => (s.status === 'approved' || !s.status) && (
      (s.categories && s.categories.includes(category)) ||
      s.category === category
    )
  );
  const toggleSpecialist = (id: string) => {
    setSelectedSpecialistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!customerName.trim()) {
      setErrorMsg('Please enter the customer\'s name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setErrorMsg('Please enter a valid contact phone number for the customer.');
      return;
    }
    if (!specificLocation.trim()) {
      setErrorMsg('Please enter the exact address or location landmark.');
      return;
    }
    if (rawValue < 50) {
      setErrorMsg('The minimum job value allowed by platform rules is €50.');
      return;
    }
    if (distributionMode === 'direct' && selectedSpecialistIds.length === 0) {
      setErrorMsg('Please select at least one Specialist for a direct personal offer.');
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await store.createManualOperatorJob(
        category,
        city,
        specificLocation,
        description.trim() || subcategory,
        customerName.trim(),
        customerPhone.trim(),
        2, // estimated hours
        calcResult.value,
        calcResult.leadFee,
        operatorId,
        subcategory,
        customerConfirmed,
        attachments,
        distributionMode === 'direct' ? selectedSpecialistIds : []
      );
      if (onOrderCreated && created) {
        onOrderCreated(created.id);
      }
      onClose();
    } catch (err: any) {
      console.error('Submit order error:', err);
      setErrorMsg('Error creating Order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#070D1E] border border-blue-900/40 rounded-3xl shadow-2xl overflow-hidden my-auto text-left">
        
        {/* Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-blue-950/60 via-[#0A132C] to-cyan-950/40 border-b border-blue-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white shrink-0">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-extrabold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/20">
                  Phone Call Inquiry
                </span>
                <span className="text-xs text-slate-400 font-medium">Region: {city}</span>
              </div>
              <h2 className="text-xl font-display font-black text-white leading-tight mt-0.5">
                Create Order & Issue Lead
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-6 max-h-[78vh] overflow-y-auto custom-scrollbar">
          
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
          {/* SECTION 1: Customer Contact Info */}
          <div className="bg-slate-900/60 p-4 md:p-5 rounded-2xl border border-blue-900/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <User className="w-4 h-4 text-blue-400" />
              <span>1. Customer Contact Details (from phone call)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Customer Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Maria Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+351 912 345 678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Exact Address or Location Landmark *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Rua da Morte 12, Portimão (near Cafe Central)"
                  value={specificLocation}
                  onChange={(e) => setSpecificLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>
            </div>
          </div>
          {/* SECTION 2: Category & Subcategory */}
          <div className="bg-slate-900/60 p-4 md:p-5 rounded-2xl border border-blue-900/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>2. Service Category & Work Specification</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Service Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as ServiceCategory)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-cyan-500 font-medium cursor-pointer"
                >
                  <option value="Home Services">Home Services (Repair & Maintenance)</option>
                  <option value="Cleaning">Cleaning (Housekeeping)</option>
                  <option value="Gardening">Gardening (Lawn & Garden)</option>
                  <option value="Moving">Moving (Relocation & Movers)</option>
                  <option value="Transport">Transport (Freight & Delivery)</option>
                  <option value="Repairs">Repairs (Appliance Repair)</option>
                  <option value="Construction">Construction (Renovation & Building)</option>
                  <option value="Pools">Pools (Pool Care)</option>
                  <option value="Hospitality">Hospitality (Property Care)</option>
                  <option value="Care">Care (Home Care & Sitting)</option>
                  <option value="Lessons">Lessons (Tutoring & Education)</option>
                  <option value="Business">Business (Services)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Subcategory / Specialization *
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-cyan-500 font-medium cursor-pointer"
                >
                  {(CATEGORY_SUBCATEGORIES[category] || ['General Works']).map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Problem Description & Order Details (as reported by Customer)
              </label>
              <textarea
                rows={3}
                placeholder="Describe the task, appliance brand, scheduling preferences..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 font-medium resize-none"
              />
            </div>
            {/* Attachments / Photos */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Attach Customer Photos / Files (WhatsApp / Telegram)
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files) processFiles(Array.from(e.dataTransfer.files) as File[]);
                }}
                className={`relative flex flex-col items-center justify-center p-4 border-2 border-dashed ${
                  isDragOver ? 'border-cyan-400 bg-cyan-950/20' : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                } rounded-xl cursor-pointer transition-all`}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  accept="image/*,application/pdf"
                />
                <Upload className="w-6 h-6 mb-1 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">
                  {isUploading ? 'Uploading...' : 'Drag & drop photos or click to browse'}
                </span>
                <span className="text-xxs text-slate-400 mt-0.5">
                  Object photos, defect images, or documents (up to 10 files)
                </span>
              </div>
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {attachments.map((url, idx) => (
                    <div key={idx} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                      <img src={url} alt="upload" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/80 text-rose-400 rounded hover:bg-rose-600 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* SECTION 3: Financial Calculator */}
          <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900/80 p-4 md:p-5 rounded-2xl border border-cyan-500/30 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>3. Job Value Calculation & Lead Revenue</span>
              </div>
              <span className="text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                Min. job: €50
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Estimated Job Value (€) *
                </label>
                <div className="relative">
                  <span className="text-lg font-bold text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">€</span>
                  <input
                    type="number"
                    min={50}
                    step={5}
                    value={estimatedValueStr}
                    onChange={(e) => setEstimatedValueStr(e.target.value)}
                    className={`w-full pl-8 pr-3 py-2.5 rounded-xl border text-base font-black ${
                      !isValueValid ? 'border-rose-500 bg-rose-950/20 text-rose-300' : 'border-cyan-500/40 bg-slate-950 text-white'
                    } focus:outline-none focus:border-cyan-400`}
                  />
                </div>
                {!isValueValid && (
                  <p className="text-[11px] text-rose-400 font-semibold mt-1">
                    Minimum job value per platform policy is €50.
                  </p>
                )}
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[10px] text-slate-400 font-mono self-center mr-1">Quick select:</span>
                  {[50, 80, 120, 180, 250, 350, 500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEstimatedValueStr(val.toString())}
                      className={`px-2 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                        rawValue === val
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      €{val}
                    </button>
                  ))}
                </div>
              </div>
              {/* Realtime Lead Price Breakdown Card */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-blue-900/40 space-y-2.5">
                <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Total Job Value:</span>
                  <span className="font-extrabold text-white text-sm">€{calcResult.value}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Lead Price for Specialist:</span>
                  <span className="font-black text-cyan-400 text-base">€{calcResult.leadFee}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Formula: {calcResult.formulaText}
                </p>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-bold">Your TP Share (40%):</span>
                  <span className="font-black text-emerald-400 text-sm bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    +€{calcResult.tpShare.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            {/* Confirmation Checkbox */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-blue-900/30 flex items-start gap-3 cursor-pointer" onClick={() => setCustomerConfirmed(!customerConfirmed)}>
              <input
                type="checkbox"
                checked={customerConfirmed}
                onChange={(e) => setCustomerConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-cyan-500 border-slate-700 bg-slate-900 focus:ring-cyan-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">
                  Customer verbally confirmed estimated job value (€{calcResult.value}) over the phone
                </span>
                <span className="text-[11px] text-slate-400">
                  Client was informed of the preliminary work estimate prior to specialist dispatch.
                </span>
              </div>
            </div>
          </div>
          {/* SECTION 4: Lead Distribution Channel */}
          <div className="bg-slate-900/60 p-4 md:p-5 rounded-2xl border border-blue-900/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>4. Lead Publication & Sales Channel</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setDistributionMode('marketplace')}
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  distributionMode === 'marketplace'
                    ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="p-2 bg-blue-950 rounded-lg text-cyan-400 shrink-0 mt-0.5">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white">Territory General Marketplace</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Lead is instantly published to the Lead Terminal for all verified specialists in {city}.
                  </p>
                </div>
              </label>
              <label
                onClick={() => setDistributionMode('direct')}
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  distributionMode === 'direct'
                    ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="p-2 bg-blue-950 rounded-lg text-cyan-400 shrink-0 mt-0.5">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white">{t("op.modalDirect", "Direct Personal Offer")}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Send order directly to one or more chosen specialists in your region.
                  </p>
                </div>
              </label>
            </div>
            {/* Specialist selection list if direct mode */}
            {distributionMode === 'direct' && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 mt-3 animate-in fade-in duration-200">
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  Select Specialists to offer this order ({category}):
                </span>
                {availableSpecialistsInCat.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2 text-center">
                    No active approved specialists available in category "{category}" for region {city}. Switch to "General Marketplace".
                  </p>
                ) : (
                  <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                    {availableSpecialistsInCat.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => toggleSpecialist(s.id)}
                        className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          selectedSpecialistIds.includes(s.id)
                            ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {s.photoUrl ? (
                            <img src={s.photoUrl} alt={s.name} className="w-8 h-8 rounded-full object-cover border border-cyan-500/30" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                              {s.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-white">{s.name}</p>
                            <p className="text-[10px] text-slate-400">{s.phone} • {s.city}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedSpecialistIds.includes(s.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSpecialist(s.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded text-cyan-500 border-slate-700 bg-slate-900 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Actions Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValueValid}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : '✨ Create Order & Issue Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}