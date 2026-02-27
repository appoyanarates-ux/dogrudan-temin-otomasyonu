import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { X } from 'lucide-react';

export const DocHizmetKabul: React.FC = () => {
  const { state, calculateLowestOfferTotal, getWinnerSupplier, updateWorkflow, setMeta, updateOfficial } = useProcurement();

  const winner = getWinnerSupplier();
  const totalCost = calculateLowestOfferTotal();

  const formatDate = (dateStr: string) => 
    dateStr ? dateStr.split('-').reverse().join('.') : '.../.../20...';

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

  // Editable fields local state or utilizing existing workflow fields
  // For unique fields to this doc, we can use local state or generic meta if needed elsewhere.
  // Using workflow.inspection for date/number as it relates to acceptance.
  
  const [reportNo, setReportNo] = useState('1');

  // Input Class Styles
  const inputClass = "bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-full text-inherit font-inherit p-0 m-0 print:border-none transition-colors px-1";
  const centerInput = `${inputClass} text-center`;

  return (
    <div className="font-serif text-[10pt] leading-tight text-black h-auto flex flex-col w-full">
      
      {/* Header */}
      <div className="text-center font-bold text-base mb-6 pt-2">
         HİZMET İŞLERİ KABUL TUTANAĞI
      </div>

      {/* Details Table */}
      <table className="w-full border-collapse border border-gray-400 mb-6 text-[10pt]">
         <tbody>
            <tr className="border-b border-gray-400 border-dotted">
               <td className="w-64 font-bold py-1.5 align-top">Tutanak No</td>
               <td className="w-4 py-1.5 align-top">:</td>
               <td className="py-1.5">
                  <input className={centerInput} value={reportNo} onChange={e => setReportNo(e.target.value)} />
               </td>
            </tr>
            <tr className="border-b border-gray-400 border-dotted">
               <td className="font-bold py-1.5 align-top">İşin adı</td>
               <td className="py-1.5 align-top">:</td>
               <td className="py-1.5">
                   <input className={inputClass + " uppercase"} value={state.jobDescription || ''} onChange={e => setMeta('jobDescription', e.target.value)} />
               </td>
            </tr>
            <tr className="border-b border-gray-400 border-dotted">
               <td className="font-bold py-1.5 align-top">Hizmeti Yapanın Adı Soyadı / Ünvanı</td>
               <td className="py-1.5 align-top">:</td>
               <td className="py-1.5 font-bold uppercase">
                  {winner ? winner.name : '...................................................'}
               </td>
            </tr>
            <tr className="border-b border-gray-400 border-dotted">
               <td className="font-bold py-1.5 align-top">Tarihi</td>
               <td className="py-1.5 align-top">:</td>
               <td className="py-1.5">
                   <div className="flex items-center gap-1 group">
                      <span className="hidden print:inline">
                         {state.workflow.inspection.date ? state.workflow.inspection.date.split('-').reverse().join('.') : '.../.../20...'}
                      </span>
                      <input 
                        type="date" 
                        className={inputClass + " print:hidden"} 
                        value={state.workflow.inspection.date} 
                        onChange={e => updateWorkflow('inspection', {date: e.target.value})} 
                      />
                      {state.workflow.inspection.date && (
                        <button 
                            onClick={() => updateWorkflow('inspection', { date: '' })}
                            className="text-gray-400 hover:text-red-500 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Tarihi Temizle"
                        >
                            <X size={14} />
                        </button>
                      )}
                   </div>
               </td>
            </tr>
            <tr className="border-b border-gray-400 border-dotted">
               <td className="font-bold py-1.5 align-top">Sözleşme Bedeli</td>
               <td className="py-1.5 align-top">:</td>
               <td className="py-1.5">
                  {formatCurrency(totalCost)} TL
               </td>
            </tr>
            <tr className="border-b border-gray-400 border-dotted">
               <td className="font-bold py-1.5 align-top">Hizmetin Süresi</td>
               <td className="py-1.5 align-top">:</td>
               <td className="py-1.5">
                   <input className={inputClass} placeholder=".................." />
               </td>
            </tr>
            <tr className="border-b border-gray-400 border-dotted">
               <td className="font-bold py-1.5 align-top">Hizmet Alımının Bitiş Tarihi</td>
               <td className="py-1.5 align-top">:</td>
               <td className="py-1.5">
                   <div className="flex items-center gap-1 group">
                      <span className="hidden print:inline">
                         {state.workflow.inspection.date ? state.workflow.inspection.date.split('-').reverse().join('.') : '.../.../20...'}
                      </span>
                      <input 
                         type="date" 
                         className={inputClass + " print:hidden"} 
                         value={state.workflow.inspection.date} 
                         onChange={e => updateWorkflow('inspection', {date: e.target.value})} 
                      />
                       {state.workflow.inspection.date && (
                        <button 
                            onClick={() => updateWorkflow('inspection', { date: '' })}
                            className="text-gray-400 hover:text-red-500 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Tarihi Temizle"
                        >
                            <X size={14} />
                        </button>
                      )}
                   </div>
               </td>
            </tr>
         </tbody>
      </table>

      {/* Body Text */}
      <div className="text-justify indent-8 leading-relaxed mb-6 text-[10pt]">
         <p className="mb-4">
            <strong>{state.institution.name.toUpperCase()}</strong> ile <strong>{winner ? winner.name : '.......................................'}</strong> arasında yapılan 
            <strong> {state.jobDescription ? state.jobDescription.toUpperCase() : '...................................'}</strong> hizmet alımı işi nedeniyle; 
            Başkan <strong>{state.inspectionCommission[0]?.name || '...................'}</strong> Üye <strong>{state.inspectionCommission[1]?.name || '...................'}</strong> ve 
            Üye <strong>{state.inspectionCommission[2]?.name || '...................'}</strong> olmak üzere teşkil edilen 
            MUAYENE VE KABUL KOMİSYONUMUZ tarafından inceleme yapılmıştır. Yapılan işin hizmet alımının gerekçelerine uygun olduğu ve 
            kabule engel olabilecek eksik, kusur ve arızaların bulunmadığı görülmüştür.
         </p>
         <p>
            Kabul bakımından inceleme işlemlerinin yapılması görevi Komisyonumuza verilmiş bulunan söz konusu işin kabulünün yapılması Komisyonumuzca uygun görülmüş ve MÜDÜRLÜK Makamın onayına sunulmak üzere işbu Kabul Tutanağı 2 nüsha olarak düzenlenmiştir.
         </p>
      </div>

      {/* Commission Signatures */}
      <div className="mt-8 mb-8 border-t border-gray-400 pt-4">
          <div className="text-center font-bold mb-6">MUAYENE VE KABUL KOMİSYONU</div>
          
          <div className="grid grid-cols-3 gap-4">
             {state.inspectionCommission.map((member, idx) => (
                <div key={idx} className="text-center">
                   <p className="font-bold mb-1">{idx === 0 ? 'Başkan' : 'Üye'}</p>
                   <p className="font-bold mb-4">{member.name}</p>
                   <p className="text-[8pt] text-gray-400">İmza</p>
                </div>
             ))}
          </div>
      </div>

      {/* Approval Section */}
      <div className="text-center mt-auto avoid-break border-t border-gray-400 pt-6">
         <p className="font-bold mb-2">UYGUNDUR</p>
         <p className="mb-2">Kabul Tutanağının Onay Tarihi : {formatDate(state.workflow.inspection.date)}</p>
         <p className="font-bold mb-1">Harcama Yetkilisi</p>
         <input className={centerInput + " font-bold text-lg mb-4"} value={state.spendingOfficial.name} onChange={e => updateOfficial('spending', {name: e.target.value})} />
         <p className="text-[8pt] text-gray-400">İmza</p>
      </div>

    </div>
  );
};