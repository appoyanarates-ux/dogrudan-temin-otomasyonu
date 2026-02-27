import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { X } from 'lucide-react';

export const DocFiyatArastirma: React.FC = () => {
  const { state, updateWorkflow } = useProcurement();

  const docDate = state.workflow.priceResearch.date;
  const docNumber = state.workflow.priceResearch.number || '...';
  const suffix = state.workflow.priceResearch.suffix || '-934.02.03';
  
  // Komisyon üyelerini (Öncelikle Piyasa Araştırma, yoksa Yaklaşık Maliyet) al
  const commissionMembers = state.marketResearchCommission.length > 0 
    ? state.marketResearchCommission 
    : state.approxCostCommission;

  return (
    <div className="font-serif text-[10pt] leading-tight text-black h-auto flex flex-col w-full">
       {/* Header */}
      <div className="text-center font-bold mb-4 leading-snug">
        <p>T.C.</p>
        <p>{state.institution.city.toUpperCase()} KAYMAKAMLIĞI</p>
        <p>İlçe Milli Eğitim Müdürlüğü</p>
        <p>{state.institution.name}</p>
      </div>

      {/* Info Row */}
      <div className="flex justify-between items-start mb-6 font-semibold text-[10pt]">
         <div className="space-y-1">
            <div className="flex">
               <span className="w-12">Sayı</span>
               <span>: {state.correspondenceCode ? `${state.correspondenceCode}${suffix}/${docNumber}` : docNumber}</span>
            </div>
            <div className="flex">
               <span className="w-12">Konu</span>
               <span>: Fiyat Araştırması</span>
            </div>
         </div>
         <div className="text-right flex items-center gap-1 group">
             {/* Print View */}
             <span className="hidden print:inline">
               {docDate ? docDate.split('-').reverse().join('.') : '.../.../20...'}
            </span>
            {/* Screen View */}
             <input 
               type="date"
               className="bg-transparent text-right font-inherit border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-32 h-6 print:hidden"
               value={docDate}
               onChange={(e) => updateWorkflow('priceResearch', { date: e.target.value })}
            />
             {docDate && (
               <button 
                  onClick={() => updateWorkflow('priceResearch', { date: '' })}
                  className="text-gray-400 hover:text-red-500 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Tarihi Temizle"
               >
                  <X size={14} />
               </button>
            )}
         </div>
      </div>

      {/* Title */}
      <div className="text-center font-bold text-[11pt] mb-4 underline">
         İLGİLİ KİŞİ/FİRMA
      </div>

      {/* Body Text */}
      <div className="text-justify indent-8 leading-normal mb-6 text-[10pt]">
         {state.jobDescription || 'Temizlik Malzemesi Alımı'} işine ait aşağıda cinsi, özellikleri ve miktarları yazılı mallar / hizmetler
         4734 Sayılı Kamu İhale Kanunu'nun {state.directProcurementArticle} Maddesi gereğince Doğrudan Temin Usulüyle satın
         alınacağından yaklaşık maliyetin tespiti için piyasa araştırması yapılmaktadır, birim fiyatının ve tutarının
         KDV hariç bildirmenizi rica ederim/ederiz.
      </div>

      {/* Commission Signatures (TOP) */}
      <div className="flex justify-around items-start mb-6 px-4">
        {commissionMembers.map((member, idx) => (
           <div key={idx} className="text-center">
              <p className="font-bold text-[9pt] mb-1">Komisyon Üyesi</p>
              <div className="h-4"></div>
              <p className="font-bold text-[9pt] whitespace-nowrap">{member.name}</p>
              <p className="text-[9pt]">{member.title}</p>
           </div>
        ))}
      </div>

      {/* Table */}
      <div className="mb-1">
         <table className="w-full border-collapse border border-black text-[9pt]">
           <thead>
             <tr className="bg-gray-100 print:bg-gray-100 text-center font-bold">
               <td colSpan={5} className="border border-black py-1">SATIN ALINACAK MAL/MALZEME LİSTESİ</td>
               <td colSpan={2} className="border border-black py-1">Teklif Edilen KDV Hariç</td>
             </tr>
             <tr className="bg-gray-50 print:bg-gray-50 text-center font-bold text-[8pt]">
               <th className="border border-black py-1 px-1 w-8">S.No</th>
               <th className="border border-black py-1 px-2">Malzemenin Adı</th>
               <th className="border border-black py-1 px-2">Özelliği</th>
               <th className="border border-black py-1 px-1 w-12">Miktarı</th>
               <th className="border border-black py-1 px-1 w-12">Ölçeği</th>
               <th className="border border-black py-1 px-1 w-20">Birim Fiyatı</th>
               <th className="border border-black py-1 px-1 w-20">Tutarı</th>
             </tr>
           </thead>
           <tbody>
             {state.items.map((item, idx) => (
               <tr key={item.id}>
                 <td className="border border-black py-1 px-1 text-center">{idx + 1}</td>
                 <td className="border border-black py-1 px-2">{item.name}</td>
                 <td className="border border-black py-1 px-2">{item.description}</td>
                 <td className="border border-black py-1 px-1 text-center">{item.quantity}</td>
                 <td className="border border-black py-1 px-1 text-center">{item.unit}</td>
                 <td className="border border-black py-1 px-1"></td>
                 <td className="border border-black py-1 px-1"></td>
               </tr>
             ))}
             {/* Empty rows filler if needed */}
             {state.items.length < 5 && Array.from({ length: 5 - state.items.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-6">
                   <td className="border border-black"></td>
                   <td className="border border-black"></td>
                   <td className="border border-black"></td>
                   <td className="border border-black"></td>
                   <td className="border border-black"></td>
                   <td className="border border-black"></td>
                   <td className="border border-black"></td>
                </tr>
             ))}
           </tbody>
           <tfoot>
              <tr>
                 <td colSpan={5} className="border border-black text-right pr-2 py-1 font-bold bg-gray-50 print:bg-gray-50">KDV Hariç Teklif Edilen Fiyat:</td>
                 <td colSpan={2} className="border border-black"></td>
              </tr>
           </tfoot>
         </table>
      </div>

      {/* Acceptance Text */}
      <div className="text-center my-3 text-[10pt] px-4">
         Yukarıda ismi belirtilen mal/malzemenin birim ve toplam fiyatı günün şartlarına göre
         belirlenmiş olup belirtilen fiyatlar üzerinden vermeyi teklif ediyorum. Arz olunur.
      </div>

      {/* Bottom Layout (Other Conditions & Signature) */}
      <div className="flex gap-4 mt-2 items-start avoid-break">
         
         {/* Left: Diğer Şartlar Table */}
         <div className="w-[55%]">
            <div className="font-bold mb-1 ml-1 text-[9pt]">DİĞER ŞARTLAR</div>
            <table className="w-full border-collapse border border-black text-[8pt]">
               <tbody>
                  <tr>
                     <td className="border border-black p-1 bg-gray-50 print:bg-gray-50 w-1/2">Teslim Süresi</td>
                     <td className="border border-black p-1 text-center">10 Gün</td>
                  </tr>
                  <tr>
                     <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Teslim Edilecek Parti Miktarı</td>
                     <td className="border border-black p-1 text-center">1</td>
                  </tr>
                  <tr>
                     <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Nakliye ve Sigortanın Kime Ait Olduğu</td>
                     <td className="border border-black p-1 text-center">Satıcıya</td>
                  </tr>
                  <tr>
                     <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Diğer Özel Şartlar</td>
                     <td className="border border-black p-1"></td>
                  </tr>
                  <tr>
                     <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Uyulması Gereken Standartlar</td>
                     <td className="border border-black p-1 text-center">TSE</td>
                  </tr>
                  <tr>
                     <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Teknik Şartname</td>
                     <td className="border border-black p-1"></td>
                  </tr>
                  <tr>
                     <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Diğer Hususlar</td>
                     <td className="border border-black p-1"></td>
                  </tr>
               </tbody>
            </table>
         </div>

         {/* Right: Signature Area */}
         <div className="w-[45%] pl-4 pt-4">
            <div className="flex items-center mb-4 text-[9pt]">
               <span className="font-bold mr-2">Tarih:</span>
               <span>.../.../20...</span>
            </div>

            <div className="text-center space-y-8 mt-6">
               <div className="text-[9pt] font-bold">
                  Adı Soyadı, Ticaret Ünvanı, İmza, Kaşe<br/>
                  veya Açık Adres, Tel. No
               </div>
               
               {/* Dotted Lines for manual entry */}
               <div className="space-y-3">
                  <div className="border-b border-dotted border-black w-full h-1"></div>
                  <div className="border-b border-dotted border-black w-full h-1"></div>
                  <div className="border-b border-dotted border-black w-full h-1"></div>
                  <div className="border-b border-dotted border-black w-full h-1"></div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};