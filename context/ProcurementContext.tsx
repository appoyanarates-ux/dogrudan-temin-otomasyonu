import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProcurementState, Item, Supplier, Offer, CommissionMember, Official, Institution, Workflow } from '../types';
import { INITIAL_STATE } from '../constants';

type CommissionType = 'approx' | 'market' | 'inspection';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
  show: boolean;
  message: string;
  type: NotificationType;
}

interface ProcurementContextType {
  state: ProcurementState; // The ACTIVE project state
  projects: ProcurementState[]; // All projects list
  activeProjectId: string | null;
  notification: NotificationState;

  // Project Management Actions
  createProject: () => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
  updateProjectName: (id: string, name: string) => void; // New function
  closeProject: () => void; // Go back to list

  // Global UI
  notify: (message: string, type?: NotificationType) => void;
  hideNotification: () => void;

  // Active Project Actions
  updateInstitution: (data: Partial<Institution>) => void;
  updateOfficial: (type: 'spending' | 'realization', data: Partial<Official>) => void;
  updateCommission: (type: CommissionType, members: CommissionMember[]) => void;
  updateWorkflow: (key: keyof Workflow, data: any) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  updateItem: (item: Item) => void;
  addSupplier: (supplier: Supplier) => void;
  removeSupplier: (id: string) => void;

  setOffer: (offer: Offer) => void; // Updates Final Bids (offers)
  setMarketResearchOffer: (offer: Offer) => void; // Updates Research Prices (marketResearchOffers)

  setMeta: (key: keyof ProcurementState, value: any) => void;
  resetData: () => void;
  calculateApproxCost: () => number; // Simple (Item defined price)
  calculateAverageApproxCost: () => number; // Complex (Market Research Average)
  calculateLowestOfferTotal: () => number;
  getWinnerSupplier: () => Supplier | null;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Load Projects List
  const [projects, setProjects] = useState<ProcurementState[]>(() => {
    const savedProjects = localStorage.getItem('procurementProjects');
    const oldSingleState = localStorage.getItem('procurementState');

    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects) as ProcurementState[];
      // Migration: Ensure marketResearchOffers exists for all loaded projects
      return parsedProjects.map(p => ({
        ...p,
        marketResearchOffers: p.marketResearchOffers || []
      }));
    }

    // Migration: If we have an old single state but no list, convert it to a project
    if (oldSingleState) {
      const parsed = JSON.parse(oldSingleState);
      const migratedProject = {
        ...INITIAL_STATE,
        ...parsed,
        id: crypto.randomUUID(),
        lastUpdated: new Date().toISOString(),
        status: 'active' as const,
        marketResearchOffers: parsed.marketResearchOffers || [] // Ensure field exists for old data
      };
      return [migratedProject];
    }

