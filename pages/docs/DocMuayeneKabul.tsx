import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { X } from 'lucide-react';

export const DocMuayeneKabul: React.FC = () => {
  const { state, getWinnerSupplier, updateWorkflow } = useProcurement();
  const winner = getWinnerSupplier();

  const formatCurrency = (val: number) => {
    if (!val && val !== 0) return '0,00';
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  const getWinnerPrice = (itemId: string) => {
    if (!winner) return 0;
    const offer = state.offers.find(o => o.supplierId === winner.id && o.itemId === itemId);
    return offer ? offer.price : 0;
  };

  const decisionDate = state.workflow.inspection.date;
  const decisionNumber = state.workflow.inspection.decisionNumber || '...';
  
  const totalAmount = state.items.reduce((acc, item) => acc + (getWinnerPrice(item.id) * item.quantity), 0);

  return (
    <div className="font-serif text-[10pt] leading-tight text-black h-auto flex flex-col w-full bg-blue-100/30 print:bg-white">
       {/* Top Header */}
       <div className="text-center font-bold mb-4 pt-4">
          <p>T.C.</p>
          <p>{state.institution.city.toUpperCase()} KAYMAKAMLIĞI</p>
          <p>İlçe Milli Eğitim Müdürlüğü</p>
          <p>{state.institution.name}</p>
       </div>

       {/* Info Block - Blue Background as per image */}
       <div className="bg-blue-200 print:bg-blue-100 border-t border-b border-black p-2 mb-0 text-[10pt]">
          <table className="w-full">
             <tbody>
                <tr>
                   <td className="font-semibold w-32 py-0.5 align-top">İdarenin Adı</td>
                   <td className="py-0.5 align-top">: {state.institution.name.toUpperCase()} MÜDÜRLÜĞÜNE</td>
                </tr>
                <tr>
                   <td className="font-semibold py-0.5 align-top">İşin Adı/Niteliği</td>
                   <td className="py-0.5 align-top">: {state.jobDescription || 'Temizlik Malzemesi Alımı'}</td>
                </tr>
                <tr>
                   <td className="font-semibold py-0.5 align-top">Karar Tarihi</td>
                   <td className="py-0.5 align-top">
                      <div className="flex items-center gap-1 group">
                         <span>:</span>
                         {/* Print View */}
                         <span className="hidden print:inline">
                           {decisionDate ? decisionDate.split('-').reverse().join('.') : '.../.../20...'}
                         </span>
                         {/* Screen View */}
                         <input 
                           type="date"
                           className="bg-transparent text-left font-inherit border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-32 h-5 print:hidden"
                           value={decisionDate}
                           onChange={(e) => updateWorkflow('inspection', { date: e.target.value })}
                        />
                         {decisionDate && (
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
                <tr>
                   <td className="font-semibold py-0.5 align-top">Karar No</td>
                   <td className="py-0.5 align-top">: {decisionNumber}</td>
                </tr>
             </tbody>
          </table>
       </div>

       {/* Title Bar */}
       <div className="bg-blue-300 print:bg-blue-200 border border-black border-t-0 text-center font-bold py-1 text-[11pt]">
          MUAYENE VE KABUL KOMİSYONU KARARI
       </div>

       {/* Main Table - Dotted Lines as per image */}
       <table className="w-full border-collapse border border-black text-[9pt] text-center mb-0 bg-blue-100/50 print:bg-transparent">
          <thead className="bg-blue-200 print:bg-blue-100">
             <tr>
                <th className="border border-black py-2 w-10">SIRA NO</th>
                <th className="border border-black py-2">MAL/MALZEME ADI</th>
                <th className="border border-black py-2 w-16">MİKTARI</th>
                <th className="border border-black py-2 w-16">ÖLÇEĞİ</th>
                <th className="border border-black py-2 w-20">BİRİM FİYATI</th>
                <th className="border border-black py-2 w-24">TOPLAM FİYAT(KDV HARİÇ)</th>
                <th className="border border-black py-2 w-20 leading-tight">KABUL EDİLEN MİKTAR</th>
                <th className="border border-black py-2 w-16">KALAN</th>
             </tr>
          </thead>
          <tbody>
             {state.items.map((item, idx) => {
                const price = getWinnerPrice(item.id);
                const total = price * item.quantity;
                return (
                   <tr key={item.id} className="h-7">
                      <td className="border-r border-black border-b border-black border-dotted py-1">{idx + 1}</td>
                      <td className="border-r border-black border-b border-black border-dotted py-1 text-left px-2">{item.name}</td>
                      <td className="border-r border-black border-b border-black border-dotted py-1">{item.quantity}</td>
                      <td className="border-r border-black border-b border-black border-dotted py-1">{item.unit}</td>
                      <td className="border-r border-black border-b border-black border-dotted py-1 text-right px-2">{formatCurrency(price)}</td>
                      <td className="border-r border-black border-b border-black border-dotted py-1 text-right px-2">{formatCurrency(total)}</td>
                      <td className="border-r border-black border-b border-black border-dotted py-1">{item.quantity}</td>
                      <td className="border-r border-black border-b border-black border-dotted py-1">0</td>
                   </tr>
                );
             })}
             {/* Filler Rows if list is short to maintain look */}
             {state.items.length < 4 && Array.from({length: 4 - state.items.length}).map((_, i) => (
                <tr key={`fill-${i}`} className="h-7">
                   <td className="border-r border-black border-b border-black border-dotted"></td>
                   <td className="border-r border-black border-b border-black border-dotted"></td>
                   <td className="border-r border-black border-b border-black border-dotted"></td>
                   <td className="border-r border-black border-b border-black border-dotted"></td>
                   <td className="border-r border-black border-b border-black border-dotted"></td>
                   <td className="border-r border-black border-b border-black border-dotted"></td>
                   <td className="border-r border-black border-b border-black border-dotted"></td>
                   <td className="border-r border-black border-b border-black border-dotted"></td>
                </tr>
             ))}
          </tbody>
       </table>
       
       {/* Bottom Border Closure for Table */}
       <div className="border-t border-black w-full"></div>

       {/* Total */}
       <div className="text-center font-medium mb-4 py-2 text-[10pt] bg-blue-200 print:bg-blue-50/50 border-b border-black border-l border-r">
          Toplam (KDV Hariç) <span className="ml-8 font-bold">{formatCurrency(totalAmount)}₺</span>
       </div>

       {/* Body Text */}
       <div className="text-justify indent-8 leading-relaxed mb-6 px-2 text-[10pt]">
          İhale yetkilisince görevlendirilmemiz nedeniyle <strong>{state.jobDescription || 'Temizlik Malzemesi Alımına'}</strong> ait yukarıda
          cinsi, miktarı ve tutarı belirtilen emtialar sözleşme esaslarına göre kontrolü yapılmış, alınmasında
          herhangi bir sakınca bulunmadığı tarafımızdan tesbit edilerek teslim alınmış ve iş bu karar tanzim ve
          imza edilmiştir.
       </div>

       {/* Signatures */}
       <div className="mt-4 px-4 bg-blue-100/20 print:bg-transparent pb-4 rounded">
           <div className="text-center font-bold mb-6 text-[10pt]">
              MUAYENE KABUL KOMİSYONU
           </div>
           <div className="flex justify-around items-start">
              {state.inspectionCommission.map((member, idx) => (
                 <div key={member.id} className="text-center w-40">
                    <p className="mb-2 text-[10pt]">
                       {decisionDate ? decisionDate.split('-').reverse().join('.') : '.../.../20...'}
                    </p>
                    <p className="font-bold text-[10pt] mb-1">Komisyon Üyesi-{idx+1}</p>
                    <div className="h-4"></div>
                    <p className="font-bold text-[10pt] uppercase">{member.name}</p>
                    <p className="text-[10pt] text-gray-800">{member.title}-{idx+1}</p>
                 </div>
              ))}
           </div>
       </div>
    </div>
  );
};