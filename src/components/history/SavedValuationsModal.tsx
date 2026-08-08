import React, { useState } from 'react';
import { FolderOpen, Save, Trash2, ArrowRight, Calendar, Building, X, Plus, Check } from 'lucide-react';
import { useValuationStore } from '../../store/useValuationStore';
import { Button } from '../ui/Button';

interface SavedValuationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedValuationsModal: React.FC<SavedValuationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { savedProjects, saveCurrentProject, loadProject, deleteProject, subject } = useValuationStore();
  const [customName, setCustomName] = useState(subject.title || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveCurrent = () => {
    saveCurrentProject(customName || subject.title || 'Avalúo Guardado');
    showToast('Reporte guardado exitosamente');
  };

  const handleLoad = (id: string, title: string) => {
    loadProject(id);
    showToast(`Cargado: ${title}`);
    setTimeout(() => onClose(), 600);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Deseas eliminar este reporte guardado de la memoria?')) {
      deleteProject(id);
      showToast('Reporte eliminado');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Mis Avalúos y Reportes Guardados</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Save Current Draft Action Box */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block">
            Guardar Borrador Actual
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Nombre del reporte (ej. Casa Polanco)"
              className="flex-1 min-h-[44px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl outline-none"
            />
            <Button
              variant="emerald"
              size="sm"
              onClick={handleSaveCurrent}
              icon={<Save className="w-4 h-4 text-white" />}
              className="shrink-0 min-h-[44px]"
            >
              Guardar
            </Button>
          </div>
        </div>

        {/* Saved Projects List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProjects.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">No tienes reportes guardados aún</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Guarda tus valuaciones para consultarlas o duplicarlas en el futuro sin necesidad de conexión a internet.
              </p>
            </div>
          ) : (
            savedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleLoad(project.id, project.title)}
                className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors shadow-xs group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#1E3A8A]" />
                    <span className="font-bold text-sm text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                      {project.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {project.createdAt}
                    </span>
                    <span>• {project.subject.m2Construction} m² Const.</span>
                  </div>

                  <span className="text-xs font-extrabold text-emerald-700 block">
                    ${project.targetMarketValue.toLocaleString('es-MX')} MXN
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[36px] text-xs gap-1"
                    onClick={() => handleLoad(project.id, project.title)}
                  >
                    <span>Cargar</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  </Button>

                  <button
                    onClick={(e) => handleDelete(project.id, e)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Eliminar reporte"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>{savedProjects.length} reportes guardados localmente</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
