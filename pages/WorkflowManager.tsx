import React from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { Calendar, Hash, Settings, Save, FileText, Info, Wallet, AlertTriangle, Wand2, Receipt } from 'lucide-react';
import { Workflow, ProcurementState } from '../types';

// Props arayüzü
interface WorkflowStepProps {
  step: string;
  label: string;
  wfKey: keyof Workflow;
  hasNumber?: boolean;
  isLast?: boolean;
  state: ProcurementState;
  onDateChange: (key: keyof Workflow, val: string) => void;
  onNumberChange: (key: keyof Workflow, val: string) => void;
  onSuffixChange?: (key: keyof Workflow, val: string) => void;
}

// BİLEŞEN DIŞARI TAŞINDI (Input Focus Sorunu Çözümü)
const WorkflowStep: React.FC<WorkflowStepProps> = ({ 
  step, 
  label, 
  wfKey, 
  hasNumber = true, 
  isLast = false,
  state,
  onDateChange,
  onNumberChange,
  onSuffixChange
}) => {
  const data = state.workflow[wfKey] as any;
  const hasData = data?.date || (hasNumber && data?.number);
  
  return (
    <div className="relative pl-12 md:pl-16 py-2 group">
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-[19px] md:left-[35px] top-12 bottom-[-20px] w-0.5 bg-gray-200 group-hover:bg-blue-200 transition-colors z-0"></div>
      )}
      
      {/* Step Circle */}
      <div className={`absolute left-0 md:left-4 top-3 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg shadow-sm z-10 transition-all duration-300 ${hasData ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500 group-hover:border-blue-400 group-hover:text-blue-500'}`}>
         {step}
      </div>

      {/* Card Body */}
      <div className={`rounded-xl border transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 md:p-5 ${hasData ? 'bg-white border-blue-200 shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-sm'}`}>
         
         {/* Label */}
         <div className="lg:col-span-4 flex items-center">
            <span className={`font-semibold text-sm md:text-base ${hasData ? 'text-gray-900' : 'text-gray-600'}`}>{label}</span>
         </div>

         {/* Date Input */}
         <div className="lg:col-span-3">
            <div className="relative group/input">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Calendar size={16} className={`${hasData ? 'text-blue-500' : 'text-gray-400'} group-focus-within/input:text-blue-600 transition-colors`} />
               </div>
               <input
                 type="date"
                 className={`pl-10 w-full border rounded-lg py-2.5 text-sm outline-none transition-all ${hasData ? 'border-blue-200 bg-blue-50/30' : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
                 value={data?.date || ''}
                 onChange={(e) => onDateChange(wfKey, e.target.value)}
               />
            </div>
         </div>

         {/* Number Input */}
         <div className="lg:col-span-5">
            {hasNumber ? (
              <div className={`flex items-center rounded-lg border overflow-hidden transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 ${hasData ? 'border-blue-200 bg-blue-50/30' : 'border-gray-300 bg-white'}`}>
                 {state.correspondenceCode && (
                   <div className="bg-gray-100/50 px-3 py-2.5 border-r border-gray-200 flex items-center text-xs font-mono text-gray-600 select-none whitespace-nowrap">
                     <Hash size={12} className="mr-1 opacity-50"/>
                     <span>{state.correspondenceCode}</span>
                     {/* Edit Suffix Input */}
                     <input 
                        type="text"
                        className="w-20 bg-transparent text-gray-700 font-semibold outline-none border-b border-gray-300 hover:border-blue-400 focus:border-blue-600 ml-1 px-1 transition-colors"
                        value={data?.suffix || ''}
                        onChange={(e) => onSuffixChange && onSuffixChange(wfKey, e.target.value)}
                        placeholder="-..."
                     />
                     <span className="mx-1 text-gray-400">/</span>
                   </div>
                 )}
                 {!state.correspondenceCode && (
                   <div className="pl-3 text-gray-400">
                     <Hash size={16} />
                   </div>
                 )}
                 <input 
                   type="text" 
                   placeholder={state.correspondenceCode ? "Sayı" : "Evrak Sayısı"}
                   className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none min-w-0"
                   value={data?.number || ''}
                   onChange={(e) => onNumberChange(wfKey, e.target.value)}
                 />
              </div>
            ) : (
              <div className="hidden lg:block h-10 border border-transparent"></div>
            )}
         </div>
      </div>
    </div>
  );
};

const WorkflowManager: React.FC = () => {
  const { state, setMeta, updateWorkflow } = useProcurement();

  const handleDateChange = (key: keyof Workflow, val: string) => {
    updateWorkflow(key, { date: val });
  };

  const handleNumberChange = (key: keyof Workflow, val: string) => {
    updateWorkflow(key, { number: val });
  };

  const handleSuffixChange = (key: keyof Workflow, val: string) => {
    updateWorkflow(key, { suffix: val });
  };
  
  // Karar No değiştiğinde, ana Dosya/İhale No'sunu da aynı yap
  const handleDecisionNumberChange = (val: string) => {
    updateWorkflow('inspection', { decisionNumber: val });
    // Ana dosya numarasını da güncelle
    setMeta('tenderNumber', val);
  };

  // --- AUTOMATION LOGIC ---
  
  const addDays = (dateStr: string, days: number): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handleSyncFromBaseDate = (baseDate: string) => {
    if (!baseDate) return;

    // Logic 1: Bu belgeler aynı gün olmalı
    const sameDayKeys: (keyof Workflow)[] = [
      'needsList',        // İhtiyaç Listesi (1)
      'commissionApproval', // Komisyon Onay (2)
      'priceResearch',    // Fiyat Araştırma (3)
      'approxCost',       // Yaklaşık Maliyet (4)
      'tenderApproval',   // Onay Belgesi (5)
      'marketResearch'    // Piyasa Araştırma Tutanağı (7)
    ];

    sameDayKeys.forEach(key => updateWorkflow(key, { date: baseDate }));

    // Logic 2: Teklif Mektubu (6) 1 gün sonra olmalı
    const nextDay = addDays(baseDate, 1);
    updateWorkflow('offerLetter', { date: nextDay });
  };

  const handleSyncFromInvoiceDate = (invoiceDate: string) => {
    if (!invoiceDate) return;

    // Logic 3: Muayene Kabul (8) Fatura tarihi ile aynı olmalı
    updateWorkflow('invoice', { date: invoiceDate });
    updateWorkflow('inspection', { date: invoiceDate });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* 
          -------------------------
          AKILLI TARİH SİHİRBAZI 
          -------------------------
      */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-sm">
         <div className="flex items-center mb-4 text-indigo-900 font-bold text-lg">
            <Wand2 className="mr-2" /> Akıllı Tarih Sihirbazı
         </div>
         <p className="text-sm text-indigo-700 mb-6">
            Aşağıdaki ana tarihleri seçtiğinizde, mevzuata uygun olarak diğer tüm evrak tarihleri otomatik olarak dağıtılacaktır.
         </p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Süreç Başlangıç Tarihi */}
            <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm relative group">
               <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-bl">Adım 1</div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Süreç Başlangıç Tarihi</label>
               <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-300 outline-none"
                  value={state.workflow.needsList.date}
                  onChange={(e) => handleSyncFromBaseDate(e.target.value)}
               />
               <ul className="mt-3 text-xs text-gray-500 space-y-1 list-disc pl-4">
                  <li>İhtiyaç, Onay, Yaklaşık Maliyet vb. bu tarihe ayarlanır.</li>
                  <li className="text-indigo-600 font-semibold">Teklif Mektubu otomatik olarak 1 gün sonrasına ( {state.workflow.offerLetter.date ? state.workflow.offerLetter.date.split('-').reverse().join('.') : '...'} ) ayarlanır.</li>
               </ul>
            </div>

            {/* Fatura Tarihi */}
            <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm relative group">
               <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-bl">Adım 2</div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Fatura Tarihi</label>
               <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-300 outline-none"
                  value={state.workflow.invoice?.date || ''}
                  onChange={(e) => handleSyncFromInvoiceDate(e.target.value)}
               />
               <ul className="mt-3 text-xs text-gray-500 space-y-1 list-disc pl-4">
                  <li>Fatura tarihi sisteme kaydedilir.</li>
                  <li className="text-indigo-600 font-semibold">Muayene ve Kabul tarihi, Fatura tarihi ile eşitlenir.</li>
               </ul>
            </div>
         </div>
      </div>

      {/* Header & Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gov-900 to-gov-700 px-6 py-5 flex items-center justify-between">
           <div className="text-white">
             <h2 className="text-xl font-bold flex items-center">
               <Settings className="mr-2" size={24}/> 
               İşlem Akışı ve Ayarlar
             </h2>
             <p className="text-blue-100 text-sm mt-1 opacity-90">
               Evrak tarih ve sayılarını buradan yöneterek tüm belgelere otomatik yansımasını sağlayabilirsiniz.
             </p>
           </div>
           <div className="hidden md:block bg-white/10 p-2 rounded-lg backdrop-blur-sm">
             <FileText className="text-white" size={24} />
           </div>
        </div>
        
        <div className="p-6 md:p-8">
           
           {/* Top Grid: Correspondence Code & Allowance */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Code Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                  KURUM RESMİ YAZIŞMA KODU
                  <div className="group relative ml-2 cursor-help">
                    <Info size={14} className="text-gray-400"/>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs p-2 rounded hidden group-hover:block z-50">
                      Evrak sayılarının başına otomatik eklenen standart dosya planı kodu.
                    </div>
                  </div>
                </label>
                <div className="flex items-center relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash size={18} className="text-gov-600" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Örn: 53750198"
                    className="w-full pl-10 border border-gray-300 rounded-lg py-3 focus:ring-4 focus:ring-gov-500/20 focus:border-gov-500 transition-all font-mono text-lg tracking-wide"
                    value={state.correspondenceCode}
                    onChange={(e) => setMeta('correspondenceCode', e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 pl-1">
                  Bu kod girildiğinde evrak sayıları otomatik formatlanır. Uzantıları aşağıdaki listeden değiştirebilirsiniz.
                </p>
              </div>

              {/* Right: Allowance (Ödenek) Input */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 relative">
                  <div className="absolute top-0 right-0 bg-yellow-200 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center">
                     <AlertTriangle size={10} className="mr-1"/> MYS'den Kontrol Ediniz
                  </div>
                  <h3 className="text-sm font-bold text-yellow-800 mb-3 flex items-center">
                     <Wallet className="mr-2" size={18}/> BÜTÇE VE ÖDENEK GİRİŞİ
                  </h3>
                  <div className="space-y-3">
                     <div>
                        <label className="block text-xs font-semibold text-yellow-700 mb-1">Kullanılabilir Ödenek (TL)</label>
                        <input 
                           type="number" 
                           placeholder="0.00"
                           className="w-full border-yellow-300 rounded p-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-right font-mono font-bold text-gray-800"
                           value={state.allowance > 0 ? state.allowance : ''}
                           onChange={(e) => setMeta('allowance', parseFloat(e.target.value))}
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-yellow-700 mb-1">Bütçe Tertibi (Kod)</label>
                        <input 
                           type="text" 
                           placeholder="Örn: 13.01.00.62-09.2.1.00-1-03.2"
                           className="w-full border-yellow-300 rounded p-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono text-sm text-gray-800"
                           value={state.budgetCode}
                           onChange={(e) => setMeta('budgetCode', e.target.value)}
                        />
                     </div>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
         <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center border-b pb-4">
            <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold mr-3 uppercase tracking-wider">Adım Adım</span>
            İşlem Akış Çizelgesi
         </h3>
         
         <div className="space-y-1">
           <WorkflowStep 
             step="1" 
             label="İhtiyaç Listesi Onayı" 
             wfKey="needsList" 
             state={state}
             onDateChange={handleDateChange}
             onNumberChange={handleNumberChange}
             onSuffixChange={handleSuffixChange}
           />
           
           <WorkflowStep 
             step="2" 
             label="Komisyon Oluşturma Onayı" 
             wfKey="commissionApproval" 
             state={state}
             onDateChange={handleDateChange}
             onNumberChange={handleNumberChange}
             onSuffixChange={handleSuffixChange}
           />
           
           <WorkflowStep 
             step="3" 
             label="Fiyat Araştırması" 
             wfKey="priceResearch" 
             state={state}
             onDateChange={handleDateChange}
             onNumberChange={handleNumberChange}
             onSuffixChange={handleSuffixChange}
           />
           
           <WorkflowStep 
             step="4" 
             label="Yaklaşık Maliyet Cetveli" 
             wfKey="approxCost" 
             hasNumber={false} 
             state={state}
             onDateChange={handleDateChange}
             onNumberChange={handleNumberChange}
             onSuffixChange={handleSuffixChange}
           />
           
           <WorkflowStep 
             step="5" 
             label="İhale Onay Belgesi" 
             wfKey="tenderApproval" 
             state={state}
             onDateChange={handleDateChange}
             onNumberChange={handleNumberChange}
             onSuffixChange={handleSuffixChange}
           />
           
           <WorkflowStep 
             step="6" 
             label="Teklif Mektuplarının Dağıtımı (+1 Gün)" 
             wfKey="offerLetter" 
             hasNumber={false} 
             state={state}
             onDateChange={handleDateChange}
             onNumberChange={handleNumberChange}
             onSuffixChange={handleSuffixChange}
           />
           
           <WorkflowStep 
             step="7" 
             label="Piyasa Fiyat Araştırması Tutanağı" 
             wfKey="marketResearch" 
             hasNumber={false} 
             state={state}
             onDateChange={handleDateChange}
             onNumberChange={handleNumberChange}
           />

           {/* Fatura Bilgileri (Custom Row) */}
           <div className="relative pl-12 md:pl-16 py-2 group">
             <div className="absolute left-[19px] md:left-[35px] top-12 bottom-[-20px] w-0.5 bg-gray-200 group-hover:bg-blue-200 transition-colors z-0"></div>
             <div className={`absolute left-0 md:left-4 top-3 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg shadow-sm z-10 transition-all duration-300 bg-white border-orange-300 text-orange-500`}>
                <Receipt size={20} />
             </div>

             <div className="rounded-xl border border-orange-200 bg-orange-50/50 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 md:p-5">
                <div className="lg:col-span-4 flex items-center">
                   <span className="font-semibold text-sm md:text-base text-gray-900">Fatura Bilgileri</span>
                </div>
                <div className="lg:col-span-3">
                   <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-orange-500" />
                      </div>
                      <input
                        type="date"
                        className="pl-10 w-full border border-orange-200 rounded-lg py-2.5 text-sm outline-none transition-all bg-white focus:border-orange-500"
                        value={state.workflow.invoice?.date || ''}
                        onChange={(e) => handleSyncFromInvoiceDate(e.target.value)}
                      />
                   </div>
                </div>
                <div className="lg:col-span-5">
                   <div className="flex items-center rounded-lg border border-orange-200 overflow-hidden bg-white focus-within:ring-4 focus-within:ring-orange-500/10 focus-within:border-orange-500">
                      <div className="bg-orange-50/50 px-3 py-2.5 border-r border-orange-100 flex items-center text-xs font-bold text-orange-600 select-none">
                        FATURA NO
                      </div>
                      <input 
                        type="text" 
                        placeholder="Örn: GIB2024..."
                        className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                        value={state.workflow.invoice?.number || ''}
                        onChange={(e) => updateWorkflow('invoice', { number: e.target.value })}
                      />
                   </div>
                </div>
             </div>
           </div>

           {/* Muayene ve Kabul (Custom Step 8) */}
           <div className="relative pl-12 md:pl-16 py-2 group">
             <div className={`absolute left-0 md:left-4 top-3 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg shadow-sm z-10 transition-all duration-300 ${state.workflow.inspection.date ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                8
             </div>

             <div className={`rounded-xl border transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 md:p-5 ${state.workflow.inspection.date ? 'bg-green-50/50 border-green-200 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
                <div className="lg:col-span-4 flex items-center">
                   <span className="font-semibold text-sm md:text-base text-gray-900">Muayene ve Kabul (Fatura Tarihi)</span>
                </div>
                
                <div className="lg:col-span-3">
                   <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className={`${state.workflow.inspection.date ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="date"
                        className={`pl-10 w-full border rounded-lg py-2.5 text-sm outline-none transition-all ${state.workflow.inspection.date ? 'border-green-200 bg-white' : 'border-gray-300 bg-white focus:border-green-500'}`}
                        value={state.workflow.inspection.date || ''}
                        onChange={(e) => updateWorkflow('inspection', { date: e.target.value })}
                      />
                   </div>
                </div>

                <div className="lg:col-span-5">
                   <div className={`flex items-center rounded-lg border overflow-hidden transition-all focus-within:ring-4 focus-within:ring-green-500/10 focus-within:border-green-500 ${state.workflow.inspection.date ? 'border-green-200 bg-white' : 'border-gray-300 bg-white'}`}>
                      <div className="bg-gray-100/50 px-3 py-2.5 border-r border-gray-200 flex items-center text-xs font-bold text-gray-600 select-none">
                        KARAR NO
                      </div>
                      <input 
                        type="text" 
                        placeholder="Örn: 2024/1"
                        className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                        value={state.workflow.inspection.decisionNumber || ''}
                        onChange={(e) => handleDecisionNumberChange(e.target.value)}
                      />
                   </div>
                </div>
             </div>
           </div>
         </div>

         <div className="mt-10 flex justify-end">
            <button 
              onClick={() => alert('İşlem akışı başarıyla kaydedildi.')}
              className="bg-gov-900 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-gov-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center font-bold text-sm tracking-wide"
            >
              <Save size={18} className="mr-2" />
              KAYDET VE TAMAMLA
            </button>
         </div>
      </div>
    </div>
  );
};

export default WorkflowManager;