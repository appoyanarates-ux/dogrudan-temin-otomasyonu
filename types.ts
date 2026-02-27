
export interface Official {
  title: string;
  name: string;
  role: string; // e.g., "Okul Müdürü", "Müdür Yardımcısı"
}

export interface Institution {
  name: string;
  city: string;
  district: string;
  taxNumber: string;
  phone: string;
}

export interface CommissionMember {
  id: string;
  name: string;
  title: string;
  role: string; // Görevi (Örn: Komisyon Başkanı, Üye)
}

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string; // Adet, Kg, Litre vs.
  estimatedUnitPrice: number; // Yaklaşık maliyet birim fiyatı
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  taxInfo: string;
}

export interface Offer {
  supplierId: string;
  itemId: string;
  price: number;
}

export interface Workflow {
  needsList: { date: string; number: string; suffix: string };        // 1- İhtiyaç Listesi (-934.01)
  commissionApproval: { date: string; number: string; suffix: string }; // 2- Komisyon Onay (-934.01.99)
  priceResearch: { date: string; number: string; suffix: string };    // 3- Fiyat Araştırması (-934.02.03)
  approxCost: { date: string };                       // 4- Yaklaşık Maliyet (Sayı yok)
  tenderApproval: { date: string; number: string; suffix: string };   // 5- İhale Onay (-934.01.02)
  offerLetter: { date: string };                      // 6- Teklif Mektubu (Sayı yok)
  marketResearch: { date: string };                   // 7- Piyasa Araştırması (Sayı yok)
  invoice: { date: string; number: string };          // Fatura Bilgileri
  inspection: { date: string; decisionNumber: string }; // 8- Muayene Kabul (Karar No)
}

export interface ProcurementState {
  id: string; // Unique Project ID
  status: 'active' | 'completed' | 'archived';
  lastUpdated: string;

  institution: Institution;
  spendingOfficial: Official; // Harcama Yetkilisi
  realizationOfficial: Official; // Gerçekleştirme Görevlisi
  
  // Komisyonlar
  approxCostCommission: CommissionMember[]; // Yaklaşık Maliyet Komisyonu
  marketResearchCommission: CommissionMember[]; // Piyasa Araştırma Komisyonu
  inspectionCommission: CommissionMember[]; // Muayene Kabul Komisyonu

  items: Item[];
  suppliers: Supplier[];
  
  offers: Offer[]; // Kesin Teklifler (İhale Sonucu)
  marketResearchOffers: Offer[]; // Piyasa Araştırması Fiyatları (Yaklaşık Maliyet için)

  procurementType: 'Mal' | 'Hizmet';
  directProcurementArticle: '22/d' | '22/a'; // Madde türü
  date: string; // Genel İşlem tarihi (Fallback)
  tenderNumber: string; // İhale/Dosya No
  
  // Bütçe ve Ödenek
  allowance: number; // Kullanılabilir Ödenek
  budgetCode: string; // Bütçe Tertibi

  // İşlem Akışı Verileri
  correspondenceCode: string; // Resmi Yazışma Kodu
  workflow: Workflow;

  // AI & Config
  apiKey: string;
  technicalSpecificationContent: string;
  
  // New Fields
  jobDescription: string; // Yapılan İş/Mal/Hizmetin Adı
}

export type DocumentType = 
  | 'ihtiyac_listesi'     // 1
  | 'komisyon_onay'       // 2
  | 'fiyat_arastirma'     // 3 (New)
  | 'yaklasik_maliyet'    // 4
  | 'onay_belgesi'        // 5
  | 'teklif_mektubu'      // 6
  | 'piyasa_arastirma'    // 7
  | 'muayene_kabul'       // 8
  | 'teknik_sartname'     // 9
  | 'hizmet_kabul'        // 10 (New)
  | 'hakedis_raporu'      // 11 (New)
  | 'teslim_tutanagi';
