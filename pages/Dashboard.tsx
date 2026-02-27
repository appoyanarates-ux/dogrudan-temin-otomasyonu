import React from 'react';
import { useProcurement } from '../context/ProcurementContext';
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  UserCog,
  CalendarClock,
  ShoppingCart,
  Search,
  Calculator,
  Printer,
  FileDown
} from 'lucide-react';

const Dashboard: React.FC<{ setTab: (t: string) => void }> = ({ setTab }) => {
  const { state, calculateAverageApproxCost, getWinnerSupplier } = useProcurement();

  const totalCost = calculateAverageApproxCost();
  const winner = getWinnerSupplier();

  // Durum Kontrolleri
  const isSetupComplete = state.institution.name && state.spendingOfficial.name;
  const hasItems = state.items.length > 0;
  const hasCommissions = state.approxCostCommission[0].name !== '' && state.marketResearchCommission[0].name !== '';
  const hasWinner = !!winner;

  // Kart Bileşeni
  const ActionCard = ({
    step,
    title,
    desc,
    icon: Icon,
    tab,
    colorClass,
    statusIcon = null
  }: any) => (
    <button
      onClick={() => setTab(tab)}
      className={`p-4 border rounded-xl text-left transition-all hover:shadow-md active:scale-[0.98] flex flex-col justify-between h-full group bg-white hover:bg-gray-50 border-gray-200`}
    >
      <div className="flex justify-between items-start w-full mb-3">
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
          <Icon size={20} />
        </div>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">Adım {step}</span>
      </div>
      <div>
        <div className="font-bold text-gray-800 flex items-center mb-1">
          {title}
          {statusIcon}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </button>
  );

  return (
    <div className="space-y-8 pb-10">

      {/* Üst İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dosya No</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{state.tenderNumber}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <CheckCircle size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 border-t pt-2 border-gray-100">Oluşturulma: {new Date(state.lastUpdated).toLocaleDateString('tr-TR')}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Yaklaşık Maliyet</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalCost)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 border-t pt-2 border-gray-100">{state.items.length} Kalem Ürün</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tedarikçiler</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{state.suppliers.length} Firma</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full text-purple-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 border-t pt-2 border-gray-100 truncate">
            {winner ? `Kazanan: ${winner.name}` : 'Henüz belirlenmedi'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Durum</p>
              <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-bold ${hasWinner ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {hasWinner ? 'Tamamlandı' : 'Devam Ediyor'}
              </span>
            </div>
            <div className="p-3 bg-orange-50 rounded-full text-orange-600">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 border-t pt-2 border-gray-100">
            Son İşlem: {state.workflow.inspection.date ? 'Muayene Kabul' : 'Veri Girişi'}
          </p>
        </div>
      </div>

      {/* İşlem Menüsü */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold mb-6 text-gray-800 border-b pb-2">Hızlı İşlem Menüsü</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <ActionCard
            step="1"
            title="Veri Girişi"
            desc="Kurum, yetkili ve dosya bilgilerini tanımlayın."
            icon={CheckCircle}
            tab="data-entry"
            colorClass="text-blue-600 bg-blue-500"
            statusIcon={isSetupComplete ? <CheckCircle size={14} className="ml-2 text-green-500" /> : <AlertCircle size={14} className="ml-2 text-red-500" />}
          />

          <ActionCard
            step="2"
            title="Komisyonlar"
            desc="Yaklaşık maliyet ve muayene komisyon üyelerini atayın."
            icon={UserCog}
            tab="commission"
            colorClass="text-purple-600 bg-purple-500"
            statusIcon={hasCommissions ? <CheckCircle size={14} className="ml-2 text-green-500" /> : null}
          />

          <ActionCard
            step="3"
            title="İşlem Akışı"
            desc="Evrak tarih ve sayılarını tek ekrandan yönetin."
            icon={CalendarClock}
            tab="workflow"
            colorClass="text-orange-600 bg-orange-500"
          />

          <ActionCard
            step="4"
            title="İhtiyaç Listesi"
            desc="Satın alınacak ürün ve miktarları girin."
            icon={ShoppingCart}
            tab="needs"
            colorClass="text-indigo-600 bg-indigo-500"
            statusIcon={hasItems ? <CheckCircle size={14} className="ml-2 text-green-500" /> : null}
          />

          <ActionCard
            step="5"
            title="Piyasa Araştırması"
            desc="Firma tekliflerini girin, en düşüğü hesaplayın."
            icon={Search}
            tab="market"
            colorClass="text-teal-600 bg-teal-500"
          />

          <ActionCard
            step="6"
            title="Teklifler"
            desc="Kazanan firmayı görün ve adresini kaydedin."
            icon={Calculator}
            tab="offers"
            colorClass="text-emerald-600 bg-emerald-500"
            statusIcon={hasWinner ? <CheckCircle size={14} className="ml-2 text-green-500" /> : null}
          />

          <ActionCard
            step="7"
            title="Evrak & Çıktı"
            desc="Hazırlanan evrakları görüntüleyin ve yazdırın."
            icon={Printer}
            tab="documents"
            colorClass="text-gray-600 bg-gray-500"
          />

          <ActionCard
            step="8"
            title="Toplu PDF"
            desc="Tüm dosyayı tek seferde PDF olarak indirin."
            icon={FileDown}
            tab="pdf-export"
            colorClass="text-red-600 bg-red-500"
          />

        </div>
      </div>
    </div>
  );
};

export default Dashboard;