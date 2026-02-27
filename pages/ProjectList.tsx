import React, { useState } from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { FolderPlus, FolderOpen, Trash2, Calendar, FileText, Briefcase, ChevronRight, AlertTriangle, Edit2, Save, X } from 'lucide-react';

const ProjectList: React.FC = () => {
  const { projects, createProject, loadProject, deleteProject, updateProjectName } = useProcurement();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // Renaming State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('tr-TR', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return 'Tarih yok';
    }
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setTempName(currentName);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempName('');
  };

  const saveEditing = (id: string) => {
    if (tempName.trim()) {
      updateProjectName(id, tempName);
    }
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                 <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 mb-2">İhale Dosyasını Sil</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                 Bu dosyayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm veriler kaybolur.
              </p>
              <div className="flex space-x-3">
                 <button 
                   onClick={() => setProjectToDelete(null)}
                   className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                 >
                   Vazgeç
                 </button>
                 <button 
                   onClick={confirmDelete}
                   className="flex-1 py-2.5 px-4 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition-colors shadow-sm"
                 >
                   Evet, Sil
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
             <h1 className="text-3xl font-bold text-slate-900 flex items-center">
               <Briefcase className="mr-3 text-blue-600" size={32} />
               Doğrudan Temin Dosyalarım
             </h1>
             <p className="text-slate-500 mt-2">
               Tüm ihale süreçlerinizi buradan yönetebilir, yeni dosya oluşturabilir veya eski dosyalarınıza devam edebilirsiniz.
             </p>
          </div>
          <button 
            onClick={createProject}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center font-bold transition-transform active:scale-95"
          >
            <FolderPlus className="mr-2" size={20} />
            Yeni İhale Başlat
          </button>
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
             <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen size={40} className="text-blue-400" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Henüz hiç dosyanız yok</h3>
             <p className="text-slate-500 mb-8 max-w-md mx-auto">
               "Yeni İhale Başlat" butonuna tıklayarak ilk doğrudan temin sürecinizi başlatabilirsiniz.
             </p>
          </div>
        )}

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            // Calculate basic stats for preview
            const itemCount = project.items.length;
            // Note: This approximate cost is simple item calc for preview speed, 
            // or we could replicate the avg logic but it might be heavy for list.
            // Sticking to simple estimation or 0 for preview.
            const approxCost = project.items.reduce((acc, i) => acc + (i.quantity * i.estimatedUnitPrice), 0);
            
            return (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex flex-col overflow-hidden">
                 
                 {/* Card Header */}
                 <div className="p-6 border-b border-slate-100 bg-slate-50/50 relative">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                         {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                       </span>
                       <span className="text-xs text-slate-400 font-mono">
                         {project.tenderNumber}
                       </span>
                    </div>
                    
                    {/* Editable Title */}
                    {editingId === project.id ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input 
                          type="text" 
                          autoFocus
                          className="flex-1 text-sm border border-blue-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-200"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditing(project.id);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <button onClick={() => saveEditing(project.id)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Save size={16}/></button>
                        <button onClick={cancelEditing} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={16}/></button>
                      </div>
                    ) : (
                      <div className="group/title relative pr-6">
                        <h3 
                          className="font-bold text-lg text-slate-800 line-clamp-2 min-h-[3.5rem] cursor-pointer hover:text-blue-600 transition-colors"
                          title={project.jobDescription}
                          onClick={() => loadProject(project.id)}
                        >
                           {project.jobDescription || 'İsimsiz İhale Dosyası'}
                        </h3>
                        <button 
                          onClick={(e) => { e.stopPropagation(); startEditing(project.id, project.jobDescription); }}
                          className="absolute top-0 right-0 text-slate-400 hover:text-blue-600 opacity-0 group-hover/title:opacity-100 transition-opacity p-1"
                          title="İsmi Düzenle"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                 </div>

                 {/* Card Stats */}
                 <div className="p-6 space-y-3 flex-1">
                    <div className="flex items-center text-sm text-slate-600">
                       <FileText size={16} className="mr-2 text-slate-400" />
                       <span>{itemCount} Kalem Ürün</span>
                    </div>
                    {/* Note: This shows estimated unit price total, usually 0 until finalized. 
                        Users might prefer just seeing update date here. */}
                    <div className="flex items-center text-xs text-slate-400 pt-2 border-t border-slate-100 mt-3">
                       <Calendar size={14} className="mr-1.5" />
                       Son İşlem: {formatDate(project.lastUpdated)}
                    </div>
                 </div>

                 {/* Actions */}
                 <div className="p-4 bg-slate-50 flex gap-3">
                    <button 
                      onClick={() => loadProject(project.id)}
                      className="flex-1 bg-white border border-slate-200 text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors flex items-center justify-center text-sm"
                    >
                      Dosyayı Aç <ChevronRight size={16} className="ml-1" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setProjectToDelete(project.id); }}
                      className="bg-white border border-slate-200 text-red-500 p-2 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                      title="Dosyayı Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ProjectList;