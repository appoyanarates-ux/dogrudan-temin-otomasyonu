import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { X } from 'lucide-react';

export const DocYaklasikMaliyet: React.FC = () => {
  const { state, updateWorkflow } = useProcurement();

  // Print style controlled by Documents.tsx generally, but ensure font size is small
  const landscapeStyle = `
    @media print {
      @page { size: landscape; margin: 0; }
    }
  `;

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === 0) return '';
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  const suppliers = [0, 1, 2].map(i => state.suppliers[i] || null);

  const getItemCalculations = (item: any) => {
     // Uses MARKET RESEARCH DATA
     const validPrices = suppliers
        .map(s => {
           if (!s) return null;
           const offer = (state.marketResearchOffers || []).find(o => o.supplierId === s.id && o.itemId === item.id);
           return offer ? offer.price : null;
        })
        .filter(p => p !== null && p > 0) as number[];

     if (validPrices.length === 0) return { avgUnit: 0, avgTotal: 0 };

     const avgUnit = validPrices.reduce((a, b) => a + b, 0) / validPrices.length;
     return { avgUnit, avgTotal: avgUnit * item.quantity };
  };

  const grandTotal = state.items.reduce((sum, item) => sum + getItemCalculations(item).avgTotal, 0);

  const getSupplierGrandTotal = (supplierId: string) => {
     return state.items.reduce((acc, item) => {
        const offer = (state.marketResearchOffers || []).find(o => o.supplierId === supplierId && o.itemId === item.id);
        return acc + (offer ? offer.price * item.quantity : 0);
     }, 0);
  };

  return (
    <div className="font-serif text-[8pt] leading-tight text-black h-auto flex flex-col w-full">
      <style>{landscapeStyle}</style>

      {/* Header */}
      <div className="text-center font-bold text-lg mb-2 border border-black bg-gray-200 py-1 print:bg-gray-200">
         YAKLAŞIK MALİYET HESAP CETVELİ
      </div>

      {/* Info Table */}
      <div className="flex mb-2">
         <table className="w-full border-collapse border border-black text-[9pt]">
            <tbody>
               <tr>
                  <td className="border border-black p-1 font-bold w-32 bg-gray-50 print:bg-gray-100">İdarenin Adı</td>
                  <td className="border border-black p-1">{state.institution.name.toUpperCase()} MÜDÜRLÜĞÜ</td>
               </tr>
               <tr>
                  <td className="border border-black p-1 font-bold bg-gray-50 print:bg-gray-100">İşin Adı</td>
                  <td className="border border-black p-1">{state.jobDescription || 'Temizlik Malzemesi Alımı'}</td>
               </tr>
               <tr>
                  <td className="border border-black p-1 font-bold bg-gray-50 print:bg-gray-100">Tarih</td>
                  <td className="border border-black p-1">
                      <div className="flex items-center gap-1 group">
                         {/* Print View */}
                         <span className="hidden print:inline">
                           {state.workflow.approxCost.date ? state.workflow.approxCost.date.split('-').reverse().join('.') : '.../.../20...'}
                         </span>
                         {/* Screen View */}
                         <input 
                           type="date"
                           className="bg-transparent font-inherit border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-32 h-6 print:hidden"
                           value={state.workflow.approxCost.date}
                           onChange={(e) => updateWorkflow('approxCost', { date: e.target.value })}
                         />
                         {state.workflow.approxCost.date && (
                           <button 
                              onClick={() => updateWorkflow('approxCost', { date: '' })}
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
      </div>

      {/* Main Table */}
      <table className="w-full border-collapse border border-black text-center text-[7.5pt]">
         <thead>
            <tr className="bg-gray-100 print:bg-gray-100">
               <th rowSpan={3} className="border border-black px-1 w-8">S.No</th>
               <th rowSpan={3} className="border border-black px-1">Mal/Hizmetin Adı ve Özelliği</th>
               <th rowSpan={3} className="border border-black px-1 w-10">Miktar</th>
               <th rowSpan={3} className="border border-black px-1 w-10">Birim</th>
               <th colSpan={6} className="border border-black py-0.5">FİYAT ARAŞTIRMASI YAPILAN KİŞİ/FİRMALAR VE TEKLİF EDİLEN FİYATLAR (TL)</th>
               <th colSpan={2} rowSpan={2} className="border border-black w-20 bg-gray-200 print:bg-gray-200">ORTALAMA (YAKLAŞIK) MALİYET</th>
            </tr>
            <tr className="bg-gray-50 print:bg-gray-50">
               {suppliers.map((s, idx) => (
                  <th key={idx} colSpan={2} className="border border-black h-6 px-1 truncate max-w-[80px]">
                     {s ? s.name : `....................`}
                  </th>
               ))}
            </tr>
            <tr className="bg-gray-50 text-[7pt] print:bg-gray-50">
               {suppliers.map((_, idx) => (
                  <React.Fragment key={idx}>
                     <th className="border border-black w-12">Birim Fiyat</th>
                     <th className="border border-black w-12">Toplam Tutar</th>
                  </React.Fragment>
               ))}
               <th className="border border-black w-12 bg-gray-200 print:bg-gray-200">Birim Fiyat</th>
               <th className="border border-black w-12 bg-gray-200 print:bg-gray-200">Toplam Tutar</th>
            </tr>
         </thead>
         <tbody>
            {state.items.map((item, idx) => {
               const calcs = getItemCalculations(item);
               return (
                  <tr key={item.id}>
                     <td className="border border-black py-0.5">{idx + 1}</td>
                     <td className="border border-black py-0.5 text-left px-1 truncate max-w-[150px]">{item.name}</td>
                     <td className="border border-black py-0.5">{item.quantity}</td>
                     <td className="border border-black py-0.5">{item.unit}</td>
                     
                     {suppliers.map((s, sIdx) => {
                        if (!s) return <React.Fragment key={sIdx}><td className="border border-black"></td><td className="border border-black"></td></React.Fragment>;
                        const offer = (state.marketResearchOffers || []).find(o => o.supplierId === s.id && o.itemId === item.id);
                        const price = offer ? offer.price : 0;
                        return (
                           <React.Fragment key={sIdx}>
                              <td className="border border-black py-0.5">{formatCurrency(price)}</td>
                              <td className="border border-black py-0.5">{formatCurrency(price * item.quantity)}</td>
                           </React.Fragment>
                        );
                     })}

                     <td className="border border-black py-0.5 font-semibold bg-gray-50 print:bg-gray-100">{formatCurrency(calcs.avgUnit)}</td>
                     <td className="border border-black py-0.5 font-bold bg-gray-100 print:bg-gray-200">{formatCurrency(calcs.avgTotal)}</td>
                  </tr>
               );
            })}
             
         </tbody>
         <tfoot>
            <tr className="bg-gray-200 font-bold text-[8pt] print:bg-gray-200">
               <td colSpan={4} className="border border-black text-right px-2 py-1">GENEL TOPLAM:</td>
               {suppliers.map((s, idx) => (
                  <React.Fragment key={idx}>
                     <td colSpan={2} className="border border-black py-1">
                        {s ? formatCurrency(getSupplierGrandTotal(s.id)) + ' ₺' : ''}
                     </td>
                  </React.Fragment>
               ))}
               <td colSpan={2} className="border border-black py-1">
                  {formatCurrency(grandTotal)} ₺
               </td>
            </tr>
         </tfoot>
      </table>

      {/* Explanation Text */}
      <div className="mt-2 border border-black p-2 bg-white text-justify text-[8pt] avoid-break">
         <p className="indent-8">
            Yukarıda adı geçen işe ait yaklaşık maliyetin tespiti için 4734 Sayılı Kamu İhale Kanunu'nun 9. maddesi ve İhale Yönetmeliklerinin ilgili maddeleri gereğince piyasa fiyat araştırması yapılmıştır.
            Yapılan piyasa araştırması sonucunda, yukarıdaki tabloda belirtilen kişi ve firmalardan alınan tekliflerin aritmetik ortalaması alınarak işin (KDV Hariç) <strong>Yaklaşık Maliyeti {formatCurrency(grandTotal)} TL</strong> olarak hesaplanmıştır.
         </p>
      </div>

      {/* Signatures */}
      <div className="mt-4 avoid-break">
         <div className="text-center font-bold mb-4 text-xs underline">
            YAKLAŞIK MALİYET TESPİT KOMİSYONU
         </div>
         <div className="flex justify-around items-end px-4">
            {state.approxCostCommission.map((member) => (
               <div key={member.id} className="text-center w-40">
                  <p className="font-bold text-[8pt] mb-1">{member.role}</p>
                  <div className="h-8 mb-1"></div>
                  <p className="font-bold text-[9pt]">{member.name}</p>
                  <p className="text-[8pt] text-gray-600">{member.title}</p>
               </div>
            ))}
         </div>
         <div className="flex justify-center mt-4">
             <div className="text-center">
                 <p className="text-[8pt] mb-2">.../.../20...</p>
                 <p className="font-bold text-[9pt]">ONAY</p>
                 <div className="h-6"></div>
                 <p className="font-bold text-[9pt]">{state.spendingOfficial.name}</p>
                 <p className="text-[8pt]">{state.spendingOfficial.title}</p>
             </div>
         </div>
      </div>
    </div>
  );
};