import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { X } from 'lucide-react';

export const DocPiyasaArastirma: React.FC = () => {
  const { state, updateWorkflow } = useProcurement();

  // Use MARKET RESEARCH data specifically for this document
  const getResearchPrice = (supplierId: string, itemId: string) => {
    const offer = (state.marketResearchOffers || []).find(o => o.supplierId === supplierId && o.itemId === itemId);
    return offer ? offer.price : 0;
  };

  const getResearchSupplierTotal = (supplierId: string) => {
    return state.items.reduce((acc, item) => {
      const price = getResearchPrice(supplierId, item.id);
      return acc + (price * item.quantity);
    }, 0);
  };

  // Determine winner based on RESEARCH data (approximate cost winner)
  const getResearchWinner = () => {
      if (state.suppliers.length === 0) return null;
      let winner = state.suppliers[0];
      let minTotal = getResearchSupplierTotal(winner.id);
      if (minTotal === 0 && state.items.length > 0) minTotal = Infinity;

      for (const sup of state.suppliers) {
        const total = getResearchSupplierTotal(sup.id);
        if (total > 0 && total < minTotal) {
           minTotal = total;
           winner = sup;
        }
      }
      return winner;
  };

  const formatCurrency = (val: number) => {
    if (val === 0) return '';
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  const winner = getResearchWinner();
  const lowestTotal = winner ? getResearchSupplierTotal(winner.id) : 0;
  
  const approvalData = state.workflow.commissionApproval; 
  const suffix = approvalData.suffix || '-934.01.99';
  const suppliers = [0, 1, 2].map(i => state.suppliers[i] || null);
  const docDate = state.workflow.marketResearch.date;

  return (
    <div className="font-serif text-[8pt] leading-tight text-black w-full h-auto flex flex-col">
      <style>{`
        @media print {
          @page { size: landscape; margin: 10mm; }
        }
      `}</style>

      {/* HEADER TITLE */}
      <div className="text-center font-bold text-lg mb-2">
        PİYASA FİYAT ARAŞTIRMA TUTANAĞI
      </div>

      {/* TOP INFO TABLE */}
      <div className="border border-black bg-blue-50 print:bg-gray-100 mb-2 text-[8pt]">
         <div className="flex border-b border-black">
            <div className="w-64 p-1 font-semibold border-r border-black flex-shrink-0">İdarenin Adı</div>
            <div className="p-1 flex-1">: {state.institution.name.toUpperCase()} MÜDÜRLÜĞÜ</div>
         </div>
         <div className="flex border-b border-black">
            <div className="w-64 p-1 font-semibold border-r border-black flex-shrink-0">Yapılan İş/Mal/Hizmetin Adı, Niteliği</div>
            <div className="p-1 flex-1">: {state.jobDescription || (state.items.length > 0 ? state.items[0].name + " Alımı" : "Mal/Hizmet Alımı")}</div>
         </div>
         <div className="flex border-b border-black">
            <div className="w-64 p-1 font-semibold border-r border-black flex-shrink-0">Onay Belgesi Tarih ve Sayısı</div>
            <div className="p-1 flex-1 flex">
               <span className="mr-8">: {approvalData.date ? approvalData.date.split('-').reverse().join('.') : '.../.../20...'}</span>
               <span>{state.correspondenceCode ? `${state.correspondenceCode}${suffix}/` : ''}{approvalData.number || '...'}</span>
            </div>
         </div>
      </div>

      {/* MAIN DATA TABLE - table-fixed ensures it stays within page width */}
      <table className="w-full border-collapse border border-black text-[7.5pt] text-center table-fixed">
        <thead>
          <tr className="bg-blue-200 print:bg-gray-200">
             <th rowSpan={3} className="border border-black w-8 align-middle">
               <div className="transform -rotate-90 whitespace-nowrap">Sıra No</div>
             </th>
             <th colSpan={3} className="border border-black align-middle text-center uppercase h-6">
               {state.jobDescription || "MALZEME ALIMI"}
             </th>
             <th colSpan={suppliers.length * 2} className="border border-black align-middle h-6">
               Kişiler/Firmalar ve Fiyat Teklifleri(KDV Hariç)
             </th>
          </tr>
          <tr className="bg-blue-100 print:bg-gray-100">
             <th className="border border-black w-auto">Mal Kaleminin Adı</th>
             <th className="border border-black w-10">Miktar</th>
             <th className="border border-black w-10">Birim</th>
             {suppliers.map((_, idx) => (
               <th key={`num-${idx}`} colSpan={2} className="border border-black h-4 w-28">
                 {idx + 1}
               </th>
             ))}
          </tr>
          <tr className="bg-blue-100 print:bg-gray-100">
             <th className="border border-black bg-gray-50 print:bg-gray-50"></th>
             <th className="border border-black bg-gray-50 print:bg-gray-50"></th>
             <th className="border border-black bg-gray-50 print:bg-gray-50"></th>
             {suppliers.map((s, idx) => (
               <th key={`name-${idx}`} colSpan={2} className="border border-black h-6 px-1 truncate overflow-hidden">
                 {s ? s.name : '...................'}
               </th>
             ))}
          </tr>
          <tr className="bg-blue-50 print:bg-gray-50 text-[7pt]">
             <th className="border border-black"></th>
             <th className="border border-black"></th>
             <th className="border border-black"></th>
             {suppliers.map((_, idx) => (
               <React.Fragment key={`sub-${idx}`}>
                 <th className="border border-black w-14">Birim Fiyatı</th>
                 <th className="border border-black w-14">Toplam Fiyat</th>
               </React.Fragment>
             ))}
          </tr>
        </thead>
        <tbody>
           {state.items.map((item, idx) => (
             <tr key={item.id} className="h-5">
                <td className="border border-black py-0.5">{idx + 1}</td>
                <td className="border border-black text-left px-1 truncate overflow-hidden whitespace-nowrap" title={item.name}>{item.name}</td>
                <td className="border border-black py-0.5">{item.quantity}</td>
                <td className="border border-black py-0.5">{item.unit}</td>
                {suppliers.map((s, sIdx) => {
                   if(!s) return <React.Fragment key={sIdx}><td className="border border-black"></td><td className="border border-black"></td></React.Fragment>;
                   const price = getResearchPrice(s.id, item.id);
                   const total = price * item.quantity;
                   return (
                     <React.Fragment key={sIdx}>
                        <td className="border border-black py-0.5">{formatCurrency(price)}</td>
                        <td className="border border-black bg-gray-50/30 print:bg-gray-50 py-0.5">{formatCurrency(total)}</td>
                     </React.Fragment>
                   );
                })}
             </tr>
           ))}
           <tr className="bg-blue-100 print:bg-gray-100 font-bold">
              <td colSpan={4} className="border border-black text-center py-1">
                 TOPLAM TEKLİF
              </td>
              {suppliers.map((s, idx) => (
                 <React.Fragment key={idx}>
                    <td className="border border-black text-[7pt]">TOPLAM</td>
                    <td className="border border-black text-[9pt]">
                       {s ? formatCurrency(getResearchSupplierTotal(s.id)) + '₺' : ''}
                    </td>
                 </React.Fragment>
              ))}
           </tr>
        </tbody>
      </table>

      {/* DECISION TABLE */}
      <table className="w-full border-collapse border border-black border-t-0 text-[8pt] text-center table-fixed mt-0 avoid-break">
         <tbody>
            <tr className="bg-blue-200 print:bg-gray-200 font-bold">
               <td className="border border-black w-[30%] py-1">
                  İŞİN ADI
               </td>
               <td className="border border-black bg-blue-100 print:bg-gray-100 w-[20%]">Teklifi Uygun Görülen</td>
               <td className="border border-black bg-blue-100 print:bg-gray-100 w-[30%]">Adresi</td>
               <td className="border border-black bg-blue-100 print:bg-gray-100 w-[20%]">Teklif Ettiği Fiyat</td>
            </tr>
            <tr className="h-8">
               <td className="border border-black font-semibold bg-gray-50 print:bg-gray-50 text-[7pt]">
                  Tümünün Bu Kişi/Firmadan Alımı Uygundur
               </td>
               <td className="border border-black font-bold">
                  {winner ? winner.name : '.....................'}
               </td>
               <td className="border border-black text-[7pt]">
                  {winner ? winner.address || 'Adres Girilmedi' : '.....................'}
               </td>
               <td className="border border-black font-bold">
                  {formatCurrency(lowestTotal)}₺
               </td>
            </tr>
         </tbody>
      </table>

      {/* LEGAL TEXT */}
      <div className="border border-black border-t-0 bg-blue-50/50 print:bg-gray-50 p-1 text-justify text-[7.5pt] avoid-break">
         4734 Sayılı Kamu İhale Kanunu'nun {state.directProcurementArticle === '22/a' ? '22/a' : '22 nci'} Maddesi uyarınca Doğrudan Temin Usulüyle 
         yapılacak alımlara ilişkin yapılan piyasa araştırmasında firmalarca/kişilerce teklif edilen fiyatlar tarafımca/tarafımızca 
         değerlendirilerek yukarıda adı ve adresleri belirtilen kişi/firma/firmalardan alım yapılması uygun görülmüştür.
      </div>
      
      <div className="text-right text-[8pt] font-bold mt-1 pr-4 avoid-break flex justify-end items-center gap-1 group">
          {/* Print View */}
           <span className="hidden print:inline">
             {docDate ? docDate.split('-').reverse().join('.') : '.../.../20...'}
           </span>
           {/* Screen View */}
          <input 
               type="date"
               className="bg-transparent text-right font-inherit border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-32 h-6 font-bold print:hidden"
               value={docDate || ''}
               onChange={(e) => updateWorkflow('marketResearch', { date: e.target.value })}
          />
           {docDate && (
               <button 
                  onClick={() => updateWorkflow('marketResearch', { date: '' })}
                  className="text-gray-400 hover:text-red-500 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Tarihi Temizle"
               >
                  <X size={14} />
               </button>
            )}
      </div>

      {/* SIGNATURES */}
      <div className="flex-1 border border-black border-t-0 pt-2 avoid-break">
         <div className="text-center font-bold mb-4 text-[9pt] tracking-widest uppercase">
            PİYASA FİYAT ARAŞTIRMASI GÖREVLİSİ / GÖREVLİLERİ
         </div>

         <div className="flex justify-around items-start px-4">
            {state.marketResearchCommission.map((member) => (
               <div key={member.id} className="text-center w-40">
                  <p className="font-bold text-[8pt] mb-1 uppercase">{member.role}</p>
                  <div className="h-6"></div>
                  <p className="font-bold text-[9pt] uppercase">{member.name}</p>
                  <p className="text-[7.5pt] text-gray-700 capitalize">{member.title}</p>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};