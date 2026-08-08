import React from 'react';
import { UserCheck, Home, Scale, SlidersHorizontal, FileText, Check } from 'lucide-react';
import { useValuationStore } from '../../store/useValuationStore';
import { StepNumber } from '../../types';

interface StepItem {
  id: StepNumber;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  { id: 1, label: 'Branding Agente', shortLabel: 'Branding', icon: UserCheck },
  { id: 2, label: 'Propiedad Sujeto', shortLabel: 'Propiedad', icon: Home },
  { id: 3, label: 'Comparables', shortLabel: 'Mercado', icon: Scale },
  { id: 4, label: 'Homologación', shortLabel: 'Factores', icon: SlidersHorizontal },
  { id: 5, label: 'Reporte Ejecutivo', shortLabel: 'Reporte', icon: FileText },
];

export const Stepper: React.FC = () => {
  const { currentStep, setStep } = useValuationStore();

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs px-3 py-3 sticky top-[57px] z-20">
      <div className="max-w-2xl mx-auto">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between relative">
          {/* Connector Line behind steps */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-4 h-0.5 bg-[#1E3A8A] -translate-y-1/2 z-0 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />

          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                className="relative z-10 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
                    isCompleted
                      ? 'bg-[#059669] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#1E3A8A] text-white ring-4 ring-navy-100 shadow-md scale-105'
                      : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <span
                  className={`mt-1.5 text-[11px] font-semibold transition-colors hidden sm:block ${
                    isCurrent
                      ? 'text-[#1E3A8A] font-bold'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span
                  className={`mt-1 text-[10px] font-semibold transition-colors sm:hidden ${
                    isCurrent
                      ? 'text-[#1E3A8A] font-bold'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
