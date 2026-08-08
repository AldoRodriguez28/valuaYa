import React, { useState } from 'react';
import { Building2, Wifi, WifiOff, RotateCcw, ShieldCheck, FolderOpen } from 'lucide-react';
import { useValuationStore } from '../../store/useValuationStore';
import { SavedValuationsModal } from '../history/SavedValuationsModal';

export const Header: React.FC = () => {
  const { resetDraft, savedProjects } = useValuationStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#1E3A8A] text-white shadow-md border-b border-navy-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-inner">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">ValuaYa</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> ACM & Valuación Inmobiliaria
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* History Saved Projects Button */}
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors relative min-h-[40px]"
              title="Mis avalúos guardados"
            >
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Mis Reportes</span>
              {savedProjects.length > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedProjects.length}
                </span>
              )}
            </button>

            {/* Network status pill */}
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium ${
              isOnline ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">En Línea</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Offline</span>
                </>
              )}
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                if (window.confirm('¿Deseas reiniciar el borrador actual? Se conservarán tus datos de agente.')) {
                  resetDraft();
                }
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Nuevo borrador"
              aria-label="Nuevo borrador"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* History Modal */}
      <SavedValuationsModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </>
  );
};
