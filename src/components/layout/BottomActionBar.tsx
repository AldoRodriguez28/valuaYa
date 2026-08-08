import React from 'react';
import { ChevronRight, ChevronLeft, Save, Sparkles, Download, Share2 } from 'lucide-react';
import { useValuationStore } from '../../store/useValuationStore';
import { Button } from '../ui/Button';

interface BottomActionBarProps {
  onNext?: () => void;
  onPrev?: () => void;
  nextText?: string;
  prevText?: string;
  isNextDisabled?: boolean;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  onNext,
  onPrev,
  nextText,
  prevText = 'Anterior',
  isNextDisabled = false,
}) => {
  const { currentStep, nextStep, prevStep } = useValuationStore();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else {
      prevStep();
    }
  };

  const getNextLabel = () => {
    if (nextText) return nextText;
    switch (currentStep) {
      case 1:
        return 'Guardar & Continuar a Propiedad';
      case 2:
        return 'Continuar a Comparables';
      case 3:
        return 'Ir a Homologación';
      case 4:
        return 'Calcular & Generar Valuación';
      case 5:
        return 'Descargar PDF Reporte';
      default:
        return 'Siguiente';
    }
  };

  const getNextIcon = () => {
    if (currentStep === 4) return <Sparkles className="w-5 h-5" />;
    if (currentStep === 5) return <Download className="w-5 h-5" />;
    return <ChevronRight className="w-5 h-5" />;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 sm:px-6 shadow-lg pb-safe">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        {/* Previous Button (Hidden on step 1 unless standard prev available) */}
        {currentStep > 1 ? (
          <Button
            variant="outline"
            size="md"
            onClick={handlePrev}
            icon={<ChevronLeft className="w-5 h-5 text-slate-500" />}
            className="w-1/3 min-h-[48px] border-slate-300 hover:bg-slate-50 text-slate-700"
          >
            {prevText}
          </Button>
        ) : (
          <div className="text-xs text-slate-500 font-medium px-2 flex items-center gap-1.5">
            <Save className="w-4 h-4 text-emerald-600" />
            <span>Paso 1 de 5</span>
          </div>
        )}

        {/* Primary Action Button (Next / Calculate / PDF) */}
        <Button
          variant={currentStep === 5 ? 'emerald' : 'primary'}
          size="md"
          onClick={handleNext}
          disabled={isNextDisabled}
          iconRight={getNextIcon()}
          className={`${currentStep > 1 ? 'w-2/3' : 'w-full'} min-h-[48px] text-base font-bold shadow-md`}
        >
          {getNextLabel()}
        </Button>
      </div>
    </div>
  );
};
