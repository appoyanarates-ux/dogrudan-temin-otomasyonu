import { ProcurementState, CommissionMember, Item } from './types';

const createEmptyCommission = (): CommissionMember[] => [
  { id: '1', name: '', title: '', role: 'Başkan' },
  { id: '2', name: '', title: '', role: 'Üye' },
  { id: '3', name: '', title: '', role: 'Üye' },
];

const today = new Date().toISOString().split('T')[0];

const exampleItems: Item[] = [
  { id: '1', name: 'Sıvı Sabun', description: '', quantity: 100, unit: 'Litre', estimatedUnitPrice: 0 },
  { id: '2', name: 'Tuvalet Kağıdı', description: '', quantity: 100, unit: 'Adet', estimatedUnitPrice: 0 },
  { id: '3', name: 'Yüzey Temizleyici', description: '', quantity: 10, unit: 'Litre', estimatedUnitPrice: 0 },
  { id: '4', name: 'Çamaşır Suyu', description: '', quantity: 10, unit: 'Litre', estimatedUnitPrice: 0 },
];

export const INITIAL_STATE: ProcurementState = {
  id: '', // Will be generated on creation
  status: 'active',
  lastUpdated: new Date().toISOString(),
  
  institution: {
    name: 'Cumhuriyet Anadolu Lisesi',
    city: 'Ankara',
    district: 'Çankaya',
    taxNumber: '',
    phone: ''
  },
  spendingOfficial: {
    name: '',
    title: 'Okul Müdürü',
    role: 'Harcama Yetkilisi'
  },
  realizationOfficial: {
    name: '',
    title: 'Müdür Yardımcısı',
    role: 'Gerçekleştirme Görevlisi'
  },
  
  approxCostCommission: createEmptyCommission(),
  marketResearchCommission: createEmptyCommission(),
  inspectionCommission: createEmptyCommission(),

  items: exampleItems,
  suppliers: [],
  offers: [], // Kesin Teklifler
  marketResearchOffers: [], // Piyasa Araştırması Fiyatları

  procurementType: 'Mal',
  directProcurementArticle: '22/d',
  date: today,
  tenderNumber: '2024/001',

  allowance: 0,
  budgetCode: '',

  correspondenceCode: '',
  workflow: {
    needsList: { date: today, number: '', suffix: '-934.01' },
    commissionApproval: { date: today, number: '', suffix: '-934.01.99' },
    priceResearch: { date: today, number: '', suffix: '-934.02.03' },
    approxCost: { date: today },
    tenderApproval: { date: today, number: '', suffix: '-934.01.02' },
    offerLetter: { date: today },
    marketResearch: { date: today },
    invoice: { date: today, number: '' },
    inspection: { date: today, decisionNumber: '' }
  },

  apiKey: '',
  technicalSpecificationContent: '',
  jobDescription: 'Temizlik Malzemesi Alımı'
};

export const UNITS = ['Adet', 'Kg', 'Litre', 'Metre', 'Kutu', 'Paket', 'Saat', 'Gün', 'Ay', 'Çuval'];