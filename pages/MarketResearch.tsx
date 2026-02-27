import React, { useEffect, useState } from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { Save, Search, Building2, Calculator, Info, CheckCircle } from 'lucide-react';

const MarketResearch: React.FC = () => {
   const { state, addSupplier, setMarketResearchOffer, setMeta, notify } = useProcurement();

   // Ensure 3 supplier slots exist for the fixed grid layout
   useEffect(() => {
      if (state.suppliers.length < 3) {
         const currentLen = state.suppliers.length;
         for (let i = 0; i < 3 - currentLen; i++) {
            addSupplier({
               id: crypto.randomUUID(),
               name: '',
               address: '',
               taxInfo: ''
            });
         }
      }
   }, []);

   const updateSupplierName = (index: number, name: string) => {
      const newSuppliers = [...state.suppliers];
      if (newSuppliers[index]) {
         newSuppliers[index] = { ...newSuppliers[index], name };
         setMeta('suppliers', newSuppliers);
      }
   };

   const getPrice = (supplierId: string | undefined, itemId: string) => {
      if (!supplierId) return '';
      // Use marketResearchOffers instead of offers
      const offer = (state.marketResearchOffers || []).find(o => o.supplierId === supplierId && o.itemId === itemId);
      return offer ? offer.price : '';
   };

   const handlePriceChange = (supplierId: string | undefined, itemId: string, val: string) => {
      if (!supplierId) return;
      setMarketResearchOffer({
         supplierId,
         itemId,
         price: Number(val)
      });
   };

   const calculateSupplierTotal = (supplierId: string) => {
      return state.items.reduce((acc, item) => {
         const price = Number(getPrice(supplierId, item.id));
         return acc + (price * item.quantity);
      }, 0);
   };

   const formatCurrency = (val: number) => {
      if (!val && val !== 0) return '';
      return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
   };

   const handleSave = () => {
      notify('Piyasa fiyat araştırması verileri başarıyla kaydedildi.', 'success');
   };

   // Fixed 3 columns for A, B, C firms
   const indices = [0, 1, 2];

   return (
      <div className="max-w-[1600px] mx-auto pb-20 space-y-6 relative">


         {/* Page Header */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
               <h1 className="text-xl font-bold text-gray-800 flex items-center">
                  <Search className="mr-3 text-blue-600" size={24} />
                  Piyasa Fiyat Araştırması Girişi
               </h1>
               <p className="text-gray-500 text-sm mt-1">
                  Bu sayfada girilen fiyatlar <b>Yaklaşık Maliyet Cetveli</b> hesaplamasında kullanılır. Firmaları tanımlayınız ve fiyatları giriniz.
               </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100 text-sm font-medium">
               <Info size={16} />
               <span>Toplam {state.items.length} Kalem Ürün</span>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Suppliers Header Section */}
            <div className="bg-gray-50 border-b border-gray-200 p-6">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <Building2 size={14} className="mr-1" /> Firma Tanımları
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-3 lg:col-span-4 text-sm text-gray-500 italic hidden md:block pb-3">
                     Lütfen teklif alınan 3 firmanın ticari ünvanlarını kutucuklara giriniz.
                  </div>
                  {indices.map(i => (
                     <div key={i} className="md:col-span-3 lg:col-span-2 relative group">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 group-focus-within:text-blue-500 transition-colors">
                           {i + 1}. Firma Adı
                        </label>
                        <div className="relative">
                           <Building2 className="absolute left-3 top-2.5 text-gray-300 group-focus-within:text-blue-400 transition-colors" size={16} />
                           <input
                              type="text"
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold text-gray-800 placeholder-gray-300 text-sm"
                              placeholder={`${String.fromCharCode(65 + i)} Firması`}
                              value={state.suppliers[i]?.name || ''}
                              onChange={(e) => updateSupplierName(i, e.target.value)}
                           />
                        </div>
                     </div>
                  ))}
                  {/* Spacer for Total Column alignment */}
                  <div className="hidden lg:block lg:col-span-2"></div>
               </div>
            </div>

            {/* Data Grid */}
            <div className="overflow-x-auto">
               <table className="w-full border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-200">
                        <th className="py-3 px-4 font-bold w-12 text-center text-gray-400">#</th>
                        <th className="py-3 px-4 font-bold text-left w-64">Mal/Malzeme Adı</th>
                        <th className="py-3 px-2 font-bold w-20 text-center">Miktar</th>
                        <th className="py-3 px-2 font-bold w-20 text-center">Birim</th>
                        {indices.map(i => (
                           <React.Fragment key={i}>
                              <th className="py-3 px-2 font-bold w-32 text-center bg-blue-50/30 border-l border-blue-100 text-blue-800">
                                 {state.suppliers[i]?.name ? (
                                    <span className="truncate block max-w-[120px] mx-auto" title={state.suppliers[i].name}>
                                       {state.suppliers[i].name.split(' ')[0]}... Fiyatı
                                    </span>
                                 ) : (
                                    `${i + 1}. Firma Fiyat`
                                 )}
                              </th>
                              <th className="py-3 px-2 font-bold w-28 text-center bg-blue-50/30 text-blue-800/60">Ara Toplam</th>
                           </React.Fragment>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                     {state.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                           <td className="py-2 px-4 text-center font-medium text-gray-400 group-hover:text-gray-600">
                              {idx + 1}
                           </td>
                           <td className="py-2 px-4 font-medium text-gray-800">
                              {item.name}
                              <div className="text-[10px] text-gray-400 font-normal truncate max-w-[200px]">{item.description}</div>
                           </td>
                           <td className="py-2 px-2 text-center">
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono text-xs font-bold">
                                 {item.quantity}
                              </span>
                           </td>
                           <td className="py-2 px-2 text-center text-gray-500 text-xs">
                              {item.unit}
                           </td>

                           {indices.map(i => {
                              const supplier = state.suppliers[i];
                              const price = getPrice(supplier?.id, item.id);
                              const total = Number(price) * item.quantity;
                              return (
                                 <React.Fragment key={i}>
                                    <td className="py-1 px-1 border-l border-blue-50 bg-blue-50/10 p-0">
                                       <input
                                          type="number"
                                          min="0"
                                          className="w-full h-9 px-2 text-center bg-transparent border border-transparent hover:border-gray-300 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded outline-none transition-all font-medium text-gray-900 placeholder-gray-300"
                                          placeholder="0.00"
                                          value={price}
                                          onChange={(e) => handlePriceChange(supplier?.id, item.id, e.target.value)}
                                          onKeyDown={(e) => {
                                             if (e.key === 'Enter') {
                                                const cells = e.currentTarget.closest('tr')?.querySelectorAll('td');
                                                const inputs = Array.from(e.currentTarget.closest('tr')?.querySelectorAll('input') || []) as HTMLInputElement[];
                                                const currentIndex = inputs.indexOf(e.currentTarget);
                                                if (currentIndex < inputs.length - 1) {
                                                   inputs[currentIndex + 1].focus();
                                                } else {
                                                   // Try next row's first input
                                                   const nextRow = e.currentTarget.closest('tr')?.nextElementSibling;
                                                   const nextInput = nextRow?.querySelector('input') as HTMLInputElement;
                                                   nextInput?.focus();
                                                }
                                             }
                                          }}
                                       />
                                    </td>
                                    <td className="py-2 px-2 text-right bg-blue-50/10 pr-4 font-mono text-gray-500 text-xs">
                                       {total > 0 ? formatCurrency(total) : '-'}
                                    </td>
                                 </React.Fragment>
                              );
                           })}
                        </tr>
                     ))}

                     {/* Empty state or filler rows could go here if desired, kept clean for now */}
                     {state.items.length === 0 && (
                        <tr>
                           <td colSpan={4 + (indices.length * 2)} className="py-12 text-center text-gray-400">
                              <Calculator className="mx-auto mb-2 opacity-50" size={32} />
                              Listede ürün bulunmuyor. Lütfen önce İhtiyaç Listesi oluşturun.
                           </td>
                        </tr>
                     )}
                  </tbody>

                  {/* Footer / Totals */}
                  <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                     <tr>
                        <td colSpan={4} className="py-4 px-6 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                           Genel Toplamlar (TL)
                        </td>
                        {indices.map(i => {
                           const total = state.suppliers[i] ? calculateSupplierTotal(state.suppliers[i].id) : 0;
                           const isLowest = indices.every(otherI => {
                              if (otherI === i) return true;
                              const otherTotal = state.suppliers[otherI] ? calculateSupplierTotal(state.suppliers[otherI].id) : 0;
                              return total <= (otherTotal || Infinity) && total > 0;
                           });

                           return (
                              <td key={i} colSpan={2} className={`py-4 px-2 text-center border-l border-gray-200 ${isLowest && total > 0 ? 'bg-green-50' : ''}`}>
                                 <div className={`text-lg font-bold font-mono ${isLowest && total > 0 ? 'text-green-700' : 'text-gray-800'}`}>
                                    {total > 0 ? formatCurrency(total) : '0,00'} ₺
                                 </div>
                                 {isLowest && total > 0 && (
                                    <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1">En Düşük Teklif</div>
                                 )}
                              </td>
                           );
                        })}
                     </tr>
                  </tfoot>
               </table>
            </div>
         </div>

         {/* Action Bar */}
         <div className="flex justify-end pt-4">
            <button
               onClick={handleSave}
               className="bg-gov-900 hover:bg-gov-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center font-bold text-sm tracking-wide"
            >
               <Save size={18} className="mr-2" />
               KAYDET VE DEVAM ET
            </button>
         </div>

      </div>
   );
};

export default MarketResearch;