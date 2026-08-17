import React, { useState, } from 'react';
import { AuthUser, SpecialistService, SpecialistAvailabilitySlot } from '../types';
import { Clock, Plus, Trash, Check, Calendar, Edit3 } from 'lucide-react';
import { store } from '../store';
interface MarketplaceServicesManagerProps {
  currentUser: AuthUser;
  onUpdateUser: (updatedUser: AuthUser) => void;
}
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export default function MarketplaceServicesManager({ currentUser, onUpdateUser }: MarketplaceServicesManagerProps) {
  const [services, setServices] = useState<SpecialistService[]>(currentUser.marketplaceServices || []);
  const [availability, setAvailability] = useState<SpecialistAvailabilitySlot[]>(currentUser.marketplaceAvailability || []);
  const [aboutMe, setAboutMe] = useState(currentUser.aboutMe || currentUser.skillsDescription || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage('');
    
    setTimeout(() => {
      const updated = {
        ...currentUser,
        marketplaceServices: services,
        marketplaceAvailability: availability,
        aboutMe: aboutMe
      };
      
      onUpdateUser(updated);
      
      setIsSaving(false);
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };
  const addService = () => {
    setServices([
      ...services, 
      { id: Date.now().toString(), name: '', price: 0, durationMinutes: 60 }
    ]);
  };
  const updateService = (id: string, field: keyof SpecialistService, value: any) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };
  const addAvailability = () => {
    setAvailability([
      ...availability,
      { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' }
    ]);
  };
  const updateAvailability = (index: number, field: keyof SpecialistAvailabilitySlot, value: any) => {
    const newAvail = [...availability];
    newAvail[index] = { ...newAvail[index], [field]: value };
    setAvailability(newAvail);
  };
  const removeAvailability = (index: number) => {
    const newAvail = [...availability];
    newAvail.splice(index, 1);
    setAvailability(newAvail);
  };
  return (
    <div className="bg-[#0A1128]/95 p-8 rounded-3xl border border-blue-900/30 shadow-lg max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300 text-left">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-3xl block mb-2">📋</span>
          <h3 className="text-2xl font-display font-black text-white">Services & Schedule</h3>
          <p className="text-slate-400 mt-1">Manage your public marketplace offerings and availability.</p>
        </div>
        <div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Clock className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          {saveMessage && (
            <div className="text-emerald-400 text-sm font-bold text-right mt-2">{saveMessage}</div>
          )}
        </div>
      </div>
      <div className="space-y-12">
        {/* About Me Section */}
        <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-cyan-400" /> Public Description
            </h4>
          </div>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Tell clients about your experience, approach, and why they should choose you..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 min-h-[120px]"
          />
        </section>
        {/* Services Section */}
        <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" /> My Services
            </h4>
            <button onClick={addService} className="text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>
          
          {services.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No services added yet. Add at least one to be bookable.</p>
          ) : (
            <div className="space-y-4">
              {services.map((srv, idx) => (
                <div key={srv.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">Service Name</label>
                    <input 
                      type="text" 
                      value={srv.name}
                      onChange={(e) => updateService(srv.id, 'name', e.target.value)}
                      placeholder="e.g. Deep Cleaning, Guitar Lesson"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-slate-400 mb-1">Price (€)</label>
                    <input 
                      type="number" 
                      value={srv.price}
                      onChange={(e) => updateService(srv.id, 'price', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-slate-400 mb-1">Duration (mins)</label>
                    <select
                      value={srv.durationMinutes}
                      onChange={(e) => updateService(srv.id, 'durationMinutes', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value={30}>30 mins</option>
                      <option value={45}>45 mins</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                      <option value={180}>3 hours</option>
                      <option value={240}>4 hours</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => removeService(srv.id)}
                    className="mt-5 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Remove Service"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Availability Section */}
        <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" /> Weekly Schedule
            </h4>
            <button onClick={addAvailability} className="text-sm bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
              <Plus className="w-4 h-4" /> Add Slot
            </button>
          </div>
          
          {availability.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No schedule set. Add your available hours.</p>
          ) : (
            <div className="space-y-3">
              {availability.map((slot, idx) => (
                <div key={idx} className="flex gap-4 items-center bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                  <div className="flex-1">
                    <select
                      value={slot.dayOfWeek}
                      onChange={(e) => updateAvailability(idx, 'dayOfWeek', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="time" 
                      value={slot.startTime}
                      onChange={(e) => updateAvailability(idx, 'startTime', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                    <span className="text-slate-500">to</span>
                    <input 
                      type="time" 
                      value={slot.endTime}
                      onChange={(e) => updateAvailability(idx, 'endTime', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => removeAvailability(idx)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}