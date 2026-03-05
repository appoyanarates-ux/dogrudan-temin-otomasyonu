import React from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { CheckCircle, AlertCircle, TrendingUp, Users } from 'lucide-react';

const Dashboard: React.FC<{ setTab: (t: string) => void }> = ({ setTab }) => {
  // calculateAverageApproxCost kullanılarak Cetvel mantığı (teklif ortalaması) çekiliyor.
  const { state, calculateAverageApproxCost, getWinnerSupplier } = useProcurement();

  const totalCost = calculateAverageApproxCost();
  const winner = getWinnerSupplier();
  const isSetupComplete = state.institution.name && state.spendingOfficial.name;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Dosya No</p>
              <p className="text-2xl font-bold text-gray-900">{state.tenderNumber}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{state.date}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Yaklaşık Maliyet (Cetvel)</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalCost)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{state.items.length} Kalem Ürün</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tedarikçiler</p>
              <p className="text-2xl font-bold text-gray-900">{state.suppliers.length}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full text-purple-600">
              <Users size={24} />
            </div>
          </div>
           <p className="text-xs text-gray-400 mt-2">
             {winner ? `Kazanan: ${winner.name}` : 'Henüz belirlenmedi'}
           </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Hızlı İşlem Menüsü</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setTab('data-entry')}
            className={`p-4 border rounded-lg text-left transition ${isSetupComplete ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
          >
            <div className="font-semibold flex items-center">
              1. Veri Girişi
              {isSetupComplete ? <CheckCircle size={16} className="ml-2 text-green-600"/> : <AlertCircle size={16} className="ml-2 text-red-500"/>}
            </div>
            <p className="text-sm text-gray-600 mt-1">Kurum bilgileri ve yetkililer.</p>
          </button>

          <button
             onClick={() => setTab('commission')}
             className={`p-4 border rounded-lg text-left transition ${state.approxCostCommission.length > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gov-300 hover:bg-gray-50'}`}
          >
            <div className="font-semibold flex items-center">
              2. Komisyon Atama
              {state.approxCostCommission.length > 0 && <CheckCircle size={16} className="ml-2 text-green-600"/>}
            </div>
            <p className="text-sm text-gray-600 mt-1">Komisyon üyelerini belirleyin.</p>
          </button>

          <button
             onClick={() => setTab('workflow')}
             className="p-4 border border-gray-200 hover:border-gov-300 rounded-lg text-left transition hover:bg-gray-50"
          >
            <div className="font-semibold">3. İş Akışı</div>
            <p className="text-sm text-gray-600 mt-1">Süreç adımlarını yönetin.</p>
          </button>

          <button
             onClick={() => setTab('needs')}
             className={`p-4 border rounded-lg text-left transition ${state.items.length > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gov-300 hover:bg-gray-50'}`}
          >
            <div className="font-semibold flex items-center">
              4. İhtiyaç Listesi
              {state.items.length > 0 && <CheckCircle size={16} className="ml-2 text-green-600"/>}
            </div>
            <p className="text-sm text-gray-600 mt-1">Ürünleri tanımlayın.</p>
          </button>

          <button
             onClick={() => setTab('market')}
             className={`p-4 border rounded-lg text-left transition ${state.suppliers.length > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gov-300 hover:bg-gray-50'}`}
          >
            <div className="font-semibold flex items-center">
              5. Piyasa Fiyat Araştırması
              {state.suppliers.length > 0 && <CheckCircle size={16} className="ml-2 text-green-600"/>}
            </div>
            <p className="text-sm text-gray-600 mt-1">Firma ve fiyat girişi.</p>
          </button>

          <button
             onClick={() => setTab('offers')}
             className={`p-4 border rounded-lg text-left transition ${state.offers.length > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gov-300 hover:bg-gray-50'}`}
          >
            <div className="font-semibold flex items-center">
              6. Teklifler
              {state.offers.length > 0 && <CheckCircle size={16} className="ml-2 text-green-600"/>}
            </div>
            <p className="text-sm text-gray-600 mt-1">Teklifleri değerlendirin.</p>
          </button>

          <button
             onClick={() => setTab('documents')}
             className="p-4 border border-gray-200 hover:border-gov-300 rounded-lg text-left transition hover:bg-gray-50"
          >
            <div className="font-semibold">7. Evraklar</div>
            <p className="text-sm text-gray-600 mt-1">Belgeleri görüntüleyin.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;