import React, { useState, useEffect } from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { CommissionMember } from '../types';
import { Users } from 'lucide-react';

// Props arayüzü tanımlandı
interface CommissionSectionProps {
  title: string;
  type: 'approx' | 'market' | 'inspection';
  members: CommissionMember[];
  borderColor: string;
  titleColor: string;
  syncActive: boolean;
  onMemberChange: (type: 'approx' | 'market' | 'inspection', index: number, field: keyof CommissionMember, value: string) => void;
}

// Alt bileşen dışarı taşındı (Bug Fix: Input focus kaybını engeller)
const CommissionSection: React.FC<CommissionSectionProps> = ({
  title,
  type,
  members,
  borderColor,
  titleColor,
  syncActive,
  onMemberChange
}) => {
  // Eğer senkronizasyon açıksa ve bu 'market' (satın alma) komisyonuysa inputları kilitle
  const disabled = type === 'market' && syncActive;

  return (
    <div className={`border-2 ${borderColor} rounded-lg p-4 bg-white shadow-sm`}>
      <h3 className={`font-bold text-lg mb-4 ${titleColor} flex items-center`}>
        <Users className="mr-2" size={20} />
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((member, idx) => (
          <div key={member.id} className="space-y-3">
            <div className="font-semibold text-center text-gray-500 border-b pb-1">
              Üye-{idx + 1}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Görevi</label>
              <input
                type="text"
                value={member.role}
                disabled={disabled}
                onChange={(e) => onMemberChange(type, idx, 'role', e.target.value)}
                className={`w-full border p-2 rounded text-sm ${disabled ? 'bg-gray-100 text-gray-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-200'}`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Adı Soyadı</label>
              <input
                type="text"
                value={member.name}
                disabled={disabled}
                onChange={(e) => onMemberChange(type, idx, 'name', e.target.value)}
                className={`w-full border p-2 rounded text-sm font-semibold ${disabled ? 'bg-gray-100 text-gray-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-200'}`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Ünvanı</label>
              <input
                type="text"
                value={member.title}
                disabled={disabled}
                onChange={(e) => onMemberChange(type, idx, 'title', e.target.value)}
                className={`w-full border p-2 rounded text-sm ${disabled ? 'bg-gray-100 text-gray-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-200'}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommissionAssignment: React.FC = () => {
  const { state, updateCommission, notify } = useProcurement();
  const [syncApproxToMarket, setSyncApproxToMarket] = useState(false);

  const triggerSuccess = () => {
    notify('Komisyon bilgileri başarıyla kaydedildi.', 'success');
  };

  // Sync logic when checkbox is active
  useEffect(() => {
    if (syncApproxToMarket) {
      updateCommission('market', state.approxCostCommission);
    }
  }, [state.approxCostCommission, syncApproxToMarket]);

  const handleMemberChange = (
    type: 'approx' | 'market' | 'inspection',
    index: number,
    field: keyof CommissionMember,
    value: string
  ) => {
    let list = [];
    if (type === 'approx') list = [...state.approxCostCommission];
    else if (type === 'market') list = [...state.marketResearchCommission];
    else list = [...state.inspectionCommission];

    list[index] = { ...list[index], [field]: value };
    updateCommission(type, list);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">

      {/* Checkbox Header */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-sm flex items-center justify-center">
        <label className="flex items-center space-x-3 cursor-pointer select-none">
          <span className="font-bold text-gray-800 text-lg">
            Yaklaşık Maliyet Komisyonu ile Satın Alma Komisyonu Aynı Kişiler Yap
          </span>
          <input
            type="checkbox"
            checked={syncApproxToMarket}
            onChange={(e) => setSyncApproxToMarket(e.target.checked)}
            className="w-6 h-6 text-gov-600 rounded focus:ring-gov-500 border-gray-300"
          />
        </label>
      </div>

      {/* Sections */}
      <CommissionSection
        title="Yaklaşık Maliyet Komisyonu"
        type="approx"
        members={state.approxCostCommission}
        borderColor="border-red-500"
        titleColor="text-red-600"
        syncActive={syncApproxToMarket}
        onMemberChange={handleMemberChange}
      />

      <CommissionSection
        title="Piyasa Araştırma-Satın Alma Komisyonu"
        type="market"
        members={state.marketResearchCommission}
        borderColor="border-blue-500"
        titleColor="text-blue-600"
        syncActive={syncApproxToMarket}
        onMemberChange={handleMemberChange}
      />

      <CommissionSection
        title="Muayene Kabul Komisyonu"
        type="inspection"
        members={state.inspectionCommission}
        borderColor="border-green-500"
        titleColor="text-green-600"
        syncActive={syncApproxToMarket}
        onMemberChange={handleMemberChange}
      />

      <div className="flex justify-end">
        <button className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-900 font-bold flex items-center" onClick={() => triggerSuccess()}>
          <Users className="mr-2" />
          Değişiklikleri Onayla
        </button>
      </div>
    </div>
  );
};

export default CommissionAssignment;