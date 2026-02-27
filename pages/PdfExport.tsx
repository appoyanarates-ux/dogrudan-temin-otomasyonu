import React, { useRef, useState } from 'react';
import { Download, CheckSquare, Square, Loader2, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DocumentType } from '../types';

// Import All Docs
import { DocIhtiyacListesi } from './docs/DocIhtiyacListesi';
import { DocKomisyonOnay } from './docs/DocKomisyonOnay';
import { DocFiyatArastirma } from './docs/DocFiyatArastirma';
import { DocYaklasikMaliyet } from './docs/DocYaklasikMaliyet';
import { DocOnayBelgesi } from './docs/DocOnayBelgesi';
import { DocTeklifMektubu } from './docs/DocTeklifMektubu';
import { DocPiyasaArastirma } from './docs/DocPiyasaArastirma';
import { DocMuayeneKabul } from './docs/DocMuayeneKabul';
import { DocTeknikSartname } from './docs/DocTeknikSartname';
import { DocHizmetKabul } from './docs/DocHizmetKabul';
import { DocHakedisRaporu } from './docs/DocHakedisRaporu';

// Declare html2pdf
declare var html2pdf: any;

const PdfExport: React.FC = () => {
  const [selectedDocs, setSelectedDocs] = useState<DocumentType[]>([
    'ihtiyac_listesi', 'komisyon_onay', 'fiyat_arastirma', 'yaklasik_maliyet', 'onay_belgesi', 'piyasa_arastirma', 'muayene_kabul'
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const bulkRef = useRef<HTMLDivElement>(null);

  const docList: { id: DocumentType; label: string; landscape?: boolean }[] = [
    { id: 'ihtiyac_listesi', label: '1. İhtiyaç Listesi' },
    { id: 'komisyon_onay', label: '2. Komisyon Onayı' },
    { id: 'fiyat_arastirma', label: '3. Fiyat Araştırması' },
    { id: 'yaklasik_maliyet', label: '4. Yaklaşık Maliyet Cetveli', landscape: true },
    { id: 'onay_belgesi', label: '5. Onay Belgesi' },
    { id: 'teklif_mektubu', label: '6. Teklif Mektubu' },
    { id: 'piyasa_arastirma', label: '7. Piyasa Araştırma Tutanağı', landscape: true },
    { id: 'muayene_kabul', label: '8. Muayene Kabul' },
    { id: 'teknik_sartname', label: '9. Teknik Şartname' },
    { id: 'hizmet_kabul', label: '10. Hizmet Kabul Tutanağı' },
    { id: 'hakedis_raporu', label: '11. Hak Ediş Raporu' },
  ];

  const toggleDoc = (id: DocumentType) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter(d => d !== id));
    } else {
      setSelectedDocs([...selectedDocs, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDocs.length === docList.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(docList.map(d => d.id));
    }
  };

  const generateBulkPDF = () => {
    if (!bulkRef.current || selectedDocs.length === 0) return;
    setIsGenerating(true);

    const element = bulkRef.current;
    
    // PDF Config
    const opt = {
      margin: 0, 
      filename: `Tum_Evraklar_${new Date().toISOString().slice(0,10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        scrollY: 0,
        letterRendering: true
      }, 
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    setTimeout(() => {
        html2pdf().from(element).set(opt).save().then(() => {
          setIsGenerating(false);
        });
    }, 100);
  };

  const renderComponent = (type: DocumentType) => {
    switch (type) {
      case 'ihtiyac_listesi': return <DocIhtiyacListesi />;
      case 'komisyon_onay': return <DocKomisyonOnay />;
      case 'fiyat_arastirma': return <DocFiyatArastirma />;
      case 'yaklasik_maliyet': return <DocYaklasikMaliyet />;
      case 'onay_belgesi': return <DocOnayBelgesi />;
      case 'teklif_mektubu': return <DocTeklifMektubu />;
      case 'piyasa_arastirma': return <DocPiyasaArastirma />;
      case 'muayene_kabul': return <DocMuayeneKabul />;
      case 'teknik_sartname': return <DocTeknikSartname />;
      case 'hizmet_kabul': return <DocHizmetKabul />;
      case 'hakedis_raporu': return <DocHakedisRaporu />;
      default: return null;
    }
  };

  const docsToRender = docList.filter(d => selectedDocs.includes(d.id));

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FileText className="mr-3 text-red-600" size={24} />
            Toplu PDF Oluşturma
          </h2>
          <p className="text-gray-500 text-sm mt-1">
             Seçtiğiniz tüm evraklar tek bir PDF dosyası olarak indirilecektir.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="hidden md:flex flex-col items-end text-xs text-amber-600 mr-2 bg-amber-50 px-3 py-1 rounded border border-amber-200">
              <span className="font-bold flex items-center"><AlertTriangle size={12} className="mr-1"/> Dikkat</span>
              <span>Yatay sayfalar dikey sayfaya sığdırılır.</span>
           </div>
           
           <button 
             onClick={generateBulkPDF}
             disabled={isGenerating || selectedDocs.length === 0}
             className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 shadow-lg flex items-center font-bold text-sm transition-all active:scale-95 disabled:bg-gray-400"
           >
             {isGenerating ? <Loader2 className="animate-spin mr-2" size={20} /> : <Download size={20} className="mr-2" />}
             SEÇİLENLERİ PDF İNDİR
           </button>
        </div>
      </div>

      {/* Selection Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
            <span className="font-bold text-sm text-gray-700">{selectedDocs.length} Evrak Seçildi</span>
            <button 
              onClick={handleSelectAll}
              className="text-blue-600 text-sm font-semibold hover:underline"
            >
              {selectedDocs.length === docList.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
            </button>
         </div>

         <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docList.map((doc) => {
               const isSelected = selectedDocs.includes(doc.id);
               return (
                  <div 
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`cursor-pointer border-2 rounded-lg p-4 flex items-start transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                     <div className={`mt-0.5 mr-3 ${isSelected ? 'text-blue-600' : 'text-gray-300'}`}>
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                     </div>
                     <div>
                        <div className={`font-bold text-sm ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>{doc.label}</div>
                        {doc.landscape && (
                           <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold border border-gray-300 rounded px-1 inline-block">Yatay</div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      {/* 
          HIDDEN RENDER CONTAINER 
          Position fixed left -10000px ensures it's rendered but not visible.
          Width is set to A4 width (210mm).
      */}
      <div 
         style={{ 
             position: 'fixed', 
             left: '-10000px', 
             top: 0, 
             width: '210mm', 
             zIndex: -1000,
             visibility: 'visible' 
         }}
      >
         <div ref={bulkRef} className="bg-white text-black w-full">
            {docsToRender.map((doc, index) => (
               <div 
                  key={doc.id}
                  className="bg-white relative box-border overflow-hidden"
                  style={{ 
                     // Using 296mm instead of 297mm to prevent slight overflow triggering a blank page
                     height: '296mm', 
                     padding: '10mm',
                     pageBreakAfter: index === docsToRender.length - 1 ? 'auto' : 'always'
                  }}
               >
                  {renderComponent(doc.id)}
                  
                  {/* Footer numbering */}
                  <div className="absolute bottom-4 right-8 text-[8pt] text-gray-400">
                     Sayfa {index + 1}
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default PdfExport;