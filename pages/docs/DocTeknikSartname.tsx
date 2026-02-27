import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Sparkles, Loader2, Edit2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const DocTeknikSartname: React.FC = () => {
  const { state, setMeta } = useProcurement();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateAI = async () => {
    if (state.items.length === 0) {
      alert("İhtiyaç listesi boş. Lütfen önce ürün ekleyin.");
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const itemList = state.items.map((i, idx) => 
        `${idx + 1}. ${i.name} (Miktar: ${i.quantity} ${i.unit}) - ${i.description || 'Standart özellik'}`
      ).join('\n');

      const prompt = `
        Aşağıdaki bilgiler doğrultusunda 4734 Sayılı Kamu İhale Kanunu Doğrudan Temin usulüne uygun, profesyonel bir teknik şartname metni yaz.
        
        Kurum Adı: ${state.institution.name}
        İşin Konusu: Malzeme/Hizmet Alımı
        
        Alınacak Kalemler:
        ${itemList}
        
        İstekler:
        1. Her ürün için kısa ama teknik detay içeren maddeler oluştur.
        2. "Genel Şartlar" başlığı altında nakliye, teslimat, muayene, garanti ve ambalaj konularını içeren standart maddeler ekle.
        3. Dil resmi ve emir kipiyle olsun (Teslim edilecektir, uygun olacaktır vb.).
        4. Çıktı formatı sade metin olsun, HTML tag kullanma, sadece başlıkları ve maddeleri belirgin yap.
        5. En alta "İşbu teknik şartname ... maddeden ibarettir." ibaresi ekle.
      `;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      if (response.text) {
        setMeta('technicalSpecificationContent', response.text);
      }
    } catch (err: any) {
      console.error(err);
      setError('AI Oluşturma Hatası: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Toolbar - Only visible on screen */}
      <div className="no-print mb-6 bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center text-indigo-900">
           <Sparkles size={20} className="mr-2 text-indigo-600" />
           <span className="font-bold text-sm">Yapay Zeka Asistanı</span>
        </div>
        
        <div className="flex items-center gap-3">
           {!state.technicalSpecificationContent && (
             <span className="text-xs text-indigo-600 mr-2">Otomatik şartname oluşturmak için tıklayın &rarr;</span>
           )}
           <button 
             onClick={handleGenerateAI}
             disabled={isGenerating}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow flex items-center text-sm font-bold transition-colors disabled:bg-gray-400"
           >
             {isGenerating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />}
             {state.technicalSpecificationContent ? 'Yeniden Oluştur' : 'AI ile Oluştur'}
           </button>
        </div>
      </div>
      
      {error && (
        <div className="no-print bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Document Content */}
      <div className="flex-1">
        <div className="text-center font-bold mb-8">
          <p>TEKNİK ŞARTNAME</p>
        </div>

        {state.technicalSpecificationContent ? (
          <div className="space-y-4">
             {/* Edit Warning */}
             <div className="no-print text-xs text-gray-400 flex items-center mb-2">
                <Edit2 size={12} className="mr-1"/> Metni aşağıdan düzenleyebilirsiniz.
             </div>
             
             {/* Textarea for Screen / Pre for Print */}
             <textarea 
               className="no-print w-full h-[500px] p-4 border rounded font-serif text-[11pt] leading-relaxed resize-y focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
               value={state.technicalSpecificationContent}
               onChange={(e) => setMeta('technicalSpecificationContent', e.target.value)}
             />
             <div className="print-only whitespace-pre-wrap font-serif text-[11pt] leading-relaxed text-justify">
               {state.technicalSpecificationContent}
             </div>
          </div>
        ) : (
          /* Default Manual View (Fallback) */
          <>
            <p className="mb-4"><strong>İşin Konusu:</strong> {state.institution.name} ihtiyacı olan aşağıda belirtilen malzemelerin alımı.</p>

            <div className="space-y-6">
              {state.items.map((item, idx) => (
                <div key={item.id} className="border-b border-gray-300 pb-4">
                  <p className="font-bold">{idx + 1}. {item.name}</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Miktar: {item.quantity} {item.unit}</li>
                    {item.description ? <li>{item.description}</li> : <li>Standart özelliklere sahip olacaktır.</li>}
                    <li>Ürünler 1. sınıf kalitede olacaktır.</li>
                    <li>Ambalajı bozulmamış, orijinal paketinde teslim edilecektir.</li>
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="font-bold underline mb-2">Genel Şartlar:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Malzemeler idarenin belirlediği yere teslim edilecektir.</li>
                <li>Nakliye ve sigorta yükleniciye aittir.</li>
                <li>Muayene ve kabul komisyonunca beğenilmeyen ürünler derhal değiştirilecektir.</li>
              </ol>
            </div>
          </>
        )}

        <div className="flex justify-end mt-16 break-inside-avoid">
          <div className="text-center">
             <p className="font-bold">Hazırlayan</p>
             <div className="h-10"></div>
             <p>{state.realizationOfficial.name}</p>
             <p>{state.realizationOfficial.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};