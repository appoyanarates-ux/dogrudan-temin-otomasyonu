import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { X } from 'lucide-react';

export const DocOnayBelgesi: React.FC = () => {
  // Using calculateAverageApproxCost instead of calculateApproxCost to match "Yaklaşık Maliyet Cetveli" logic
  const { state, calculateAverageApproxCost, updateWorkflow } = useProcurement();
  const totalCost = calculateAverageApproxCost();
  
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + '₺';

  const approvalInfo = state.workflow.tenderApproval;
  const suffix = approvalInfo.suffix || '-934.01.02';
  
  // Komisyon üyelerini belirle
  const commissionMembers = state.marketResearchCommission.length > 0 
    ? state.marketResearchCommission 
    : state.approxCostCommission;

  return (
    <div className="font-serif text-[9pt] leading-tight text-black h-auto flex flex-col w-full">
      {/* HEADER */}
      <div className="text-center font-bold mb-2">
        <p>T.C.</p>
        <p>{state.institution.city.toUpperCase()} KAYMAKAMLIĞI</p>
        <p>İlçe Milli Eğitim Müdürlüğü</p>
        <p>{state.institution.name}</p>
      </div>

      {/* TITLE BOX */}
      <div className="border border-black bg-blue-200 print:bg-blue-200 text-center font-bold py-1 border-b-0 text-[10pt]">
        ONAY BELGESİ
      </div>

      {/* TOP TABLE (IDARE & TARIH) */}
      <table className="w-full border-collapse border border-black mb-0 text-[9pt]">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 w-1/3 bg-blue-50 print:bg-blue-50">Doğrudan Temini Yapan İdarenin Adı:</td>
            <td className="border border-black px-2 py-1">{state.institution.name}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Belge Tarih ve Sayısı:</td>
            <td className="border border-black px-2 py-1 flex justify-between">
              <span className="flex items-center gap-1 group">
                 {/* Print View */}
                 <span className="hidden print:inline">
                   {approvalInfo.date ? approvalInfo.date.split('-').reverse().join('.') : '.../.../20...'}
                 </span>
                 {/* Screen View */}
                 <input 
                   type="date"
                   className="bg-transparent text-left font-inherit border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-32 h-5 print:hidden"
                   value={approvalInfo.date}
                   onChange={(e) => updateWorkflow('tenderApproval', { date: e.target.value })}
                />
                 {approvalInfo.date && (
                   <button 
                      onClick={() => updateWorkflow('tenderApproval', { date: '' })}
                      className="text-gray-400 hover:text-red-500 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Tarihi Temizle"
                   >
                      <X size={14} />
                   </button>
                )}
              </span>
              <span>{state.correspondenceCode ? `${state.correspondenceCode}${suffix}/${approvalInfo.number || '...'}` : approvalInfo.number}</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ADDRESSING */}
      <div className="border border-black border-t-0 border-b-0 py-2 text-center bg-blue-100 print:bg-blue-100">
        <p className="font-bold text-[10pt]">{state.institution.name.toUpperCase()} MÜDÜRLÜĞÜNE</p>
        <p className="text-right px-2 text-[8pt]">İhale/Harcama Yetkilisi</p>
      </div>

      {/* MAIN DETAILS TABLE */}
      <table className="w-full border-collapse border border-black text-[9pt]">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 w-[35%] bg-blue-50 print:bg-blue-50">İşin Tanımı</td>
            <td className="border border-black px-2 py-1">{state.procurementType} Alımı</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">İşin Niteliği</td>
            <td className="border border-black px-2 py-1">
              {state.jobDescription || 'Temizlik Malzemesi Alımı'}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">İşin Miktarı</td>
            <td className="border border-black px-2 py-1">Ekli belgede gösterilmiştir.</td>
          </tr>
          
          <tr className="h-2 bg-blue-200 print:bg-blue-200 border border-black"><td colSpan={2}></td></tr>

          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Yaklaşık Maliyet (KDV Hariç)(₺)</td>
            <td className="border border-black px-2 py-1 font-bold">{formatCurrency(totalCost)}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Kullanılabilir Ödenek Tutarı (KDV Dahil)( ₺ )</td>
            <td className="border border-black px-2 py-1">{state.allowance > 0 ? formatCurrency(state.allowance) : '..........................₺'}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Yatırım Proje Numarası (Varsa)</td>
            <td className="border border-black px-2 py-1"></td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Bütçe Tertibi</td>
            <td className="border border-black px-2 py-1">{state.budgetCode || '..........................'}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Avans Verilecekse Şartları</td>
            <td className="border border-black px-2 py-1">Verilmeyecektir.</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">İhale Usulü</td>
            <td className="border border-black px-2 py-1">4734 Sayılı Kamu İhale Kanunu'nun {state.directProcurementArticle} Maddesi</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">İlanın Şekli ve Adedi</td>
            <td className="border border-black px-2 py-1">Yapılmayacak</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Ön Yeterlik/İhale Dökümanı Satış Bedeli</td>
            <td className="border border-black px-2 py-1">0</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Fiyat Farkı Ödenecekse Dayanağı BKK</td>
            <td className="border border-black px-2 py-1">Ödenmeyecektir</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Sözleşme Düzenlenip Düzenlenmeyeceği</td>
            <td className="border border-black px-2 py-1">Düzenlenmeyecektir</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Şartname Düzenlenip Düzenlenmeyeceği</td>
            <td className="border border-black px-2 py-1">Düzenlenmeyecektir</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 bg-blue-50 print:bg-blue-50">Yeterlilik Kriterleri Aranıp Aranmayacağı</td>
            <td className="border border-black px-2 py-1">Aranmayacaktır</td>
          </tr>

          {/* COMMISSION MEMBERS EMBEDDED */}
          <tr>
             <td className="border border-black px-2 py-1 align-top bg-blue-50 print:bg-blue-50">
                Doğrudan Temin Usulü ile Mal ve Hizmet satın alınacaksa piyasa fiyat araştırması yapmak üzere görevlendirilecek kişi/ kişiler
             </td>
             <td className="border border-black p-0">
                <table className="w-full border-collapse">
                   <thead>
                      <tr className="bg-blue-100 print:bg-blue-100">
                         <th className="border-b border-r border-black py-1 text-[8pt]">Adı Soyadı</th>
                         <th className="border-b border-r border-black py-1 text-[8pt]">Görevi</th>
                         <th className="border-b border-black py-1 text-[8pt]">Unvanı</th>
                      </tr>
                   </thead>
                   <tbody>
                      {commissionMembers.map((member, idx) => (
                         <tr key={idx}>
                            <td className="border-b border-r border-black px-2 py-0.5 text-[8pt] text-center">{member.name}</td>
                            <td className="border-b border-r border-black px-2 py-0.5 text-[8pt] text-center">{member.role}</td>
                            <td className="border-b border-black px-2 py-0.5 text-[8pt] text-center">{member.title}</td>
                         </tr>
                      ))}
                      {/* Empty rows if needed */}
                      {commissionMembers.length === 0 && (
                          <tr><td colSpan={3} className="text-center py-2 text-gray-400">Komisyon üyesi eklenmedi</td></tr>
                      )}
                   </tbody>
                </table>
             </td>
          </tr>
        </tbody>
      </table>

      {/* OTHER EXPLANATIONS */}
      <div className="border border-black border-t-0 p-1 text-center bg-blue-200 print:bg-blue-200 font-bold text-[9pt]">
         DİĞER AÇIKLAMALAR
      </div>
      <div className="border border-black border-t-0 p-4 min-h-[40px]"></div>

      {/* ONAY SECTION (SPLIT) */}
      <div className="border border-black border-t-0 flex">
         
         {/* LEFT: PROPOSAL */}
         <div className="w-1/2 p-4 border-r border-black flex flex-col justify-between">
            <div className="text-center font-bold underline mb-2 bg-blue-50 print:bg-blue-50">ONAY</div>
            <div className="text-justify text-[9pt] indent-6 leading-snug mb-4">
               Yukarıda belirtilen mal / malzeme / hizmetin satın alınması için ilgililerin görevlendirilmeleri hususunu
               onaylarınıza arz ve teklif ederim.
            </div>
            
            <div className="text-center mt-4">
               <p className="mb-4">
                 {approvalInfo.date ? approvalInfo.date.split('-').reverse().join('.') : '.../.../20...'}
               </p>
               <p className="font-bold text-[10pt]">{state.realizationOfficial.name}</p>
               <p className="text-[9pt]">{state.realizationOfficial.title}</p>
            </div>
         </div>

         {/* RIGHT: APPROVAL */}
         <div className="w-1/2 p-4 flex flex-col justify-between items-center">
            <div className="h-6"></div> {/* Spacer for alignment */}
            
            <div className="text-center">
                <p className="font-bold text-[11pt] mb-6">UYGUNDUR</p>
                <p className="mb-1 text-[9pt]">İhale Yetkilisi</p>
                <p className="mb-4">
                  {approvalInfo.date ? approvalInfo.date.split('-').reverse().join('.') : '.../.../20...'}
                </p>
                <p className="font-bold text-[10pt]">{state.spendingOfficial.name}</p>
                <p className="text-[9pt]">{state.spendingOfficial.title}</p>
            </div>
         </div>

      </div>

      <div className="text-[8pt] mt-1 pl-1 font-semibold">
         Ek: İdare Tarafından Hazırlanan Yaklaşık Maliyet Hesap Cetveli
      </div>
    </div>
  );
};
