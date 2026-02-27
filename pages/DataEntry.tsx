import React from 'react';
import { useProcurement } from '../context/ProcurementContext';

const DataEntry: React.FC = () => {
  const { state, updateInstitution, updateOfficial, setMeta, updateWorkflow } = useProcurement();

  // Dosya No değiştiğinde, Muayene Kabul Karar No'sunu da aynı yap
  const handleTenderNumberChange = (val: string) => {
    setMeta('tenderNumber', val);
    // İşlem akışındaki Karar No'yu da güncelle
    updateWorkflow('inspection', { decisionNumber: val });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">

      {/* Kurum Bilgileri */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Kurum Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kurum Adı</label>
            <input
              type="text"
              autoFocus
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={state.institution.name}
              onChange={(e) => updateInstitution({ name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">İl / İlçe</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="İl"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={state.institution.city}
                onChange={(e) => updateInstitution({ city: e.target.value })}
              />
              <input
                type="text"
                placeholder="İlçe"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={state.institution.district}
                onChange={(e) => updateInstitution({ district: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vergi No</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={state.institution.taxNumber}
              onChange={(e) => updateInstitution({ taxNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              Dosya/İhale No
              <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">Karar No ile eşitlenir</span>
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={state.tenderNumber}
              onChange={(e) => handleTenderNumberChange(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Yetkililer */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Yetkililer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-sm font-bold text-gov-800 mb-2">Harcama Yetkilisi (Okul Md.)</h3>
            <div className="space-y-3">
              <input
                type="text" placeholder="Ad Soyad"
                className="block w-full rounded-md border-gray-300 border p-2"
                value={state.spendingOfficial.name}
                onChange={(e) => updateOfficial('spending', { name: e.target.value })}
              />
              <input
                type="text" placeholder="Unvan (Örn: Okul Müdürü)"
                className="block w-full rounded-md border-gray-300 border p-2"
                value={state.spendingOfficial.title}
                onChange={(e) => updateOfficial('spending', { title: e.target.value })}
              />
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-sm font-bold text-gov-800 mb-2">Gerçekleştirme Görevlisi (Md. Yrd.)</h3>
            <div className="space-y-3">
              <input
                type="text" placeholder="Ad Soyad"
                className="block w-full rounded-md border-gray-300 border p-2"
                value={state.realizationOfficial.name}
                onChange={(e) => updateOfficial('realization', { name: e.target.value })}
              />
              <input
                type="text" placeholder="Unvan (Örn: Müdür Yardımcısı)"
                className="block w-full rounded-md border-gray-300 border p-2"
                value={state.realizationOfficial.title}
                onChange={(e) => updateOfficial('realization', { title: e.target.value })}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Alım Detayları */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Alım Detayları</h2>
        <div className="flex space-x-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Alım Türü</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={state.procurementType}
              onChange={(e) => {
                setMeta('procurementType', e.target.value);
                (e.target as HTMLSelectElement).blur();
              }}
            >
              <option value="Mal">Mal Alımı</option>
              <option value="Hizmet">Hizmet Alımı</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Madde</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={state.directProcurementArticle}
              onChange={(e) => {
                setMeta('directProcurementArticle', e.target.value);
                (e.target as HTMLSelectElement).blur();
              }}
            >
              <option value="22/d">22/d (Doğrudan Temin)</option>
              <option value="22/a">22/a</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">İşlem Tarihi</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={state.date}
              onChange={(e) => setMeta('date', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Komisyon Uyarı */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Komisyon üye atamaları için sol menüdeki <b>"2. Komisyonlar"</b> sayfasını kullanınız.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;