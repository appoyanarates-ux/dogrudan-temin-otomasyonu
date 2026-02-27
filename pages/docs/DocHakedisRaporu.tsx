import React, { useState, useEffect } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Settings2, X } from 'lucide-react';

export const DocHakedisRaporu: React.FC = () => {
  const { state, calculateLowestOfferTotal, getWinnerSupplier, updateOfficial, setMeta } = useProcurement();

  const winner = getWinnerSupplier();
  const baseAmount = calculateLowestOfferTotal();

  // Local state for editable calculations
  const [priceDiff, setPriceDiff] = useState(0); // Fiyat Farkı
  const [prevPayment, setPrevPayment] = useState(0); // Önceki Hakediş
  const [kdvRate, setKdvRate] = useState(20); // %20 Default
  const [stampTaxRate, setStampTaxRate] = useState(0.00948); // Damga Vergisi Oranı (Binde 9.48)
  
  // Deductions
  const [deductionStamp, setDeductionStamp] = useState<number | null>(null); // Override
  const [deductionKdvTevkifat, setDeductionKdvTevkifat] = useState(0); // Override if needed, but usually 0 for basics
  const [tevkifatRateNumerator, setTevkifatRateNumerator] = useState(0); // e.g. 7 for 7/10. 0 means none.
  const [deductionTaxDebt, setDeductionTaxDebt] = useState(0);
  const [deductionOther, setDeductionOther] = useState(0);

  const [hakedisNo, setHakedisNo] = useState('1');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculations
  const totalWithDiff = baseAmount + priceDiff; // C
  const thisPaymentBase = totalWithDiff - prevPayment; // E
  const kdvAmount = thisPaymentBase * (kdvRate / 100); // F
  const accrualAmount = thisPaymentBase + kdvAmount; // G (Tahakkuk)

  // Auto Calculate Stamp Tax if not overridden
  const finalStampTax = deductionStamp !== null ? deductionStamp : (baseAmount * stampTaxRate);
  
  // Auto Calculate Tevkifat if rate is set
  const tevkifatAmount = tevkifatRateNumerator > 0 ? (kdvAmount * (tevkifatRateNumerator / 10)) : deductionKdvTevkifat;

  const totalDeductions = finalStampTax + tevkifatAmount + deductionTaxDebt + deductionOther; // H
  const payableAmount = accrualAmount - totalDeductions;

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' TL';

  // --- SAYIYI YAZIYA ÇEVİRME ALGORİTMASI ---
  const numberToTurkishWords = (amount: number): string => {
    if (amount === 0) return "SIFIR";

    const ones = ['', 'BİR', 'İKİ', 'ÜÇ', 'DÖRT', 'BEŞ', 'ALTI', 'YEDİ', 'SEKİZ', 'DOKUZ'];
    const tens = ['', 'ON', 'YİRMİ', 'OTUZ', 'KIRK', 'ELLİ', 'ALTMIŞ', 'YETMİŞ', 'SEKSEN', 'DOKSAN'];
    const groups = ['', 'BİN', 'MİLYON', 'MİLYAR', 'TRİLYON'];

    // 3 basamaklı sayıyı okur (örn: 123 -> YÜZYİRMİÜÇ)
    const readThreeDigits = (n: number) => {
      let str = "";
      const h = Math.floor(n / 100);
      const t = Math.floor((n % 100) / 10);
      const o = n % 10;

      if (h === 1) str += "YÜZ";
      else if (h > 1) str += ones[h] + "YÜZ";

      str += tens[t] + ones[o];
      return str;
    };

    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);

    // Tam Kısım Çevirisi
    let liraString = "";
    let tempInt = integerPart;
    let groupIndex = 0;

    if (tempInt === 0) liraString = "SIFIR";
    else {
      while (tempInt > 0) {
        const chunk = tempInt % 1000;
        if (chunk > 0) {
          let chunkStr = readThreeDigits(chunk);
          
          // "BİR BİN" istisnası: Binler basamağı sadece 1 ise "BİR" denmez, sadece "BİN" denir.
          if (groupIndex === 1 && chunk === 1) {
             chunkStr = "";
          }
          
          liraString = chunkStr + groups[groupIndex] + liraString;
        }
        tempInt = Math.floor(tempInt / 1000);
        groupIndex++;
      }
    }

    // Kuruş Kısım Çevirisi
    let kurusString = "";
    if (decimalPart > 0) {
      kurusString = readThreeDigits(decimalPart);
    }

    let result = `YALNIZ ${liraString} TÜRK LİRASI`;
    if (kurusString) {
       result += ` ${kurusString} KURUŞ`;
    }
    result += " ÖDENİR.";

    return result;
  };
  
  const [amountInWords, setAmountInWords] = useState('');

  // Tutar değiştiğinde yazıyı güncelle
  useEffect(() => {
     setAmountInWords(numberToTurkishWords(payableAmount));
  }, [payableAmount]);

  // Styles
  const inputClass = "bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-full text-right font-inherit p-0 m-0 print:border-none transition-colors px-1";
  const centerInput = "bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-full text-center font-inherit p-0 m-0 print:border-none transition-colors px-1";

  // Helper Component for Screen-Only Rate Controls
  const RateControl = ({ label, value, onChange, suffix = '', step = 1, width = 'w-10' }: any) => (
    <div className="no-print inline-flex items-center bg-blue-50 border border-blue-200 rounded px-2 py-0.5 ml-2 transition-all hover:bg-blue-100 group cursor-pointer">
      <Settings2 size={12} className="text-blue-400 mr-1 group-hover:text-blue-600" />
      <span className="text-[9pt] text-blue-700 font-semibold mr-1">{label}:</span>
      <input 
        type="number" 
        step={step}
        className={`bg-white border border-blue-200 rounded text-center text-blue-900 font-bold outline-none focus:ring-1 focus:ring-blue-400 h-5 text-[9pt] ${width}`} 
        value={value} 
        onChange={onChange} 
      />
      {suffix && <span className="text-[9pt] text-blue-700 ml-0.5 font-medium">{suffix}</span>}
    </div>
  );

  return (
    <div className="font-serif text-[10pt] leading-tight text-black h-auto flex flex-col w-full">
      
      {/* Title */}
      <div className="border border-black font-bold text-center py-2 text-lg bg-gray-100 print:bg-transparent">
         HAK EDİŞ RAPORU
      </div>

      {/* Header Info */}
      <div className="flex border border-black border-t-0">
         <div className="flex-1 p-2 font-bold uppercase border-r border-black flex items-center">
            <input 
               className="bg-transparent outline-none w-full font-bold uppercase hover:bg-gray-50 transition-colors" 
               value={state.jobDescription || 'İşin Adı'} 
               placeholder="İŞİN ADINI GİRİNİZ"
               onChange={e => setMeta('jobDescription', e.target.value)} 
            />
         </div>
         <div className="w-48 p-2 text-right flex items-center justify-end">
            <span className="whitespace-nowrap mr-2">Hak Ediş No:</span>
            <input className="w-12 text-center outline-none border-b border-gray-300 print:border-none font-bold" value={hakedisNo} onChange={e => setHakedisNo(e.target.value)} />
         </div>
      </div>

      {/* Empty Spacer Row */}
      <div className="border border-black border-t-0 h-4 bg-gray-50 print:hidden"></div>
      <div className="border border-black border-t-0 h-4 hidden print:block"></div>

      {/* Calculation Table */}
      <table className="w-full border-collapse border border-black text-[10pt]">
         <tbody>
            {/* A */}
            <tr>
               <td className="border border-black w-10 text-center py-1 font-bold bg-gray-50 print:bg-transparent">A</td>
               <td className="border border-black px-2 py-1">Bina Yapım Onarım Fiyatları ile Yapılan İş / Sözleşme Bedeli</td>
               <td className="border border-black px-2 py-1 text-right w-40 font-bold">{formatCurrency(baseAmount)}</td>
            </tr>
            {/* B */}
            <tr>
               <td className="border border-black w-10 text-center py-1 font-bold bg-gray-50 print:bg-transparent">B</td>
               <td className="border border-black px-2 py-1">Fiyat Farkı Tutarı</td>
               <td className="border border-black px-2 py-1 text-right">
                  <input type="number" className={inputClass} value={priceDiff} onChange={e => setPriceDiff(Number(e.target.value))} />
               </td>
            </tr>
            {/* C */}
            <tr>
               <td className="border border-black w-10 text-center py-1 font-bold bg-gray-50 print:bg-transparent">C</td>
               <td className="border border-black px-2 py-1">Toplam Tutar ( A + B )</td>
               <td className="border border-black px-2 py-1 text-right font-bold bg-gray-50 print:bg-transparent">{formatCurrency(totalWithDiff)}</td>
            </tr>
            {/* D */}
            <tr>
               <td className="border border-black w-10 text-center py-1 font-bold bg-gray-50 print:bg-transparent">D</td>
               <td className="border border-black px-2 py-1">Bir Önceki Hakedişin Toplam Tutarı</td>
               <td className="border border-black px-2 py-1 text-right">
                   <input type="number" className={inputClass} value={prevPayment} onChange={e => setPrevPayment(Number(e.target.value))} />
               </td>
            </tr>
            {/* E */}
            <tr>
               <td className="border border-black w-10 text-center py-1 font-bold bg-gray-50 print:bg-transparent">E</td>
               <td className="border border-black px-2 py-1">Bu Hakedişin Tutarı ( C - D )</td>
               <td className="border border-black px-2 py-1 text-right font-bold bg-gray-50 print:bg-transparent">{formatCurrency(thisPaymentBase)}</td>
            </tr>
            {/* F */}
            <tr>
               <td className="border border-black w-10 text-center py-1 font-bold bg-gray-50 print:bg-transparent">F</td>
               <td className="border border-black px-2 py-1 flex justify-between items-center">
                  <div className="flex items-center">
                     <span>KDV</span>
                     {/* Print Version */}
                     <span className="hidden print:inline font-normal ml-1">( %{kdvRate} )</span>
                  </div>
                  {/* Screen Version */}
                  <RateControl 
                    label="KDV Oranı" 
                    value={kdvRate} 
                    onChange={(e: any) => setKdvRate(Number(e.target.value))} 
                    suffix="%" 
                  />
               </td>
               <td className="border border-black px-2 py-1 text-right">{formatCurrency(kdvAmount)}</td>
            </tr>
            {/* G */}
            <tr>
               <td className="border border-black w-10 text-center py-1 font-bold bg-gray-50 print:bg-transparent">G</td>
               <td className="border border-black px-2 py-1 font-bold">Tahakkuk Tutarı</td>
               <td className="border border-black px-2 py-1 text-right font-bold bg-gray-100 print:bg-transparent">{formatCurrency(accrualAmount)}</td>
            </tr>
            
            {/* Deductions Header */}
            <tr>
               <td className="border border-black w-10 text-center py-1 bg-gray-200 print:bg-transparent"></td>
               <td colSpan={2} className="border border-black px-2 py-1.5 font-bold bg-gray-100 print:bg-transparent text-center tracking-wide text-xs uppercase">
                  Kesintiler ve Mahsuplar
               </td>
            </tr>

            {/* a) Damga Vergisi */}
            <tr>
               <td className="border border-black w-10 text-center py-1 bg-gray-50 print:bg-transparent"></td>
               <td className="border border-black px-8 py-1 flex justify-between items-center">
                  <div className="flex items-center">
                     <span>a) Damga Vergisi (Sözleşme Bedeli Üzerinden)</span>
                  </div>
                  
                  {/* Screen Version */}
                  <RateControl 
                    label="Damga Oranı" 
                    value={stampTaxRate} 
                    onChange={(e: any) => {setStampTaxRate(Number(e.target.value)); setDeductionStamp(null);}} 
                    step={0.00001}
                    width="w-20"
                  />
               </td>
               <td className="border border-black px-2 py-1 text-right">
                  <input type="number" className={inputClass} value={finalStampTax.toFixed(2)} onChange={e => setDeductionStamp(Number(e.target.value))} />
               </td>
            </tr>
            {/* b) KDV Tevkifatı */}
            <tr>
               <td className="border border-black w-10 text-center py-1 bg-gray-50 print:bg-transparent"></td>
               <td className="border border-black px-8 py-1 flex justify-between items-center">
                  <div className="flex items-center">
                     <span>b) KDV Tevkifatı</span>
                     {tevkifatRateNumerator > 0 && <span className="hidden print:inline font-normal ml-2">({tevkifatRateNumerator}/10)</span>}
                  </div>

                  {/* Screen Version */}
                  <RateControl 
                    label="Tevkifat (x/10)" 
                    value={tevkifatRateNumerator} 
                    onChange={(e: any) => setTevkifatRateNumerator(Number(e.target.value))} 
                    width="w-12"
                  />
               </td>
               <td className="border border-black px-2 py-1 text-right">
                  <input type="number" className={inputClass} value={tevkifatAmount.toFixed(2)} onChange={e => setDeductionKdvTevkifat(Number(e.target.value))} />
               </td>
            </tr>
            {/* c) Vergi Borcu */}
            <tr>
               <td className="border border-black w-10 text-center py-1 bg-gray-50 print:bg-transparent"></td>
               <td className="border border-black px-8 py-1">c) Vergi Borcu Kesintisi</td>
               <td className="border border-black px-2 py-1 text-right">
                   <input type="number" className={inputClass} value={deductionTaxDebt} onChange={e => setDeductionTaxDebt(Number(e.target.value))} />
               </td>
            </tr>
             {/* d) Diğer */}
            <tr>
               <td className="border border-black w-10 text-center py-1 bg-gray-50 print:bg-transparent"></td>
               <td className="border border-black px-8 py-1">d) Diğer Kesintiler (Gecikme, Avans vb.)</td>
               <td className="border border-black px-2 py-1 text-right">
                   <input type="number" className={inputClass} value={deductionOther} onChange={e => setDeductionOther(Number(e.target.value))} />
               </td>
            </tr>
            
            {/* H - Total Deductions */}
            <tr>
               <td className="border border-black w-10 text-center py-1 font-bold bg-gray-50 print:bg-transparent">H</td>
               <td className="border border-black px-2 py-1 font-semibold">Kesintiler ve Mahsuplar Toplamı</td>
               <td className="border border-black px-2 py-1 text-right font-bold">{formatCurrency(totalDeductions)}</td>
            </tr>

            {/* NET PAYABLE */}
            <tr className="bg-gray-100 print:bg-transparent">
               <td className="border border-black w-10 text-center py-1"></td>
               <td className="border border-black px-2 py-2 font-bold text-lg">Yükleniciye Ödenecek Tutar</td>
               <td className="border border-black px-2 py-2 text-right font-bold text-lg">{formatCurrency(payableAmount)}</td>
            </tr>
            <tr>
               <td className="border border-black w-10 text-center py-1"></td>
               <td colSpan={2} className="border border-black px-2 py-2 text-center font-bold text-[9pt]">
                  <input 
                     className={centerInput + " font-bold"}
                     value={amountInWords}
                     onChange={(e) => setAmountInWords(e.target.value)}
                  />
               </td>
            </tr>
         </tbody>
      </table>

      {/* Signatures */}
      <div className="flex border border-black border-t-0 min-h-[200px] avoid-break">
         {/* Contractor */}
         <div className="w-1/3 border-r border-black p-4 text-center flex flex-col justify-between">
            <div>
               <p className="font-bold mb-4 underline">YÜKLENİCİ</p>
            </div>
            <div className="pb-4">
               <p className="font-bold uppercase mb-1">{winner ? winner.name : '.......................'}</p>
               <p className="text-[9pt] text-gray-600">Firma Yetkilisi</p>
            </div>
         </div>

         {/* Approver */}
         <div className="w-2/3 p-4 text-center flex flex-col justify-end items-end pr-16 relative">
             <div className="text-center">
                 <p className="font-bold mb-1 underline">ONAYLAYAN</p>
                 <div className="flex items-center justify-center gap-1 mb-4 text-[9pt] group">
                    <span className="font-bold">TARİH:</span>
                    {/* Print View */}
                    <span className="hidden print:inline">
                      {reportDate ? reportDate.split('-').reverse().join('.') : '.../.../20...'}
                    </span>
                    {/* Screen View */}
                    <input 
                       type="date"
                       className="bg-transparent text-center font-inherit border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-32 h-5 cursor-pointer print:hidden"
                       value={reportDate}
                       onChange={(e) => setReportDate(e.target.value)}
                    />
                    {reportDate && (
                     <button 
                        onClick={() => setReportDate('')}
                        className="text-gray-400 hover:text-red-500 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Tarihi Temizle"
                     >
                        <X size={14} />
                     </button>
                  )}
                 </div>
                 <input className={centerInput + " font-bold mb-1 text-[10pt]"} value={state.spendingOfficial.name} onChange={e => updateOfficial('spending', {name: e.target.value})} />
                 <p className="text-[9pt]">{state.spendingOfficial.title}</p>
                 <p className="text-[8pt] text-gray-500">Harcama Yetkilisi</p>
             </div>
         </div>
      </div>

    </div>
  );
};