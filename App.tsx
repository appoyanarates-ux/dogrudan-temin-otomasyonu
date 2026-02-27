import React, { useState } from 'react';
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