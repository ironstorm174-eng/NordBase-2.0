import { useTranslation } from "react-i18next";
import React, { useState } from 'react';
import { AuthUser, Job } from '../types';
import { store } from '../store';
import {
  User,
  Phone,
  Building,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Edit2,
  Save,
  MessageSquare,
  Send,
  PlusCircle,
  LogOut,
  MapPin,
  Shield,
  Sparkles,
  Trash2,
  Star,
  ThumbsUp,
  RotateCcw
} from 'lucide-react';
function JobCustomerReviewSection({ job, lang }: { job: Job; lang: string }) {
  const [rating, setRating] = useState<number>(job.rating || 5);
  const [selectedTags, setSelectedTags] = useState<string[]>(job.positiveTags || []);
  const [commentText, setCommentText] = useState<string>(job.customerComment || '');
  const [submitted, setSubmitted] = useState<boolean>(!!job.customerCompleted);
  const [orderCompleted, setOrderCompleted] = useState<boolean>(true);
  const [noClaims, setNoClaims] = useState<boolean>(true);
  const [paymentMade, setPaymentMade] = useState<boolean>(true);

  const canSubmit = orderCompleted && noClaims && paymentMade;

  const handleConfirmCompletion = () => {
    if (!canSubmit) return;
    store.confirmCustomerCompletion(job.id, rating, selectedTags, commentText);
    setSubmitted(true);
  };
  const isCompleted = job.customerCompleted || submitted;
  const tagOptions = [
    { id: 'punctual', pt: 'Pontualidade', en: 'Punctuality' },
    { id: 'quality', pt: 'Trabalho de qualidade', en: 'Quality work' },
    { id: 'clean', pt: 'Limpeza após trabalho', en: 'Cleanliness' },
    { id: 'polite', pt: 'Comunicação cortês', en: 'Polite communication' },
    { id: 'budget', pt: 'Cumprimento do orçamento', en: 'Adherence to estimate' }
  ];
  return (
    <div className="mt-4 p-4 rounded-2xl border bg-slate-950/80 border-blue-900/40 space-y-3">
      {isCompleted ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === 'pt'
                ? 'Trabalhos/serviços realizados, sem reclamações'
                : 'Services performed, no claims ✔'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold pt-1">
            <span className="text-slate-400 font-normal">
              {lang === 'pt' ? 'Sua avaliação:' : 'Your rating:'}
            </span>
            <div className="flex items-center text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= (job.rating || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                />
              ))}
            </div>
            <span className="text-slate-300 font-mono">({job.rating || rating}/5)</span>
          </div>
          {(job.positiveTags || selectedTags).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(job.positiveTags || selectedTags).map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-blue-950 text-cyan-300 border border-blue-800 text-[10px] font-medium rounded-lg">
                  👍 {tag}
                </span>
              ))}
            </div>
          )}
          {(job.customerComment || commentText) && (
            <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              "{job.customerComment || commentText}"
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-blue-900/30 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>
                {lang === 'pt'
                  ? 'Conclusão do Pedido e Avaliação'
                  : 'Order Completion & Review'}
              </span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400">NordBase Quality Assurance</span>
          </div>
          {/* Star Selection */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">
              {lang === 'pt'
                ? 'Avaliação do especialista (1-5 estrelas):'
                : 'Rate the specialist (1-5 stars):'}
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
              <span className="text-xs text-amber-300 font-bold font-mono ml-2">{rating} / 5</span>
            </div>
          </div>
          {/* Positive Tags */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">
              {lang === 'pt'
                ? 'Pontos fortes do especialista:'
                : 'Highlight positive aspects:'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tagOptions.map((tag) => {
                const label = lang === 'pt' ? tag.pt : tag.en;
                const isSelected = selectedTags.includes(label);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTags(selectedTags.filter((t) => t !== label));
                      } else {
                        setSelectedTags([...selectedTags, label]);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-750'
                    }`}
                  >
                    {isSelected ? '✔ ' : '+ '}{label}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Comment input */}
          <div>
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                lang === 'pt'
                  ? 'Comentário opcional sobre o serviço...'
                  : 'Optional review comment...'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          {/* Explicit Confirmation Checkboxes */}
          <div className="space-y-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={orderCompleted}
                onChange={(e) => setOrderCompleted(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-950"
              />
              <span>{lang === 'pt' ? 'Trabalho / Pedido concluído' : 'Order completed'}</span>
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={noClaims}
                onChange={(e) => setNoClaims(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-950"
              />
              <span>{lang === 'pt' ? 'Não tenho reclamações' : 'I have no claims'}</span>
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={paymentMade}
                onChange={(e) => setPaymentMade(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-950"
              />
              <span>{lang === 'pt' ? 'Pagamento efetuado ao especialista' : 'I have paid for the work'}</span>
            </label>
          </div>

          {/* Sign-off Button */}
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleConfirmCompletion}
            className={`w-full py-3 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
              canSubmit
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>
              {lang === 'pt'
                ? 'Confirmar Conclusão do Serviço'
                : 'Confirm Service Completion'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
interface CustomerDashboardProps {
  currentUser: AuthUser;
  jobs: Job[];
  onBackToMenu: () => void;
  onUpdateProfile: (name: string, phone: string) => void;
  onAddMessage: (
    jobId: string,
    sender: 'customer',
    senderName: string,
    content: string,
    channel?: 'customer_operator' | 'customer_specialist',
    attachmentUrl?: string,
    attachmentName?: string
  ) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}
export default function CustomerDashboard({
  currentUser,
  jobs,
  onBackToMenu,
  onUpdateProfile,
  onAddMessage,
  onLogout,
  onDeleteAccount,
}: CustomerDashboardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'pt';
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Active chat state
  const [activeChatJobId, setActiveChatJobId] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  // Filter jobs belonging to this customer
  const myJobs = jobs.filter(
    (j) =>
      (currentUser.phone && j.customerPhone === currentUser.phone) ||
      (currentUser.name && j.customerName.toLowerCase() === currentUser.name.toLowerCase())
  );
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateProfile(name.trim(), phone.trim());
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  const handleSendMessage = (jobId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    onAddMessage(jobId, 'customer', currentUser.name || 'Customer', typedMessage, 'customer_operator');
    setTypedMessage('');
  };
  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'pending_operator':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            {lang === 'pt' ? 'Revisão Pendente' : 'Pending Review'}
          </span>
        );
      case 'offered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            {lang === 'pt' ? 'À Procura de Pro' : 'Matching Pro'}
          </span>
        );
      case 'specialist_selected':
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            {lang === 'pt' ? 'Em Progresso' : 'In Progress'}
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            {lang === 'pt' ? 'Concluído' : 'Completed'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            {status}
          </span>
        );
    }
  };
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0A1128] to-[#0A1128]/80 p-6 rounded-3xl border border-blue-900/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {lang === 'pt' ? 'Conta de Cliente' : 'Customer Account'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mt-1">
              {currentUser.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBackToMenu}
            className="flex-1 sm:flex-initial px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black uppercase tracking-wider text-xs rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>{lang === 'pt' ? 'Novo Pedido' : 'New Order'}</span>
          </button>
          
          <button
            onClick={onLogout}
            className="p-3.5 bg-slate-900/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded-2xl border border-slate-800 transition-colors cursor-pointer flex items-center justify-center"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{lang === 'pt' ? 'Perfil atualizado com sucesso' : 'Profile updated successfully'}</span>
        </div>
      )}
      {/* Grid Layout: Profile Card & Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Nickname Management */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0A1128]/90 border border-blue-900/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-blue-900/30 pb-4 mb-5">
              <div className="flex items-center gap-2 text-cyan-400 font-display font-bold text-base">
                <Building className="w-5 h-5" />
                <span>{lang === 'pt' ? 'Perfil / Apelido' : 'Profile / Nickname'}</span>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-slate-400 hover:text-cyan-300 font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{lang === 'pt' ? 'Editar' : 'Edit'}</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {lang === 'pt' ? 'O seu apelido pode ser o seu nome pessoal ou o nome da empresa (por exemplo, ' : 'Your nickname can be your personal name or business name (for example, '}<span className="text-slate-200 font-medium">Villa Services</span> {lang === 'pt' ? 'ou' : 'or'} <span className="text-slate-200 font-medium">Alex</span>).
            </p>
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {lang === 'pt' ? 'Apelido (Pessoa ou Organização)' : 'Nickname (Person or Organization)'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'pt' ? "ex. Resort Hotel Lda" : "e.g. Resort Hotel Ltd"}
                      className="w-full bg-slate-950/60 border border-cyan-500/50 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {lang === 'pt' ? 'Número de Telefone de Contacto' : 'Contact Phone Number'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+351 912 345 678"
                      className="w-full bg-slate-950/60 border border-cyan-500/50 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{lang === 'pt' ? 'Guardar' : 'Save'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setName(currentUser.name || '');
                      setPhone(currentUser.phone || '');
                      setIsEditing(false);
                    }}
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {lang === 'pt' ? 'Cancelar' : 'Cancel'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-850">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                    {lang === 'pt' ? 'Organização / Cliente' : 'Organization / Client'}
                  </span>
                  <span className="text-base font-display font-bold text-white">
                    {currentUser.name || (lang === 'pt' ? 'Não especificado' : 'Not specified')}
                  </span>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-850">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                    {lang === 'pt' ? 'Telefone de Contacto' : 'Contact Phone'}
                  </span>
                  <span className="text-sm font-mono font-bold text-cyan-300">
                    {currentUser.phone || (lang === 'pt' ? 'Não especificado' : 'Not specified')}
                  </span>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-850">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                    {lang === 'pt' ? 'Estado da Conta' : 'Account Status'}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">{lang === 'pt' ? 'Registado / Ativo' : 'Registered / Active'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-blue-950/40 to-slate-950/60 border border-blue-900/30 rounded-3xl p-6">
            <h3 className="font-display font-bold text-white text-sm mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'pt' ? 'Segurança e Suporte' : 'Security & Support'}</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'pt' ? 'Os seus pedidos e detalhes pessoais estão seguros. Um parceiro territorial irá contactá-lo através do seu número de telefone imediatamente após a submissão do pedido.' : 'Your requests and personal details are secure. A territory partner will contact you via your phone number immediately after order submission.'}
            </p>
          </div>
        </div>
        {/* Right Column: Orders & Requests List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-display font-black text-white tracking-tight">
                {lang === 'pt' ? 'Os Meus Pedidos' : 'My Requests'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'pt' ? 'Histórico e tickets ativos com a NordBase.pt' : 'History and active tickets with NordBase.pt'}
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-mono font-bold text-cyan-300">
              {lang === 'pt' ? 'Total' : 'Total'}: {myJobs.length}
            </span>
          </div>
          {myJobs.length === 0 ? (
            <div className="bg-[#0A1128]/60 border border-blue-900/30 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-cyan-400">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">
                {lang === 'pt' ? 'Ainda não tem pedidos de serviço ativos' : 'No active service requests yet'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                {lang === 'pt' ? 'Escolha um serviço no menu principal, e os nossos parceiros territoriais irão associá-lo ao melhor especialista disponível.' : 'Choose a required service from the main menu, and our territory partners will match you with the best available specialist.'}
              </p>
              <button
                onClick={onBackToMenu}
                className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>{lang === 'pt' ? 'Criar Primeiro Pedido' : 'Create First Request'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myJobs.map((job) => {
                const isChatOpen = activeChatJobId === job.id;
                return (
                  <div
                    key={job.id}
                    className="bg-[#0A1128]/90 border border-blue-900/40 rounded-3xl p-6 shadow-lg hover:border-blue-700/60 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/50">
                            {job.category}
                          </span>
                          {getStatusBadge(job.status)}
                        </div>
                        <h4 className="text-base font-display font-bold text-white mt-2">
                          {job.description}
                        </h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">{lang === 'pt' ? 'Valor Est.' : 'Est. Value'}</span>
                        <span className="text-lg font-mono font-black text-white">
                          €{job.estimatedValue}
                        </span>
                      </div>
                    </div>
                    {/* Visual Progress Stepper */}
                    <div className="mb-4 bg-slate-950/60 p-4 rounded-2xl border border-blue-900/20">
                      <div className="grid grid-cols-4 gap-2 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-800 -z-0" />
                        
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                            ✓
                          </div>
                          <span className="text-[10px] font-semibold text-cyan-300 mt-1">
                            {lang === 'pt' ? 'Criado' : 'Created'}
                          </span>
                        </div>

                        {/* Step 2 */}
                        {(() => {
                          const isDone = job.status !== 'pending_operator';
                          const isCurrent = job.status === 'pending_operator';
                          return (
                            <div className="flex flex-col items-center text-center relative z-10">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                isDone
                                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                                  : isCurrent
                                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
                              }`}>
                                {isDone ? '✓' : '2'}
                              </div>
                              <span className={`text-[10px] font-semibold mt-1 ${isDone ? 'text-cyan-300' : isCurrent ? 'text-amber-300' : 'text-slate-500'}`}>
                                {lang === 'pt' ? 'Revisão' : 'Review'}
                              </span>
                            </div>
                          );
                        })()}

                        {/* Step 3 */}
                        {(() => {
                          const isDone = job.status === 'active' || job.status === 'completed';
                          const isCurrent = job.status === 'offered' || job.status === 'specialist_selected';
                          return (
                            <div className="flex flex-col items-center text-center relative z-10">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                isDone
                                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                                  : isCurrent
                                  ? 'bg-blue-500 text-slate-950 animate-pulse'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
                              }`}>
                                {isDone ? '✓' : '3'}
                              </div>
                              <span className={`text-[10px] font-semibold mt-1 ${isDone ? 'text-cyan-300' : isCurrent ? 'text-blue-300' : 'text-slate-500'}`}>
                                {lang === 'pt' ? 'Especialista' : 'Specialist'}
                              </span>
                            </div>
                          );
                        })()}

                        {/* Step 4 */}
                        {(() => {
                          const isDone = job.status === 'completed' || job.customerCompleted;
                          const isCurrent = job.status === 'active';
                          return (
                            <div className="flex flex-col items-center text-center relative z-10">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                isDone
                                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                  : isCurrent
                                  ? 'bg-cyan-500 text-slate-950 animate-pulse'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
                              }`}>
                                {isDone ? '✓' : '4'}
                              </div>
                              <span className={`text-[10px] font-semibold mt-1 ${isDone ? 'text-emerald-300' : isCurrent ? 'text-cyan-300' : 'text-slate-500'}`}>
                                {lang === 'pt' ? 'Concluído' : 'Completed'}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850 mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{job.city}{job.specificLocation ? `, ${job.specificLocation}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{new Date(job.createdAt).toLocaleDateString()} {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Assigned Specialist & Territory Partner Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {/* Territory Partner Card */}
                      {(() => {
                        const allUsers = store.getState().users || [];
                        const op = job.operatorId ? allUsers.find(u => u.id === job.operatorId) : null;
                        if (!op) return null;
                        const opPhoto = op.photoUrl || op.avatar || '/portimao_tp.jpg';
                        let opName = op.name;
                        if (opName.includes('National Partner') || opName.includes('Territorial Partner') || opName.includes('TP Operator')) {
                          opName = opName.replace('National Partner', 'Local Operator').replace('Territorial Partner', 'Local Operator').replace('TP Operator', 'Local Operator');
                        }
                        return (
                          <div className="flex items-center justify-between bg-slate-950/40 p-3 rounded-2xl border border-blue-900/20">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={opPhoto}
                                alt=""
                                className="w-9 h-9 rounded-full border border-cyan-500/20 bg-slate-900 object-cover shrink-0"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  if (!e.currentTarget.src.includes('portimao_tp.jpg')) { e.currentTarget.src = '/portimao_tp.jpg'; }
                                }}
                              />
                              <div className="text-left">
                                <span className="text-[9px] font-mono text-cyan-400 block uppercase tracking-wider font-bold">
                                  {lang === 'pt' ? 'Operador Local' : 'Local Operator'}
                                </span>
                                <span className="text-xs font-bold text-white block truncate max-w-[130px]">
                                  {opName}
                                </span>
                              </div>
                            </div>
                            {op.phone && (
                              <a
                                href={`tel:${op.phone}`}
                                className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-xl border border-cyan-500/30 transition-colors shrink-0"
                                title="Call Local Operator"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        );
                      })()}

                      {/* Assigned Specialist Card */}
                      {(() => {
                        const allUsers = store.getState().users || [];
                        const spec = job.unlockedBySpecialistId ? allUsers.find(u => u.id === job.unlockedBySpecialistId) : null;
                        const specName = job.unlockedBySpecialistName || spec?.name;
                        const specPhone = job.unlockedBySpecialistPhone || spec?.phone;
                        if (!specName && !spec) return null;

                        return (
                          <div className="flex items-center justify-between bg-emerald-950/20 p-3 rounded-2xl border border-emerald-500/30">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-sm shrink-0">
                                {specName ? specName.charAt(0).toUpperCase() : 'S'}
                              </div>
                              <div className="text-left">
                                <span className="text-[9px] font-mono text-emerald-400 block uppercase tracking-wider font-bold">
                                  {lang === 'pt' ? 'Especialista Atribuído' : 'Assigned Specialist'}
                                </span>
                                <span className="text-xs font-bold text-white block truncate max-w-[130px]">
                                  {specName || 'Specialist'}
                                </span>
                              </div>
                            </div>
                            {specPhone && (
                              <a
                                href={`tel:${specPhone}`}
                                className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl border border-emerald-500/40 transition-colors shrink-0 flex items-center gap-1 text-xs font-bold"
                                title="Call Specialist"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    {/* Order Completion Protocol Notice */}
                    <div className="mb-4 p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{lang === 'pt' ? 'Para concluir o pedido:' : 'To complete the order:'}</span>
                      </div>
                      <p className="text-xs text-emerald-200/90 italic font-medium">
                        {lang === 'pt'
                          ? '«Trabalhos concluídos e aceites, pagamento efetuado na totalidade, sem reclamações.»'
                          : '«Work completed & accepted, payment made in full, no claims.»'}
                      </p>
                    </div>
                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveChatJobId(isChatOpen ? null : job.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isChatOpen
                              ? 'bg-cyan-500 text-slate-950 shadow-md'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-750'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>
                            {lang === 'pt' ? 'Chat' : 'Chat'} {job.messages && job.messages.length > 0 ? `(${job.messages.length})` : ''}
                          </span>
                        </button>

                        {/* Re-order / Clone button */}
                        <button
                          onClick={() => {
                            if (onBackToMenu) onBackToMenu();
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-950/60 hover:bg-blue-900/80 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Repeat order with same category"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{lang === 'pt' ? 'Repetir' : 'Re-order'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Cancel Order (If not completed or cancelled) */}
                        {job.status !== 'completed' && job.status !== 'cancelled' && (
                          <button
                            onClick={() => {
                              const reason = prompt(
                                lang === 'pt'
                                  ? 'Por favor, indique o motivo do cancelamento:'
                                  : 'Please specify reason for cancellation:'
                              );
                              if (reason !== null) {
                                store.updateJobStatus(job.id, 'cancelled');
                                store.addSystemMessage(
                                  job.id,
                                  `Order cancelled by customer. Reason: ${reason || 'Not specified'}`
                                );
                              }
                            }}
                            className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-colors cursor-pointer"
                          >
                            {lang === 'pt' ? 'Cancelar pedido' : 'Cancel order'}
                          </button>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">
                          ID: {job.id.slice(-6)}
                        </span>
                      </div>
                    </div>
                    {/* Expandable Chat Section */}
                    {isChatOpen && (
                      <div className="mt-5 pt-5 border-t border-blue-900/40 space-y-4 bg-slate-950/60 p-4 rounded-2xl">
                        <h5 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                          {lang === 'pt' ? 'Mensagens (Parceiro Territorial e Especialista)' : 'Messages (Territory Partner & Specialist)'}
                        </h5>
                        <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                          {(!job.messages || job.messages.length === 0) ? (
                            <p className="text-xs text-slate-500 text-center py-4">
                              {lang === 'pt' ? 'O histórico de mensagens do coordenador ou especialista atribuído irá aparecer aqui.' : 'Message history from the dispatcher or assigned specialist will appear here.'}
                            </p>
                          ) : (
                            job.messages.map((m) => {
                              const isMe = m.sender === 'customer';
                              return (
                                <div
                                  key={m.id}
                                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                >
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className={`text-[10px] font-bold font-mono ${isMe ? 'text-cyan-400' : 'text-amber-400'}`}>
                                      {m.senderName} ({m.sender})
                                    </span>
                                    <span className="text-[9px] text-slate-500">
                                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <div
                                    className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                                      isMe
                                        ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 rounded-tr-none'
                                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                                    }`}
                                  >
                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                        {/* Send Message Form */}
                        <form onSubmit={(e) => handleSendMessage(job.id, e)} className="flex gap-2 pt-2">
                          <input
                            type="text"
                            value={typedMessage}
                            onChange={(e) => setTypedMessage(e.target.value)}
                            placeholder="Write a message..."
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Send</span>
                          </button>
                        </form>
                      </div>
                    )}
                    {/* Customer Review & Completion Section */}
                    {(job.status === 'active' || job.status === 'completed' || job.customerCompleted) && (
                      <JobCustomerReviewSection job={job} lang={lang} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            if (window.confirm("User verification ensures platform security. Are you sure you want to delete your account?")) {
              onDeleteAccount();
            }
          }}
          className="px-6 py-3 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors cursor-pointer flex items-center gap-2 text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}