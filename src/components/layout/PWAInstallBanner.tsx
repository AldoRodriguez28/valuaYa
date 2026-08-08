import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';
import { Button } from '../ui/Button';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already installed in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    if (isStandalone) {
      setShowBanner(false);
      return;
    }

    // Capture Chrome / Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not installed, show after 3 seconds
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white px-4 py-3 shadow-md relative z-40 animate-fade-in border-b border-emerald-600">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm leading-tight">Instala ValuaYa en tu teléfono</h4>
              <p className="text-[11px] text-emerald-100">
                Acceso directo 1-tap y uso 100% offline en el campo sin navegador.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={handleInstallClick}
              icon={<Download className="w-4 h-4 text-white" />}
              className="bg-white text-emerald-950 hover:bg-emerald-50 min-h-[38px] text-xs font-bold shadow-xs border-none"
            >
              Instalar App
            </Button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors"
              aria-label="Cerrar aviso de instalación"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 text-slate-900 shadow-2xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-[#1E3A8A]" />
                <h3 className="font-bold text-base">Instalar en iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <span>Toca el botón <strong className="text-navy-900">Compartir</strong> en la barra inferior de Safari.</span>
              </li>
              <li className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <span>Desplázate y selecciona <strong className="text-navy-900">"Agregar a inicio"</strong>.</span>
              </li>
              <li className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <span>¡Listo! Abre ValuaYa directamente desde el ícono de tu teléfono.</span>
              </li>
            </ol>

            <Button
              variant="primary"
              size="md"
              onClick={() => setShowIOSInstructions(false)}
              fullWidth
            >
              Entendido
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