    return [];
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'success'
  });

  const notify = (message: string, type: NotificationType = 'success') => {
    setNotification({ show: true, message, type });
    // Auto-hide after 3 seconds if not error
    if (type !== 'error') {
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const hideNotification = () => setNotification(prev => ({ ...prev, show: false }));

  // Computed active state (derived from projects array for safety)
  const activeState = projects.find(p => p.id === activeProjectId) || INITIAL_STATE;

  // Persist Projects whenever they change
  useEffect(() => {
    localStorage.setItem('procurementProjects', JSON.stringify(projects));
  }, [projects]);

  // --- Project Management Functions ---

  const createProject = () => {
    const newProject: ProcurementState = {
      ...INITIAL_STATE,
      id: crypto.randomUUID(),
      lastUpdated: new Date().toISOString(),
      tenderNumber: `2024/${projects.length + 1}`,
      jobDescription: 'Yeni İhale Dosyası'
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
  };

  const loadProject = (id: string) => {
    setActiveProjectId(id);
  };

  const deleteProject = (id: string) => {
    // UI handles confirmation now
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const updateProjectName = (id: string, name: string) => {
    setProjects(prev => prev.map(p =>
      p.id === id
        ? { ...p, jobDescription: name, lastUpdated: new Date().toISOString() }
        : p
    ));
  };

  const closeProject = () => {
    setActiveProjectId(null);
  };

  // --- Helper to update current project state ---
  const updateActiveProject = (updater: (prev: ProcurementState) => ProcurementState) => {
    if (!activeProjectId) return;

    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const updated = updater(p);
        return { ...updated, lastUpdated: new Date().toISOString() };
      }
      return p;
    }));
  };

  // --- Data Modification Handlers (Wrapped) ---

  const updateInstitution = (data: Partial<Institution>) => {
    updateActiveProject(prev => ({ ...prev, institution: { ...prev.institution, ...data } }));
  };

  const updateOfficial = (type: 'spending' | 'realization', data: Partial<Official>) => {
    updateActiveProject(prev => ({
      ...prev,
      [type === 'spending' ? 'spendingOfficial' : 'realizationOfficial']: {
        ...(type === 'spending' ? prev.spendingOfficial : prev.realizationOfficial),
        ...data
      }
    }));
  };

  const updateCommission = (type: CommissionType, members: CommissionMember[]) => {
    updateActiveProject(prev => {
      let newState = { ...prev };
      if (type === 'approx') newState.approxCostCommission = members;
      if (type === 'market') newState.marketResearchCommission = members;
      if (type === 'inspection') newState.inspectionCommission = members;
      return newState;
    });
  };

  const updateWorkflow = (key: keyof Workflow, data: any) => {
    updateActiveProject(prev => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        [key]: { ...prev.workflow[key], ...data }
      }
    }));
  };

  const addItem = (item: Item) => {
    updateActiveProject(prev => ({ ...prev, items: [...prev.items, item] }));
  };

  const removeItem = (id: string) => {
    updateActiveProject(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const updateItem = (item: Item) => {
    updateActiveProject(prev => ({ ...prev, items: prev.items.map(i => i.id === item.id ? item : i) }));
  };

  const addSupplier = (supplier: Supplier) => {
    updateActiveProject(prev => ({ ...prev, suppliers: [...prev.suppliers, supplier] }));
  };

  const removeSupplier = (id: string) => {
    updateActiveProject(prev => ({
      ...prev,
      suppliers: prev.suppliers.filter(s => s.id !== id),
      offers: prev.offers.filter(o => o.supplierId !== id),
      marketResearchOffers: prev.marketResearchOffers.filter(o => o.supplierId !== id)
    }));
  };

  // Sets the FINAL BID (Offers Page)
  const setOffer = (offer: Offer) => {
    updateActiveProject(prev => {
      const existing = prev.offers.find(o => o.supplierId === offer.supplierId && o.itemId === offer.itemId);
      let newOffers;
      if (existing) {
        newOffers = prev.offers.map(o => (o.supplierId === offer.supplierId && o.itemId === offer.itemId) ? offer : o);
      } else {
        newOffers = [...prev.offers, offer];
      }
      return { ...prev, offers: newOffers };
    });
  };

  // Sets the MARKET RESEARCH PRICE (Market Research Page)
  const setMarketResearchOffer = (offer: Offer) => {
    updateActiveProject(prev => {
      // Ensure array exists (migration safety)
      const currentList = prev.marketResearchOffers || [];
      const existing = currentList.find(o => o.supplierId === offer.supplierId && o.itemId === offer.itemId);
      let newOffers;
      if (existing) {
        newOffers = currentList.map(o => (o.supplierId === offer.supplierId && o.itemId === offer.itemId) ? offer : o);
      } else {
        newOffers = [...currentList, offer];
      }
      return { ...prev, marketResearchOffers: newOffers };
    });
  };

  const setMeta = (key: keyof ProcurementState, value: any) => {
    updateActiveProject(prev => ({ ...prev, [key]: value }));
  };

  const resetData = () => {
    if (window.confirm('Bu projenin tüm verileri sıfırlanacak. Emin misiniz?')) {
      updateActiveProject(prev => ({
        ...INITIAL_STATE,
        id: prev.id, // Keep ID
        lastUpdated: new Date().toISOString()
      }));
    }
  };

  // --- Calculations ---

  // 1. Simple Calculation (Based on estimatedUnitPrice in Item definition)
  const calculateApproxCost = () => {
    return activeState.items.reduce((acc, item) => acc + (item.quantity * item.estimatedUnitPrice), 0);
  };

  // 2. Complex Calculation (Based on MARKET RESEARCH DATA for Approx Cost)
  const calculateAverageApproxCost = () => {
    // We consider the first 3 suppliers as they are the standard columns in the Market Research doc
    const relevantSuppliers = [0, 1, 2].map(i => activeState.suppliers[i]).filter(s => !!s);
    const researchData = activeState.marketResearchOffers || [];

    if (relevantSuppliers.length === 0) return 0;

    return activeState.items.reduce((total, item) => {
      // Get valid offers for this item from relevant suppliers using MARKET RESEARCH DATA
      const validOffers = relevantSuppliers
        .map(supplier => {
          const offer = researchData.find(o => o.supplierId === supplier.id && o.itemId === item.id);
          return offer ? offer.price : 0;
        })
        .filter(price => price > 0);

      if (validOffers.length === 0) return total;

      // Calculate Average Unit Price
      const avgUnitPrice = validOffers.reduce((sum, price) => sum + price, 0) / validOffers.length;

      // Add to Total (Average Unit Price * Quantity)
      return total + (avgUnitPrice * item.quantity);
    }, 0);
  };

  const calculateSupplierTotal = (supplierId: string) => {
    return activeState.items.reduce((acc, item) => {
      // Calculates based on FINAL OFFERS
      const offer = activeState.offers.find(o => o.supplierId === supplierId && o.itemId === item.id);
      return acc + (offer ? offer.price * item.quantity : 0);
    }, 0);
  };

  const getWinnerSupplier = () => {
    if (activeState.suppliers.length === 0) return null;
    let winner = activeState.suppliers[0];
    let minTotal = calculateSupplierTotal(winner.id);

    if (minTotal === 0 && activeState.items.length > 0) minTotal = Infinity;

    for (const sup of activeState.suppliers) {
      const total = calculateSupplierTotal(sup.id);
      if (total > 0 && total < minTotal) {
        minTotal = total;
        winner = sup;
      }
    }
    return winner;
  };

  const calculateLowestOfferTotal = () => {
    const winner = getWinnerSupplier();
    return winner ? calculateSupplierTotal(winner.id) : 0;
  };

  return (
    <ProcurementContext.Provider value={{
      state: activeState,
      projects,
      activeProjectId,
      createProject,
      loadProject,
      deleteProject,
      updateProjectName,
      closeProject,
      updateInstitution,
      updateOfficial,
      updateCommission,
      updateWorkflow,
      addItem,
      removeItem,
      updateItem,
      addSupplier,
      removeSupplier,
      setOffer,
      setMarketResearchOffer,
      setMeta,
      resetData,
      calculateApproxCost,
      calculateAverageApproxCost,
      calculateLowestOfferTotal,
      getWinnerSupplier,
      notification,
      notify,
      hideNotification
    }}>
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) throw new Error('useProcurement must be used within a ProcurementProvider');
  return context;
};