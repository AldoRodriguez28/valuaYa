import React from 'react';
import { SlidersHorizontal, Calculator, CheckCircle2, TrendingUp } from 'lucide-react';
import { useValuationStore } from '../../store/useValuationStore';
import { Card } from '../ui/Card';

const CONSERVATION_FACTORS: Record<string, number> = {
  excellent: 1.05,
  good: 1.00,
  regular: 0.90,
  renovation: 0.80,
};

export const HomologationStep: React.FC = () => {
  const { subject, comparables, homologation, updateHomologation } = useValuationStore();

  // Calculation Logic
  const validComparables = comparables.filter((c) => c.m2Construction > 0 && c.price > 0);
  
  const rawAvgPricePerM2 = validComparables.length > 0
    ? validComparables.reduce((acc, c) => acc + c.price / c.m2Construction, 0) / validComparables.length
    : 0;

  const subjectConservationFactor = CONSERVATION_FACTORS[subject.condition] || 1.0;

  const homologatedComparables = validComparables.map((comp) => {
    const rawPriceM2 = comp.price / comp.m2Construction;
    // Surface Factor = (Subject_m2 / Comparable_m2)^0.12
    const surfaceFactor = Math.pow(subject.m2Construction / comp.m2Construction, homologation.surfaceExponent);
    // Conservation Factor ratio = Subject / Comparable
    const compConservationFactor = CONSERVATION_FACTORS[comp.condition] || 1.0;
    const conservationRatio = subjectConservationFactor / compConservationFactor;

    const totalFactor = surfaceFactor * conservationRatio * homologation.customLocationFactor;
    const homologatedPriceM2 = rawPriceM2 * totalFactor;

    return {
      ...comp,
      rawPriceM2,
      surfaceFactor,
      conservationRatio,
      totalFactor,
      homologatedPriceM2,
    };
  });

  const homologatedAvgM2 = homologatedComparables.length > 0
    ? homologatedComparables.reduce((acc, c) => acc + c.homologatedPriceM2, 0) / homologatedComparables.length
    : 0;

  const estimatedMarketValue = Math.round(homologatedAvgM2 * subject.m2Construction);

  return (
    <div className="space-y-5 animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-2">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Motor Homologador
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Paso 4: Homologación de Mercado</h2>
        <p className="text-xs sm:text-sm text-slate-200 mt-1">
          Ajuste fino de factores de superficie, conservación y localización según normatividad de valuación.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Ajustes Homologadores Interactivos">
            <div className="space-y-4 mt-2">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-slate-700">Exponente Factor Superficie</span>
                  <span className="font-bold text-navy-900">{homologation.surfaceExponent}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.20"
                  step="0.01"
                  value={homologation.surfaceExponent}
                  onChange={(e) => updateHomologation({ surfaceExponent: parseFloat(e.target.value) })}
                  className="w-full accent-navy-900 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Estándar mexicano: 0.12 (Ajusta la diferencia de áreas entre inmuebles).
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-slate-700">Ajuste de Micro-Ubicación / Entorno</span>
                  <span className="font-bold text-navy-900">{homologation.customLocationFactor.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.85"
                  max="1.15"
                  step="0.01"
                  value={homologation.customLocationFactor}
                  onChange={(e) => updateHomologation({ customLocationFactor: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Factores &gt; 1.00 para mejor ubicación, &lt; 1.00 para calle secundaria o concurrida.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Desglose por Comparable Homologado">
            <div className="space-y-3 mt-2">
              {homologatedComparables.map((comp) => (
                <div key={comp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">{comp.title}</span>
                    <span className="text-slate-500">
                      Factor total: {comp.totalFactor.toFixed(3)} (Sup: {comp.surfaceFactor.toFixed(2)} | Cons: {comp.conservationRatio.toFixed(2)})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-sm block">
                      ${Math.round(comp.homologatedPriceM2).toLocaleString('es-MX')} / m²
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ${Math.round(comp.rawPriceM2).toLocaleString('es-MX')} / m²
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="Resultado de Homologación">
            <div className="space-y-4 mt-3">
              <div className="p-3 bg-navy-50 rounded-xl border border-navy-100">
                <span className="text-xs text-navy-800 font-medium block">Promedio Base m²</span>
                <span className="text-lg font-extrabold text-navy-900">
                  ${Math.round(rawAvgPricePerM2).toLocaleString('es-MX')} MXN
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs text-emerald-800 font-medium block">Promedio Homologado m²</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  ${Math.round(homologatedAvgM2).toLocaleString('es-MX')} MXN
                </span>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#1E3A8A] to-blue-900 rounded-xl text-white">
                <span className="text-xs text-slate-200 font-medium block">Valor de Mercado Estimado</span>
                <span className="text-2xl font-black text-emerald-300 block mt-1">
                  ${estimatedMarketValue.toLocaleString('es-MX')} MXN
                </span>
                <span className="text-[11px] text-slate-300 mt-1 block">
                  Para {subject.m2Construction} m² habitables
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
