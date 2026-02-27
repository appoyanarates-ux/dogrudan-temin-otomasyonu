import React from 'react';
import { User, Mail, Tag, BookOpen, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  const steps = [
    {
      title: "1. Veri Girişi",
      desc: "Kurum bilgileri, harcama yetkilisi ve gerçekleştirme görevlisi bilgilerini girin. Dosya numarasını ve alım türünü belirleyin."
    },
    {
      title: "2. Komisyonlar",
      desc: "Yaklaşık Maliyet, Piyasa Araştırma ve Muayene Kabul komisyonlarında görev alacak personelleri tanımlayın."
    },
    {
      title: "3. İşlem Akışı",
      desc: "Sürecin tarihçesini yönetin. İhtiyaç listesi tarihinden muayene kabul tarihine kadar olan evrak sayılarını ve tarihlerini girin."
    },
    {
      title: "4. İhtiyaç Listesi",
      desc: "Satın alınacak ürün veya hizmet kalemlerini, miktarlarını ve birimlerini sisteme ekleyin."
    },
    {
      title: "5. Piyasa Araştırması",
      desc: "Teklif alınan 3 firmanın ismini girin ve her kalem için verdikleri birim fiyatları işleyin. Sistem en düşük teklifi otomatik hesaplar."
    },
    {
      title: "6. Teklifler",
      desc: "Otomatik belirlenen kazanan firmayı görün ve firmanın adres bilgilerini girerek sonucu kaydedin."
    },
    {
      title: "7. Evrak & Çıktı",
      desc: "Oluşturulan verilerle hazırlanan resmi evrakları (Onay Belgesi, Tutanaklar vb.) tek tek görüntüleyin ve yazdırın."
    },
    {
      title: "8. Toplu PDF",
      desc: "Tüm sürece ait evrakları tek bir dosya halinde PDF olarak indirin ve arşivleyin."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      
      {/* Developer Info Card */}
      <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gov-900 to-gov-700 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <ShieldCheck className="mr-3" size={32} />
            Doğrudan Temin Otomasyonu
          </h1>
          <p className="text-blue-100 mt-2 opacity-90">
            4734 Sayılı Kamu İhale Kanunu süreçlerini kolaylaştırmak için tasarlanmıştır.
          </p>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
              <User size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Geliştirici</p>
              <p className="text-lg font-semibold text-gray-900">Abdullah Yanarateş</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-orange-50 p-3 rounded-full text-orange-600">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">İletişim</p>
              <p className="text-lg font-semibold text-gray-900">appo.yanarates@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-green-50 p-3 rounded-full text-green-600">
              <Tag size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Versiyon</p>
              <p className="text-lg font-semibold text-gray-900">05052025</p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
          <div className="bg-gov-100 p-2 rounded-lg mr-3">
             <BookOpen className="text-gov-700" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Uygulama Nasıl Kullanılır?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="flex group">
              <div className="flex-shrink-0 mr-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center">
                  {step.title.split('. ')[1]}
                  <ChevronRight size={16} className="ml-1 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"/>
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
           <CheckCircle2 className="text-yellow-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
           <div className="text-sm text-yellow-800">
              <span className="font-bold">İpucu:</span> Verileriniz tarayıcınızın yerel hafızasında (LocalStorage) saklanmaktadır. Tarayıcı önbelleğini temizlemediğiniz sürece verileriniz kaybolmaz. Farklı cihazlardan erişim için verileri dışarı aktarmanız gerekebilir.
           </div>
        </div>
      </div>

    </div>
  );
};

export default About;