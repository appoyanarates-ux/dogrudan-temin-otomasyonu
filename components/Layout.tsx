import React, { useState } from 'react';
import { FileText, Users, ShoppingCart, BarChart, Printer, Menu, X, Trash2, Home, UserCog, CalendarClock, FileDown, Calculator, Search, ArrowLeft, FolderOpen, Info } from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { DocumentType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeDoc?: DocumentType;
  setActiveDoc?: (doc: DocumentType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, activeDoc, setActiveDoc }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { state, resetData, closeProject } = useProcurement();

  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: Home },
    { id: 'data-entry', label: '1. Veri Girişi', icon: Users },
    { id: 'commission', label: '2. Komisyonlar', icon: UserCog },
    { id: 'workflow', label: '3. İşlem Akışı', icon: CalendarClock },
    { id: 'needs', label: '4. İhtiyaç Listesi', icon: ShoppingCart },
    { id: 'market', label: '5. Piyasa Fiyat Araştırması', icon: Search },
    { id: 'offers', label: '6. Teklifler', icon: Calculator },
    { id: 'documents', label: '7. Evrak & Çıktı', icon: Printer },
    { id: 'pdf-export', label: '8. Toplu PDF', icon: FileDown },
    { id: 'about', label: 'Hakkında & Yardım', icon: Info },
  ];

  const docMenuItems: { id: DocumentType; label: string }[] = [
    { id: 'ihtiyac_listesi', label: '1. İhtiyaç Listesi' },
    { id: 'komisyon_onay', label: '2. Komisyon Onayı' },
    { id: 'fiyat_arastirma', label: '3. Fiyat Araştırması' },
    { id: 'yaklasik_maliyet', label: '4. Yaklaşık Maliyet' },
    { id: 'onay_belgesi', label: '5. Onay Belgesi' },
    { id: 'teklif_mektubu', label: '6. Teklif Mektubu' },
    { id: 'piyasa_arastirma', label: '7. Piyasa Araştırması' },
    { id: 'muayene_kabul', label: '8. Muayene Kabul' },
    { id: 'teknik_sartname', label: '9. Teknik Şartname' },
    { id: 'hizmet_kabul', label: '10. Hizmet Kabul Tutanağı' },
    { id: 'hakedis_raporu', label: '11. Hak Ediş Raporu' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gov-900 text-white transition-all duration-300 overflow-hidden flex-shrink-0 flex flex-col no-print fixed h-full z-10`}
      >
        <div className="p-4 border-b border-gov-800 flex items-center justify-between">
          <div className="font-bold text-lg truncate flex items-center">
            <FolderOpen size={20} className="mr-2 text-blue-300"/>
            DT Otomasyonu
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Back to Projects Button */}
        <div className="p-4 border-b border-gov-800">
           <button 
             onClick={closeProject}
             className="w-full bg-gov-800 hover:bg-gov-700 text-white py-2 px-3 rounded flex items-center justify-center text-sm font-medium transition-colors border border-gov-700"
           >
             <ArrowLeft size={16} className="mr-2" />
             Projelerim
           </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-gov-800 text-white border-r-4 border-white' 
                      : 'text-gov-100 hover:bg-gov-800'
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </button>
                
                {/* SUBMENU FOR DOCUMENTS */}
                {item.id === 'documents' && activeTab === 'documents' && setActiveDoc && activeDoc && (
                  <div className="bg-gov-950/50 py-2 space-y-1">
                     {docMenuItems.map(doc => (
                        <button
                          key={doc.id}
                          onClick={() => setActiveDoc(doc.id)}
                          className={`w-full flex items-center pl-12 pr-4 py-2 text-xs font-medium transition-colors ${
                             activeDoc === doc.id
                               ? 'text-white bg-white/10 border-r-4 border-gov-400'
                               : 'text-gov-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${activeDoc === doc.id ? 'bg-gov-400' : 'bg-gray-600'}`}></span>
                          {doc.label}
                        </button>
                     ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 bg-gov-950 border-t border-gov-800">
           <div className="text-xs text-gov-400 mb-2 truncate" title={state.jobDescription}>
             Aktif: {state.tenderNumber}
           </div>
           <button 
            onClick={resetData}
            className="flex items-center text-red-400 hover:text-red-300 text-xs w-full"
           >
             <Trash2 size={14} className="mr-2" /> Projeyi Sıfırla
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} flex flex-col min-h-screen`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6 no-print">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gov-600 mr-4 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Toplam Yaklaşık Maliyet: 
              <span className="font-bold text-gray-900 ml-2">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(state.items.reduce((acc, i) => acc + (i.quantity * i.estimatedUnitPrice), 0))}
              </span>
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1 overflow-auto bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;