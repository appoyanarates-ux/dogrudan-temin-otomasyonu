import React, { useState, useEffect } from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { Trophy, MapPin, Save, Calculator, Copy, ArrowDownCircle, Info, CheckCircle2, CheckCircle, X, AlertTriangle } from 'lucide-react';

const Offers: React.FC = () => {
   const { state, getWinnerSupplier, calculateLowestOfferTotal, setMeta, setOffer, notify } = useProcurement();
   const [winnerAddress, setWinnerAddress] = useState('');
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [transferCount, setTransferCount] = useState(0);

   const winner = getWinnerSupplier();

   // Sync address locally when winner changes
   useEffect(() => {
      if (winner) {
         setWinnerAddress(winner.address || '');
      }
   }, [winner?.id]);

   const updateWinnerAddress = (addr: string) => {
      setWinnerAddress(addr);
      if (winner) {
         const newSuppliers = state.suppliers.map(s =>
            s.id === winner.id ? { ...s, address: addr } : s
         );
         setMeta('suppliers', newSuppliers);
      }
   };

   const calculateSupplierTotal = (supplierId: string) => {
      return state.items.reduce((acc, item) => {
         // Use final offers
         const offer = state.offers.find(o => o.supplierId === supplierId && o.itemId === item.id);
         return acc + (offer ? offer.price * item.quantity : 0);
      }, 0);
   };

   const formatCurrency = (val: number) => {
      if (!val && val !== 0) return '0,00';
      return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
   };

   // 1. Transferi Başlat (Butona tıklanınca)
   const initiateTransfer = () => {
      const researchData = state.marketResearchOffers || [];
      // Fiyatı geçerli olanları say
      const validItems = researchData.filter(item => item.price && item.price > 0);

      if (validItems.length === 0) {
         notify('Piyasa araştırması sayfasında henüz kayıtlı bir fiyat bulunamadı.\n\nLütfen önce "5. Piyasa Fiyat Araştırması" sayfasına giderek firma fiyatlarını giriniz.', 'error');
         return;
      }

      setTransferCount(validItems.length);
      setShowConfirmModal(true);
   };

   // 2. Transferi Onayla ve Gerçekleştir
   const executeTransfer = () => {
      const researchData = state.marketResearchOffers || [];
      const validItems = researchData.filter(item => item.price && item.price > 0);

      // Deep Copy (Derin Kopyalama)
      const newOffers = validItems.map(offer => ({
         supplierId: offer.supplierId,
         itemId: offer.itemId,
         price: Number(offer.price)
      }));

      // State Güncelleme (Bu işlem otomatik olarak kazananı hesaplatır)
      setMeta('offers', newOffers);

      // Modalı kapat ve başarı mesajı göster
      setShowConfirmModal(false);
      notify(`${newOffers.length} adet fiyat piyasa araştırmasından aktarıldı ve kazanan firma güncellendi.`, 'success');
   };

   const getPrice = (supplierId: string | undefined, itemId: string) => {
      if (!supplierId) return '';
      const offer = state.offers.find(o => o.supplierId === supplierId && o.itemId === itemId);
      // Eğer fiyat 0 ise string olarak '0' dönmeli ki input value boş kalmasın
      return offer ? offer.price : '';
   };

   const handlePriceChange = (supplierId: string | undefined, itemId: string, val: string) => {
      if (!supplierId) return;
      setOffer({
         supplierId,
         itemId,
         price: Number(val)
      });
   };

   // Indices for display
   const indices = [0, 1, 2];

   return (
      <div className="max-w-[1600px] mx-auto space-y-8 pb-20 relative">

         {/* Confirmation Modal */}
         {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 relative">
                  <button
                     onClick={() => setShowConfirmModal(false)}
                     className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                     <X size={20} />
                  </button>

                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                     <Copy className="text-blue-600" size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Fiyatları Aktar</h3>

                  <p className="text-sm text-gray-600 text-center mb-6">
                     Piyasa araştırması sayfasından bulunan <strong>{transferCount} adet</strong> fiyat kaydı, teklifler tablosuna kopyalanacaktır.
                     <br /><br />
                     <span className="text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">Dikkat:</span> Mevcut girilmiş teklifleriniz varsa üzerine yazılacaktır. Onaylıyor musunuz?
                  </p>

                  <div className="flex space-x-3">
                     <button
                        onClick={() => setShowConfirmModal(false)}
                        className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
                     >
                        Vazgeç
                     </button>
                     <button
                        onClick={executeTransfer}
                        className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center"
                     >
                        Evet, Aktar
                     </button>
                  </div>
               </div>
            </div>
         )}


         {/* Page Header */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
               <h1 className="text-xl font-bold text-gray-800 flex items-center">
                  <Calculator className="mr-3 text-blue-600" size={24} />
                  Tekliflerin Girilmesi ve Değerlendirilmesi
               </h1>
               <p className="text-gray-500 text-sm mt-1">
                  İhale/Doğrudan temin sonucunda firmaların verdiği <b>KESİN TEKLİFLERİ</b> buraya giriniz.
               </p>
            </div>
            <div className="flex items-center">
               <button
                  onClick={initiateTransfer}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg flex items-center font-bold text-sm transition-colors shadow-sm"
                  title="Piyasa Araştırması sayfasındaki fiyatları buraya kopyalar"
               >
                  <Copy size={16} className="mr-2" />
                  Piyasa Araştırmasından Aktar
               </button>
            </div>
         </div>

         {/* Manual Entry Grid */}
         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
               <h3 className="font-bold text-gray-700 flex items-center">
                  <ArrowDownCircle size={18} className="mr-2 text-gray-500" />
                  Teklif Fiyatlarını Giriniz
               </h3>
               <div className="text-xs text-gray-500 flex items-center bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                  <Info size={12} className="mr-1 text-yellow-600" />
                  Buradaki fiyatlar Muayene Kabul ve Hakediş evraklarında kullanılır.
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                     <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-200">
                        <th className="py-2 px-4 font-bold w-12 text-center">#</th>
                        <th className="py-2 px-4 font-bold text-left w-64">Malzeme Adı</th>
                        <th className="py-2 px-2 font-bold w-16 text-center">Miktar</th>
                        {indices.map(i => (
                           <th key={i} className="py-2 px-2 font-bold w-32 text-center bg-blue-50/20 border-l border-gray-200">
                              {state.suppliers[i]?.name ? (
                                 <span className="truncate block max-w-[150px] mx-auto text-blue-800" title={state.suppliers[i].name}>
                                    {state.suppliers[i].name}
                                 </span>
                              ) : (
                                 `${i + 1}. Firma`
                              )}
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                     {state.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                           <td className="py-2 px-4 text-center text-gray-400">{idx + 1}</td>
                           <td className="py-2 px-4 font-medium text-gray-800 truncate max-w-[200px]" title={item.name}>{item.name}</td>
                           <td className="py-2 px-2 text-center bg-gray-50">{item.quantity}</td>

                           {indices.map(i => {
                              const supplier = state.suppliers[i];
                              const price = getPrice(supplier?.id, item.id);
                              return (
                                 <td key={i} className="py-1 px-1 border-l border-gray-200 p-0">
                                    <input
                                       type="number"
                                       min="0"
                                       className="w-full h-8 px-2 text-center bg-transparent border border-transparent hover:border-gray-300 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded outline-none transition-all font-medium text-gray-900 placeholder-gray-300"
                                       placeholder="0.00"
                                       value={price}
                                       onChange={(e) => handlePriceChange(supplier?.id, item.id, e.target.value)}
                                       onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                             const inputs = Array.from(e.currentTarget.closest('tr')?.querySelectorAll('input') || []) as HTMLInputElement[];
                                             const currentIndex = inputs.indexOf(e.currentTarget);
                                             if (currentIndex < inputs.length - 1) {
                                                inputs[currentIndex + 1].focus();
                                             } else {
                                                const nextRow = e.currentTarget.closest('tr')?.nextElementSibling;
                                                const nextInput = nextRow?.querySelector('input') as HTMLInputElement;
                                                nextInput?.focus();
                                             }
                                          }
                                       }}
                                    />
                                 </td>
                              );
                           })}
                        </tr>
                     ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                     <tr>
                        <td colSpan={3} className="py-2 px-4 text-right font-bold text-xs text-gray-500">TOPLAM:</td>
                        {indices.map(i => {
                           const total = state.suppliers[i] ? calculateSupplierTotal(state.suppliers[i].id) : 0;
                           return (
                              <td key={i} className="py-2 px-2 text-center font-mono font-bold text-gray-800 border-l border-gray-200">
                                 {total > 0 ? formatCurrency(total) : '-'}
                              </td>
                           );
                        })}
                     </tr>
                  </tfoot>
               </table>
            </div>
         </div>

         {/* Result Section */}
         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-6 pb-2 border-b">
               <Trophy className="text-yellow-500 mr-2" size={24} />
               <h2 className="text-lg font-bold text-gray-800">DEĞERLENDİRME SONUCU</h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
               {/* Winner Section */}
               <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200 relative overflow-hidden">
                  {winner ? (
                     <>
                        <div className="relative z-10">
                           <div className="flex items-center mb-4">
                              <div className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm flex items-center">
                                 <CheckCircle2 size={16} className="mr-1" />
                                 En Avantajlı 1. Firma
                              </div>
                           </div>

                           <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 mb-6">
                              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
                                 <div className="text-gray-600 text-lg">En düşük teklifi</div>
                                 <div className="bg-green-100 px-4 py-2 rounded-lg border border-green-200 font-mono font-bold text-3xl text-green-800 shadow-inner">
                                    {formatCurrency(calculateSupplierTotal(winner.id))}
                                 </div>
                                 <div className="text-gray-600 text-lg">TL ile</div>
                                 <div className="font-black text-3xl text-gray-900 uppercase underline decoration-green-500 decoration-4 underline-offset-4">
                                    {winner.name}
                                 </div>
                              </div>
                              <div className="text-center text-gray-500 text-sm mt-2 italic">
                                 firmasının uhdesinde kalmıştır.
                              </div>
                           </div>

                           {/* Address Input */}
                           <div>
                              <label className="flex items-center text-sm font-bold text-green-800 mb-2">
                                 <MapPin size={18} className="mr-1" />
                                 Kazanan Firmanın Adresi:
                              </label>
                              <div className="relative">
                                 <input
                                    type="text"
                                    className="w-full p-4 pl-10 rounded-lg border border-green-300 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none text-gray-800 placeholder-green-800/30 bg-white shadow-sm transition-all"
                                    placeholder="Firma adresini buraya yazınız..."
                                    value={winnerAddress}
                                    onChange={(e) => updateWinnerAddress(e.target.value)}
                                 />
                                 <MapPin className="absolute left-3 top-4 text-green-400" size={20} />
                              </div>
                              <p className="text-xs text-green-600 mt-2 pl-1">
                                 * Bu adres, teklif mektubu ve piyasa araştırma tutanağında kullanılacaktır.
                              </p>
                           </div>
                        </div>

                        {/* Decorative Background Icon */}
                        <Trophy className="absolute -bottom-8 -right-8 text-green-100/80 transform rotate-12" size={200} />
                     </>
                  ) : (
                     <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <Calculator size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">Kazanan belirlenemedi.</p>
                        <p className="text-sm">Lütfen yukarıdaki tablodan fiyat girişlerini tamamlayınız.</p>
                     </div>
                  )}
               </div>
            </div>

            <div className="mt-8 flex justify-end">
               <button
                  onClick={() => notify('Değerlendirme sonucu başarıyla kaydedildi.', 'success')}
                  className="bg-gov-900 hover:bg-gov-800 text-white px-8 py-3 rounded-lg shadow-lg flex items-center font-bold text-sm tracking-wide transition-all transform hover:-translate-y-0.5"
               >
                  <Save size={20} className="mr-2" />
                  SONUCU KAYDET
               </button>
            </div>
         </div>
      </div>
   );
};

export default Offers;