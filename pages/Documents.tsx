import React, { useRef, useState } from 'react';
import { Printer, FileText, Download, Loader2 } from 'lucide-react';
import { DocumentType } from '../types';

// Import Document Templates
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

// Declare html2pdf for TypeScript
declare var html2pdf: any;

interface DocumentsProps {
  activeDoc: DocumentType;
}

const Documents: React.FC<DocumentsProps> = ({ activeDoc }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handlePrint = () => {
    window.print();
  };

  const docLabels: Record<DocumentType, string> = {
    'ihtiyac_listesi': '1. İhtiyaç Listesi',
    'komisyon_onay': '2. Komisyon Onayı',
    'fiyat_arastirma': '3. Fiyat Araştırma Yazısı',
    'yaklasik_maliyet': '4. Yaklaşık Maliyet Cetveli',
    'onay_belgesi': '5. Onay Belgesi',
    'teklif_mektubu': '6. Teklif Mektubu',
    'piyasa_arastirma': '7. Piyasa Araştırma Tutanağı',
    'muayene_kabul': '8. Muayene Kabul Tutanağı',
    'teknik_sartname': '9. Teknik Şartname',
    'hizmet_kabul': '10. Hizmet Kabul Tutanağı',
    'hakedis_raporu': '11. Hak Ediş Raporu',
    'teslim_tutanagi': 'Teslim Tutanağı'
  };

  // Determine if landscape mode is needed
  const isLandscape = activeDoc === 'piyasa_arastirma' || activeDoc === 'yaklasik_maliyet';

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;
    setIsDownloading(true);

    const element = contentRef.current;
    
    // PDF Config: Standard A4 Margins
    // Element is h-auto, so 10mm margin will simply frame the content.
    // If content < A4, it fits on 1 page.
    const opt = {
      margin: 10, // 10mm (1cm) margin.
      filename: `${docLabels[activeDoc].replace(/[\s.]/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().from(element).set(opt).save().then(() => {
      setIsDownloading(false);
    });
  };

  const renderDocument = () => {
    switch(activeDoc) {
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
      default: return <div>Seçilen evrak henüz hazır değil.</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* Top Navigation Bar - No Print */}
      <div className="bg-white border-b border-gray-200 p-4 no-print sticky top-0 z-20 shadow-sm flex justify-between items-center rounded-lg mb-4">
          
          <div className="flex items-center text-gray-800">
            <FileText className="mr-3 text-gov-600" size={24} />
            <h2 className="font-bold text-lg">{docLabels[activeDoc]}</h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
             <div className="text-xs text-gray-400 mr-2 hidden md:block text-right">
                <div className="font-semibold">Kağıt Yönü</div>
                <div>{isLandscape ? 'Yatay (Landscape)' : 'Dikey (Portrait)'}</div>
             </div>

             <button 
               onClick={handleDownloadPDF}
               disabled={isDownloading}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow flex items-center font-bold text-sm transition-transform active:scale-95 whitespace-nowrap disabled:bg-gray-400"
             >
               {isDownloading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Download size={18} className="mr-2" />}
               PDF İNDİR
             </button>

             <button 
               onClick={handlePrint}
               className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black shadow-lg flex items-center font-bold text-sm transition-transform active:scale-95 whitespace-nowrap"
             >
               <Printer size={18} className="mr-2" /> 
               YAZDIR
             </button>
          </div>
      </div>

      {/* Document Preview Area */}
      <div className="flex-1 overflow-auto bg-gray-200/50 p-6 rounded-lg border border-gray-200 print:border-none print:p-0 print:bg-white print:overflow-visible">
        <div className="flex justify-center min-h-full pb-10 print:pb-0">
          
          {/* 
              VISUAL PAPER CONTAINER (Ekran için A4 Görünümü)
              Bu div PDF'e GİRMEZ. Sadece ekranda beyaz kağıt gibi görünmesini sağlar.
              min-h-[297mm] buradadır, böylece içerik az olsa bile ekranda tam sayfa görünür.
          */}
          <div 
             className={`bg-white shadow-xl print:shadow-none origin-top
               ${isLandscape ? 'max-w-[297mm] w-full' : 'max-w-[210mm] w-full'} 
               min-h-[297mm] print:min-h-0 print:h-auto
             `}
          >
            {/* 
                PRINTABLE CONTENT (PDF'e Giren Kısım)
                Burada min-h YOKTUR. İçerik ne kadarsa o kadar yer kaplar.
                Böylece html2pdf (içerik yüksekliği + 10mm marj) hesapladığında 297mm'yi geçmez ve 2. sayfa oluşmaz.
            */}
            <div ref={contentRef} className="bg-white p-8 print:p-0 h-auto w-full">
               {renderDocument()}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;