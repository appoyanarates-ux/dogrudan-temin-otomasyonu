import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { X } from 'lucide-react';

export const DocIhtiyacListesi: React.FC = () => {
  const { state, updateWorkflow } = useProcurement();

  const docData = state.workflow.needsList;
  const docNumber = docData.number || '...';
  const suffix = docData.suffix || '-934.01';
  const subject = state.jobDescription || 'Temizlik Malzemesi Alımı';

  return (
    <div className="font-serif text-[10pt] leading-tight text-black flex flex-col h-auto w-full">
      {/* Header */}
      <div className="text-center font-bold mb-4">
        <p>T.C.</p>
        <p>{state.institution.city.toUpperCase()} KAYMAKAMLIĞI</p>
        <p>İlçe Milli Eğitim Müdürlüğü</p>
        <p>{state.institution.name}</p>
      </div>

      {/* Info Block */}
      <div className="flex justify-between items-end mb-4 text-[10pt]">
         <div>
            <div className="flex">
               <span className="w-16 font-semibold">Sayı</span>
               <span>: {state.correspondenceCode ? `${state.correspondenceCode}${suffix}/${docNumber}` : docNumber}</span>
            </div>
            <div className="flex">
               <span className="w-16 font-semibold">Konu</span>
               <span>: {subject}</span>
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
               onChange={(e) => updateWorkflow('needsList', { date: e.target.value })}
            />
            {docData.date && (
               <button 
                  onClick={() => updateWorkflow('needsList', { date: '' })}
                  className="text-gray-400 hover:text-red-500 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Tarihi Temizle"
               >
                  <X size={14} />
               </button>
            )}
         </div>
      </div>

      {/* Title */}
      <div className="text-center font-bold text-base mb-4 bg-blue-50/50 py-1 border-t border-b border-gray-200 print:border-none print:bg-transparent">
         MAL/MALZEME İHTİYAÇ LİSTESİ
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-black mb-4 text-[9pt]">
        <thead>
          <tr className="bg-blue-100 print:bg-gray-100 text-center">
            <th className="border border-black py-1 px-1 w-12">Sıra</th>
            <th className="border border-black py-1 px-2">Mal/Malzemenin Adı</th>
            <th className="border border-black py-1 px-2 w-1/3">Özelliği</th>
            <th className="border border-black py-1 px-1 w-16">Miktarı</th>
            <th className="border border-black py-1 px-1 w-16">Ölçeği</th>
          </tr>
        </thead>
        <tbody>
          {state.items.map((item, idx) => (
            <tr key={item.id}>
              <td className="border border-black py-0.5 px-1 text-center">{idx + 1}</td>
              <td className="border border-black py-0.5 px-2">{item.name}</td>
              <td className="border border-black py-0.5 px-2">{item.description}</td>
              <td className="border border-black py-0.5 px-1 text-center">{item.quantity}</td>
              <td className="border border-black py-0.5 px-1 text-center">{item.unit}</td>
            </tr>
          ))}
          {state.items.length < 5 && Array.from({ length: 3 }).map((_, i) => (
            <tr key={`empty-${i}`} className="h-6">
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Addressing Text */}
      <div className="text-center mb-4 avoid-break">
         <p className="font-bold text-[11pt]">{state.institution.name.toUpperCase()} MÜDÜRLÜĞÜNE</p>
         <p className="text-[9pt]">(İhale/Harcama Yetkilisi)</p>
      </div>

      {/* Body Text */}
      <div className="text-justify indent-8 leading-normal mb-6 text-[10pt] avoid-break">
         Müdürlüğümüzün ihtiyacı olan mal/malzeme yukarıya çıkarılmış olup 4734 Sayılı Kamu İhale Kanunu'nun 
         {state.directProcurementArticle === '22/d' ? ' 22/d ' : ' 22/a '} 
         Maddesi gereğince Doğrudan Temin yoluyla satın alınması için uygun görüldüğü takdirde 
         OLUR'larınıza arz ederim.
      </div>

      {/* Signatures */}
      <div className="flex flex-col relative h-40 avoid-break mt-auto">
         <div className="absolute right-0 top-0 text-center w-56">
            <p className="font-bold">{state.realizationOfficial.name}</p>
            <p>{state.realizationOfficial.title}</p>
         </div>

         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center w-56">
            <p className="font-bold mb-0.5">OLUR</p>
            <p className="mb-4">
               {docData.date ? docData.date.split('-').reverse().join('.') : '.../.../20...'}
            </p>
            <p className="font-bold">{state.spendingOfficial.name}</p>
            <p>Okul Müdürü</p>
            <p className="text-[9pt]">İhale(Harcama Yetkilisi)</p>
         </div>
      </div>
    </div>
  );
};