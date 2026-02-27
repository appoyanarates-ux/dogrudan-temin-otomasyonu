import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { X } from 'lucide-react';

export const DocKomisyonOnay: React.FC = () => {
  const { state, updateWorkflow } = useProcurement();

  const docData = state.workflow.commissionApproval;
  const docNumber = docData.number || '...';
  const suffix = docData.suffix || '-934.01.99';
  
  const purchasingCommission = state.marketResearchCommission.length > 0 
    ? state.marketResearchCommission 
    : state.approxCostCommission;

  return (
    <div className="font-serif text-[10pt] leading-tight text-black h-auto flex flex-col w-full">
      {/* Header */}
      <div className="text-center font-bold mb-4">
        <p>T.C.</p>
        <p>{state.institution.city.toUpperCase()} KAYMAKAMLIĞI</p>
        <p>İlçe Milli Eğitim Müdürlüğü</p>
        <p>{state.institution.name}</p>
      </div>

      {/* Info Block */}
      <div className="flex justify-between items-end mb-4">
         <div>
            <div className="flex">
               <span className="w-16 font-semibold">Sayı</span>
               <span>: {state.correspondenceCode ? `${state.correspondenceCode}${suffix}/${docNumber}` : docNumber}</span>
            </div>
            <div className="flex">
               <span className="w-16 font-semibold">Konu</span>
               <span>: Yaklaşık Maliyet, Piyasa Araştırması,</span>
            </div>
            <div className="flex">
               <span className="w-16"></span>
               <span>&nbsp;&nbsp;ve Muayene Kabul Komisyon Onayı</span>
            </div>
         </div>
         <div className="font-medium flex items-center gap-1 group">
             {/* Print View */}
            <span className="hidden print:inline">
               {docData.date ? docData.date.split('-').reverse().join('.') : '.../.../20...'}
            </span>
            {/* Screen View */}
             <input 
               type="date"
               className="bg-transparent text-right font-inherit border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-32 h-6 print:hidden"
               value={docData.date}
               onChange={(e) => updateWorkflow('commissionApproval', { date: e.target.value })}
            />
             {docData.date && (
               <button 
                  onClick={() => updateWorkflow('commissionApproval', { date: '' })}
                  className="text-gray-400 hover:text-red-500 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Tarihi Temizle"
               >
                  <X size={14} />
               </button>
            )}
         </div>
      </div>

      {/* Addressing Text */}
      <div className="text-center mb-4">
         <p className="font-bold text-[11pt]">{state.institution.name.toUpperCase()} MÜDÜRLÜĞÜNE</p>
         <p className="text-[9pt]">(İhale/Harcama Yetkilisi)</p>
      </div>

      {/* Body Text */}
      <div className="text-justify indent-8 leading-normal mb-6">
         {state.jobDescription || 'Temizlik Malzemesi Alımı'} işine ait ihtiyaç liste onayı ekte sunulmuştur. Söz konusu mal/malzeme
         4734 Sayılı Kamu İhale Kanunu'nun {state.directProcurementArticle === '22/d' ? ' 22/d ' : ' 22/a '} Maddesi gereğince Doğrudan Temin usulü ile satın
         alınacağından; 1) Her türlü fiyat araştırmasını yapmak ve yaklaşık maliyet cetvelini hazırlayarak onaya
         sunmak üzere aşağıda isim ve ünvanları yazılı memurlardan fiyat araştırma komisyonu, 2) Onay
         Belgesi'nin tanziminden sonra yazılı teklif mektupları alarak değerlendirmek ve ihaleyi sonuçlandırarak
         onaya sunmak üzere yine aşağıda yazılı memurlardan ihale komisyonu, 3) Mal/malzeme tesliminden
         sonra satın alınan mal/malzemelerin özelliklerini ve sayılarını kontrol ederek teslim almak, bir tutanağa
         bağlayarak sistem üzerinden Taşınır İşlem Fişine aktarmak üzere aşağıda yazılı memurlardan muayene
         ve teslim alma komisyonu oluşturulması müdürlüğümüzce uygun görülmektedir. Makamınızca da uygun
         görüldüğü takdirde OLUR'larınıza arz ederim.
      </div>

      {/* Realization Official Signature */}
      <div className="flex justify-end mb-6 avoid-break">
         <div className="text-center w-56">
            <p className="font-bold">{state.realizationOfficial.name}</p>
            <p>{state.realizationOfficial.title}</p>
         </div>
      </div>

      {/* OLUR Block */}
      <div className="text-center mb-6 avoid-break">
         <p className="font-bold mb-0.5">OLUR</p>
         <p className="mb-4">
           {docData.date ? docData.date.split('-').reverse().join('.') : '.../.../20...'}
         </p>
         <p className="font-bold">{state.spendingOfficial.name}</p>
         <p>Okul Müdürü</p>
         <p>İhale / Harcama Yetkilisi</p>
      </div>

      {/* Tables */}
      <div className="mb-4 avoid-break">
         <div className="text-center font-bold text-[9pt] mb-1">Yaklaşık Maliyet Tesbit ve Satın Alma Komisyonu Adı, Ünvanı ve Görevleri</div>
         <table className="w-full border-collapse border border-black text-[9pt]">
           <thead>
             <tr className="bg-gray-100 print:bg-gray-100 text-center">
               <th className="border border-black py-0.5 px-2 w-12">S.No</th>
               <th className="border border-black py-0.5 px-2">Adı Soyadı</th>
               <th className="border border-black py-0.5 px-2">Ünvanı</th>
               <th className="border border-black py-0.5 px-2">Görevi</th>
             </tr>
           </thead>
           <tbody>
             {purchasingCommission.map((member, idx) => (
               <tr key={member.id}>
                 <td className="border border-black py-0.5 px-2 text-center">{idx + 1}</td>
                 <td className="border border-black py-0.5 px-2">{member.name}</td>
                 <td className="border border-black py-0.5 px-2">{member.title}</td>
                 <td className="border border-black py-0.5 px-2">{member.role}</td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>

      <div className="avoid-break">
         <div className="text-center font-bold text-[9pt] mb-1">Muayene ve Teslim Alma Komisyonu Adı, Ünvanı ve Görevleri</div>
         <table className="w-full border-collapse border border-black text-[9pt]">
           <thead>
             <tr className="bg-gray-100 print:bg-gray-100 text-center">
               <th className="border border-black py-0.5 px-2 w-12">S.No</th>
               <th className="border border-black py-0.5 px-2">Adı Soyadı</th>
               <th className="border border-black py-0.5 px-2">Ünvanı</th>
               <th className="border border-black py-0.5 px-2">Görevi</th>
             </tr>
           </thead>
           <tbody>
             {state.inspectionCommission.map((member, idx) => (
               <tr key={member.id}>
                 <td className="border border-black py-0.5 px-2 text-center">{idx + 1}</td>
                 <td className="border border-black py-0.5 px-2">{member.name}</td>
                 <td className="border border-black py-0.5 px-2">{member.title}</td>
                 <td className="border border-black py-0.5 px-2">{member.role}</td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
};