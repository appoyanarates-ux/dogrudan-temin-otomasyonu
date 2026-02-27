import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { X } from 'lucide-react';

export const DocTeklifMektubu: React.FC = () => {
  const { state, updateWorkflow } = useProcurement();

  // If specific offer date is set, use it. Otherwise rely on general date but respect empty strings.
  const docDate = state.workflow.offerLetter.date; 
  // If undefined, maybe fallback to state.date, but allow manual clear.
  // Actually, let's just use docDate. If it's empty, it's empty.

  return (
    <div className="font-serif text-[10pt] leading-tight text-black h-auto flex flex-col p-2 w-full">
       <div className="bg-blue-100/30 print:bg-transparent h-full flex flex-col">
          {/* Header */}
          <div className="text-center font-bold mb-2 leading-snug">
            <p>T.C.</p>
            <p>{state.institution.city.toUpperCase()} KAYMAKAMLIĞI</p>
            <p>İlçe Milli Eğitim Müdürlüğü</p>
            <p>{state.institution.name}</p>
          </div>

          <div className="text-right mb-2 font-bold text-[10pt] flex justify-end items-center gap-1 group">
               {/* Print View */}
               <span className="hidden print:inline">
                 {docDate ? docDate.split('-').reverse().join('.') : '.../.../20...'}
               </span>
               {/* Screen View */}
              <input 
               type="date"
               className="bg-transparent text-right font-inherit border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-32 h-6 font-bold print:hidden"
               value={docDate || ''}
               onChange={(e) => updateWorkflow('offerLetter', { date: e.target.value })}
            />
             {docDate && (
               <button 
                  onClick={() => updateWorkflow('offerLetter', { date: '' })}
                  className="text-gray-400 hover:text-red-500 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Tarihi Temizle"
               >
                  <X size={14} />
               </button>
            )}
          </div>

          <div className="text-center font-bold text-[11pt] mb-2">
            TEKLİF MEKTUBU
          </div>

          {/* Legal Text */}
          <div className="text-justify mb-2 indent-8 text-[10pt] leading-snug">
            <p>
              İdaremiz tarafından <b>{state.jobDescription || 'Temizlik Malzemesi Alımı'}</b> işine ait aşağıda cinsi, özellikleri ve miktarları yazılı
              mallar / hizmetler 4734 Sayılı Kamu İhale Kanunu'nun {state.directProcurementArticle} Maddesi gereğince Doğrudan Temin Usulüyle
              satın alınacaktır. İlgilenmeniz halinde; teklifin KDV hariç olarak sunulması, teklif edilen toplam bedelin
              rakam ve yazı ile birbirine uygun olarak yazılması, Üzerinde kazıntı, silinti ve düzeltme yapılmaması, Teklif
              Mektubunun Ad, Soyad ve Ticaret Ünvanı yazılmak sureti ile kaşelenmesi ve imzalanması zorunlu olup, bu
              şartları taşımayan teklifler değerlendirilmeye alınmayacaktır
            </p>
          </div>

          {/* Bidder Info Form */}
          <div className="mb-2 text-[10pt] avoid-break">
            <p className="text-black mb-1">Teklif Sahibinin</p>
            <table className="w-full border-none text-[10pt]">
                <tbody className="align-bottom">
                    <tr>
                        <td className="w-[40%] py-0.5 whitespace-nowrap">Adı Soyadı/Ticaret Unvanı, Uyruğu</td>
                        <td className="w-2 py-0.5">:</td>
                        <td className="border-b border-dotted border-gray-400 py-0.5"></td>
                    </tr>
                    <tr>
                        <td className="py-0.5 whitespace-nowrap">Açık Tebligat Adresi</td>
                        <td className="w-2 py-0.5">:</td>
                        <td className="border-b border-dotted border-gray-400 py-0.5"></td>
                    </tr>
                    <tr>
                        <td className="py-0.5 whitespace-nowrap">Bağlı Olduğu Vergi Dairesi ve Vergi Numarası</td>
                        <td className="w-2 py-0.5">:</td>
                        <td className="border-b border-dotted border-gray-400 py-0.5"></td>
                    </tr>
                    <tr>
                        <td className="py-0.5 whitespace-nowrap">Telefon ve Faks Numarası</td>
                        <td className="w-2 py-0.5">:</td>
                        <td className="border-b border-dotted border-gray-400 py-0.5"></td>
                    </tr>
                    <tr>
                        <td className="py-0.5 whitespace-nowrap">E-Mail Adresi (varsa)</td>
                        <td className="w-2 py-0.5">:</td>
                        <td className="border-b border-dotted border-gray-400 py-0.5"></td>
                    </tr>
                </tbody>
            </table>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse border border-black text-[9pt] mb-2 mt-2">
            <thead className="bg-blue-200 print:bg-gray-200 text-center font-bold">
              <tr>
                <th className="border border-black p-1 w-8">S.No</th>
                <th className="border border-black p-1">Malzemenin Adı</th>
                <th className="border border-black p-1">Özelliği</th>
                <th className="border border-black p-1 w-14">Miktarı</th>
                <th className="border border-black p-1 w-14">Ölçeği</th>
                <th className="border border-black p-1 w-20">Birim Fiyatı</th>
                <th className="border border-black p-1 w-20">Tutarı</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="border border-black p-1 text-center bg-white">{idx + 1}</td>
                  <td className="border border-black p-1 bg-white">{item.name}</td>
                  <td className="border border-black p-1 bg-white">{item.description || ''}</td>
                  <td className="border border-black p-1 text-center bg-white">{item.quantity}</td>
                  <td className="border border-black p-1 text-center bg-white">{item.unit}</td>
                  <td className="border border-black p-1 bg-white"></td>
                  <td className="border border-black p-1 bg-white"></td>
                </tr>
              ))}
               {/* Filler Rows */}
               {state.items.length < 4 && Array.from({length: 4 - state.items.length}).map((_, i) => (
                  <tr key={`fill-${i}`} className="h-6">
                      <td className="border border-black bg-white"></td>
                      <td className="border border-black bg-white"></td>
                      <td className="border border-black bg-white"></td>
                      <td className="border border-black bg-white"></td>
                      <td className="border border-black bg-white"></td>
                      <td className="border border-black bg-white"></td>
                      <td className="border border-black bg-white"></td>
                  </tr>
               ))}
            </tbody>
            <tfoot>
                <tr className="avoid-break bg-blue-200 print:bg-gray-200">
                    <td colSpan={5} className="border border-black p-1 text-right font-bold">KDV Hariç Teklif Edilen Fiyat:</td>
                    <td colSpan={2} className="border border-black p-1 bg-white"></td>
                </tr>
            </tfoot>
          </table>

          {/* Declaration */}
          <div className="text-justify mb-2 text-[9pt] leading-snug mt-2 avoid-break px-1">
             <p>
               Yukarıda belirtilen ve İdarenizce satın alınacak olan malların / hizmetlerin cinsi, özellikleri, miktarı ve
               diğer şartlarını okudum. KDV hariç toplam Teklif edilen toplam [bedel para birimi belirtilerek rakam ve yazı ile
               yazılacaktır] ............................................................................ bedelle vermeyi kabul ve taahhüt
               ediyorum / ediyoruz.
             </p>
          </div>

          {/* Bottom Layout (Other Conditions & Signature) */}
          <div className="flex gap-4 mt-4 items-start avoid-break">
             
             {/* Left: Diğer Şartlar Table */}
             <div className="w-[50%]">
                <div className="font-bold mb-1 ml-1 text-[9pt]">DİĞER ŞARTLAR</div>
                <table className="w-full border-collapse border border-black text-[9pt]">
                   <tbody>
                      <tr>
                         <td className="border border-black p-1 bg-gray-50 print:bg-gray-50 w-2/3">Teslim Süresi</td>
                         <td className="border border-black p-1 text-center bg-white">10</td>
                      </tr>
                      <tr>
                         <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Teslim Edilecek Parti Miktarı</td>
                         <td className="border border-black p-1 text-center bg-white">1</td>
                      </tr>
                      <tr>
                         <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Nakliye ve Sigortanın Kime Ait Olduğu</td>
                         <td className="border border-black p-1 text-center bg-white">Satıcıya</td>
                      </tr>
                      <tr>
                         <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Diğer Özel Şartlar</td>
                         <td className="border border-black p-1 bg-white"></td>
                      </tr>
                      <tr>
                         <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Uyulması Gereken Standartlar</td>
                         <td className="border border-black p-1 text-center bg-white">TSE</td>
                      </tr>
                      <tr>
                         <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Teknik Şartname</td>
                         <td className="border border-black p-1 bg-white"></td>
                      </tr>
                      <tr>
                         <td className="border border-black p-1 bg-gray-50 print:bg-gray-50">Diğer Hususlar</td>
                         <td className="border border-black p-1 bg-white"></td>
                      </tr>
                   </tbody>
                </table>
             </div>
    
             {/* Right: Signature Area */}
             <div className="w-[50%] pl-4 pt-0">
                <div className="flex items-center mb-6 text-[10pt]">
                   <span className="font-bold mr-2">Tarih:</span>
                   <span>......./......./202...</span>
                </div>
    
                <div className="text-center space-y-6 mt-2">
                   <div className="text-[9pt] font-bold">
                      Adı Soyadı, Ticaret Ünvanı, İmza, Kaşe<br/>
                      veya Açık Adres, Tel. No
                   </div>
                   
                   {/* Dotted Lines for manual entry */}
                   <div className="space-y-4 pt-4">
                      <div className="border-b border-dotted border-black w-full h-1"></div>
                      <div className="border-b border-dotted border-black w-full h-1"></div>
                      <div className="border-b border-dotted border-black w-full h-1"></div>
                      <div className="border-b border-dotted border-black w-full h-1"></div>
                   </div>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};