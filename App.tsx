import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';
import NeedsList from './pages/NeedsList';
import MarketResearch from './pages/MarketResearch';
import Offers from './pages/Offers';
import Documents from './pages/Documents';
import CommissionAssignment from './pages/CommissionAssignment';
import WorkflowManager from './pages/WorkflowManager';
import PdfExport from './pages/PdfExport';
import ProjectList from './pages/ProjectList';
import About from './pages/About'; // Import About
import { ProcurementProvider, useProcurement } from './context/ProcurementContext';
import { DocumentType } from './types';

import { CheckCircle, AlertCircle, Info as InfoIcon, X } from 'lucide-react';

// Wrapper component to handle context dependent logic
const AppContent: React.FC = () => {
  const { activeProjectId, notification, hideNotification } = useProcurement();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDoc, setActiveDoc] = useState<DocumentType>('onay_belgesi');

  const [updateInfo, setUpdateInfo] = useState<{ progress: number, show: boolean }>({ progress: 0, show: false });

  useEffect(() => {
    if (window.electron?.onDownloadProgress) {
      window.electron.onDownloadProgress((progressObj: any) => {
        setUpdateInfo({
          progress: progressObj.percent || 0,
          show: true
        });
      });
    }
  }, []);

  // If no project is selected, show the Project List (Home)
  if (!activeProjectId) {
    return <ProjectList />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setTab={setActiveTab} />;
      case 'data-entry':
        return <DataEntry />;
      case 'commission':
        return <CommissionAssignment />;
      case 'workflow':
        return <WorkflowManager />;
      case 'needs':
        return <NeedsList />;
      case 'market':
        return <MarketResearch />;
      case 'offers':
        return <Offers />;
      case 'documents':
        return <Documents activeDoc={activeDoc} />;
      case 'pdf-export':
        return <PdfExport />;
      case 'about':
        return <About />;
      default:
        return <Dashboard setTab={setActiveTab} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDoc={activeDoc}
        setActiveDoc={setActiveDoc}
      >
        {renderContent()}
      </Layout>

      {/* Global Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-[9999] min-w-[320px] max-w-md p-4 rounded-xl shadow-2xl border flex items-start animate-in fade-in slide-in-from-top-4 duration-300 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
          <div className="mr-3 mt-0.5">
            {notification.type === 'success' && <CheckCircle className="text-green-600" size={20} />}
            {notification.type === 'error' && <AlertCircle className="text-red-600" size={20} />}
            {notification.type === 'info' && <InfoIcon className="text-blue-600" size={20} />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">{notification.type === 'success' ? 'Başarılı' : notification.type === 'error' ? 'Hata' : 'Bilgi'}</p>
            <p className="text-xs mt-0.5 opacity-90 leading-relaxed font-medium">{notification.message}</p>
          </div>
          <button onClick={hideNotification} className="ml-3 p-1 hover:bg-black/5 rounded-lg transition-colors">
            <X size={16} className="opacity-50 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* Update Progress Overlay */}
      {updateInfo.show && updateInfo.progress < 100 && (
        <div className="fixed bottom-6 right-6 z-[9999] w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-blue-100 p-5 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <InfoIcon size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Güncelleme İndiriliyor</h4>
              <p className="text-xs text-gray-500">Lütfen programı kapatmayın...</p>
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.round(updateInfo.progress)}%` }}
            ></div>
          </div>

          <div className="mt-2 text-right">
            <span className="text-xs font-bold text-blue-600">
              %{Math.round(updateInfo.progress)}
            </span>
          </div>
        </div>
      )}

      {updateInfo.show && updateInfo.progress >= 100 && (
        <div className="fixed bottom-6 right-6 z-[9999] w-80 bg-green-50 rounded-xl shadow-2xl border border-green-200 p-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <h4 className="font-bold text-green-800 text-sm">İndirme Tamamlandı!</h4>
              <p className="text-xs text-green-700 mt-0.5">Yeniden başlatmanız bekleniyor...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ProcurementProvider>
      <AppContent />
    </ProcurementProvider>
  );
};

export default App;