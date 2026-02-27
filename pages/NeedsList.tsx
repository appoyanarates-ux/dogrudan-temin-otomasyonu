import React, { useState } from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { UNITS } from '../constants';
import { Save, Trash2, Plus, Package, FileText, Info, AlertTriangle } from 'lucide-react';
import { Item } from '../types';

const NeedsList: React.FC = () => {
  const { state, addItem, updateItem, removeItem, setMeta, notify } = useProcurement();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const triggerSuccess = () => {
    notify('İhtiyaç listesi başarıyla güncellendi.', 'success');
  };

  const handleAddItem = () => {
    const id = crypto.randomUUID();
    const newItem: Item = {
      id,
      name: '',
      description: '',
      quantity: 1,
      unit: 'Adet',
      estimatedUnitPrice: 0,
    };
    addItem(newItem);
    setLastAddedId(id);
  };

  const handleChange = (id: string, field: keyof Item, value: any) => {
    const item = state.items.find(i => i.id === id);
    if (item) {
      updateItem({ ...item, [field]: value });
    }
  };

  const handleClearClick = () => {
    if (state.items.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    setMeta('items', []);
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">


      {/* Delete Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Listeyi Temizle</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Tüm ihtiyaç listesi silinecektir. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 py-2.5 px-4 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition-colors shadow-sm"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="mr-3 text-blue-600" size={28} />
              İhtiyaç Listesi
            </h1>
            <p className="text-gray-500 mt-1">Alınacak mal veya hizmetlerin listesini ve detaylarını buradan yönetebilirsiniz.</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 flex items-center shadow-sm">
            <Info className="mr-2" size={16} />
            Toplam {state.items.length} Kalem
          </div>
        </div>

        {/* Job Description Input */}
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 focus-within:bg-white group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600">
            Yapılan İş / Mal / Hizmetin Adı
          </label>
          <div className="flex items-center">
            <FileText className="text-gray-400 mr-3 group-focus-within:text-blue-500 transition-colors" size={24} />
            <input
              type="text"
              className="w-full bg-transparent text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none"
              placeholder="Örn: 2024 Yılı Temizlik Malzemesi Alımı"
              value={state.jobDescription || ''}
              onChange={(e) => setMeta('jobDescription', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Items Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 bg-gray-50 border-b border-gray-200 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-4">Malzeme Adı</div>
          <div className="col-span-4">Teknik Özellik / Açıklama</div>
          <div className="col-span-1 text-center">Miktar</div>
          <div className="col-span-1 text-center">Birim</div>
          <div className="col-span-1 text-center">İşlem</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {state.items.length === 0 ? (
            <div className="p-16 text-center text-gray-400 flex flex-col items-center justify-center bg-gray-50/50">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Package size={40} className="text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">Listeniz henüz boş</h3>
              <p className="text-sm mb-6 max-w-xs mx-auto">Başlamak için aşağıdaki butona tıklayarak ilk mal veya hizmet kalemini ekleyin.</p>
              <button
                onClick={handleAddItem}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold text-sm shadow transition-transform active:scale-95 flex items-center"
              >
                <Plus size={16} className="mr-2" />
                İlk Kaydı Ekle
              </button>
            </div>
          ) : (
            state.items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-blue-50/30 transition-colors group">

                {/* Index */}
                <div className="col-span-1 text-center">
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mx-auto">
                    {index + 1}
                  </span>
                </div>

                {/* Name Input */}
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Ürün adı giriniz..."
                    autoFocus={item.id === lastAddedId}
                    className="w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-blue-400 focus:bg-white rounded px-3 py-2 outline-none text-gray-900 font-medium transition-all placeholder-gray-400"
                    value={item.name}
                    onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const nextInput = e.currentTarget.closest('.grid')?.querySelector('input[placeholder="Özellik belirtiniz..."]') as HTMLInputElement;
                        nextInput?.focus();
                      }
                    }}
                  />
                </div>

                {/* Description Input */}
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Özellik belirtiniz..."
                    className="w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-blue-400 focus:bg-white rounded px-3 py-2 outline-none text-gray-600 text-sm transition-all"
                    value={item.description}
                    onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                  />
                </div>

                {/* Quantity Input */}
                <div className="col-span-1">
                  <input
                    type="number"
                    min="0"
                    className="w-full text-center bg-transparent border border-transparent hover:border-gray-300 focus:border-blue-400 focus:bg-white rounded px-2 py-2 outline-none text-gray-900 font-bold transition-all"
                    value={item.quantity}
                    onChange={(e) => handleChange(item.id, 'quantity', Number(e.target.value))}
                  />
                </div>

                {/* Unit Select */}
                <div className="col-span-1">
                  <div className="relative">
                    <select
                      className="w-full bg-transparent text-center border border-transparent hover:border-gray-300 focus:border-blue-400 focus:bg-white rounded py-2 outline-none text-sm text-gray-700 font-medium cursor-pointer appearance-none"
                      value={item.unit}
                      onChange={(e) => handleChange(item.id, 'unit', e.target.value)}
                    >
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Satırı Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Add Button */}
        {state.items.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={handleAddItem}
              className="flex items-center text-blue-700 hover:text-blue-800 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors text-sm font-bold"
            >
              <Plus size={18} className="mr-2" />
              Satır Ekle
            </button>

            <div className="text-xs text-gray-400 font-medium">
              Otomatik kaydedilir
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="mt-8 flex items-center justify-end gap-4">
        {state.items.length > 0 && (
          <button
            onClick={handleClearClick}
            className="text-gray-500 hover:text-red-600 text-sm font-medium px-4 py-2 hover:bg-red-50 rounded transition-colors flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Tümünü Temizle
          </button>
        )}

        <button
          onClick={triggerSuccess}
          className="bg-gov-900 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-gov-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center font-bold text-sm tracking-wide"
        >
          <Save size={18} className="mr-2" />
          LİSTEYİ KAYDET
        </button>
      </div>
    </div>
  );
};

export default NeedsList;
