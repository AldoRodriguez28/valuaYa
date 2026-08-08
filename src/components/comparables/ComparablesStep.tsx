import React, { useState } from 'react';
import { Scale, Plus, Trash2, Building, DollarSign, ExternalLink, Globe, Info, AlertCircle } from 'lucide-react';
import { useValuationStore } from '../../store/useValuationStore';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ImageUploader } from '../ui/ImageUploader';

const POPULAR_PORTALS = [
  { name: 'Inmuebles24', domain: 'inmuebles24.com' },
  { name: 'Lamudi', domain: 'lamudi.com.mx' },
  { name: 'Propiedades.com', domain: 'propiedades.com' },
  { name: 'Vivanuncios', domain: 'vivanuncios.com.mx' },
];

export const ComparablesStep: React.FC = () => {
  const { comparables, addComparable, removeComparable, updateComparable } = useValuationStore();
  const [activePortalFilter, setActivePortalFilter] = useState<string | null>(null);

  const handleAddDefault = () => {
    addComparable({
      title: `Comparable ${comparables.length + 1}`,
      price: 12000000,
      m2Construction: 300,
      m2Land: 240,
      bedrooms: 3,
      bathrooms: 3,
      condition: 'good',
      colonia: 'Zona Cercana',
    });
  };

  // Calculations for market deviation indicator
  const validComparables = comparables.filter((c) => c.m2Construction > 0 && c.price > 0);
  const avgM2Price = validComparables.length > 0
    ? validComparables.reduce((acc, c) => acc + c.price / c.m2Construction, 0) / validComparables.length
    : 0;

  return (
    <div className="space-y-5 animate-fade-in pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-2">
          <Scale className="w-3.5 h-3.5" /> Estudio de Mercado
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Paso 3: Inmuebles Comparables</h2>
        <p className="text-xs sm:text-sm text-slate-200 mt-1">
          Ingresa entre 3 y 5 propiedades comparables de la misma zona con su fotografía y enlace a portal inmobiliario.
        </p>
      </div>

      {/* Market Sample Stats Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Muestra de Mercado ({comparables.length} comparables)
          </h3>
          <p className="text-xs text-slate-500">
            Promedio Base de Oferta: <span className="font-bold text-navy-900">${Math.round(avgM2Price).toLocaleString('es-MX')} MXN/m²</span>
          </p>
        </div>

        <Button
          variant="emerald"
          size="sm"
          onClick={handleAddDefault}
          icon={<Plus className="w-4 h-4 text-white" />}
          className="min-h-[44px]"
        >
          Agregar Comparable
        </Button>
      </div>

      {/* Comparables Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {comparables.map((comp, idx) => {
          const pricePerM2 = comp.m2Construction > 0 ? Math.round(comp.price / comp.m2Construction) : 0;
          const deviationPercent = avgM2Price > 0 ? Math.round(((pricePerM2 - avgM2Price) / avgM2Price) * 100) : 0;

          return (
            <Card key={comp.id} className="relative group border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">
                  Comparable #{idx + 1}
                </span>
                {comparables.length > 2 && (
                  <button
                    onClick={() => removeComparable(comp.id)}
                    className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                    title="Eliminar comparable"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {/* Photo uploader single for comparable */}
                <ImageUploader
                  label="Foto Representativa"
                  single
                  images={comp.photoUrl ? [comp.photoUrl] : []}
                  onChange={(imgs) => updateComparable(comp.id, { photoUrl: imgs[0] || undefined })}
                />

                <Input
                  label="Nombre / Identificador"
                  value={comp.title}
                  onChange={(e) => updateComparable(comp.id, { title: e.target.value })}
                  placeholder="Ej. Casa Anatole France 180"
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Precio ($ MXN)"
                    type="number"
                    value={comp.price || ''}
                    onChange={(e) => updateComparable(comp.id, { price: parseFloat(e.target.value) || 0 })}
                    icon={<DollarSign className="w-4 h-4 text-slate-400" />}
                  />

                  <Input
                    label="m² Construcción"
                    type="number"
                    value={comp.m2Construction || ''}
                    onChange={(e) => updateComparable(comp.id, { m2Construction: parseFloat(e.target.value) || 0 })}
                    icon={<Building className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1">
                      Estado Conservación
                    </label>
                    <select
                      value={comp.condition}
                      onChange={(e) => updateComparable(comp.id, { condition: e.target.value as any })}
                      className="w-full min-h-[44px] px-3 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl outline-none"
                    >
                      <option value="excellent">Excelente (1.05)</option>
                      <option value="good">Bueno (1.00)</option>
                      <option value="regular">Regular (0.90)</option>
                      <option value="renovation">Remodelación (0.80)</option>
                    </select>
                  </div>

                  <Input
                    label="Colonia / Zona"
                    value={comp.colonia}
                    onChange={(e) => updateComparable(comp.id, { colonia: e.target.value })}
                    placeholder="Ej. Polanco III"
                  />
                </div>

                {/* Source Portal URL */}
                <Input
                  label="Enlace a Portal Inmobiliario"
                  value={comp.sourceUrl || ''}
                  onChange={(e) => updateComparable(comp.id, { sourceUrl: e.target.value })}
                  placeholder="https://www.inmuebles24.com/propiedades/..."
                  icon={<Globe className="w-4 h-4 text-slate-400" />}
                />

                {/* Price per m² & Deviation badge */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Valor por m²:</span>
                    <span className="font-bold text-navy-900 text-sm">
                      ${pricePerM2.toLocaleString('es-MX')} / m²
                    </span>
                  </div>
                  {deviationPercent !== 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        deviationPercent > 0
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {deviationPercent > 0 ? `+${deviationPercent}%` : `${deviationPercent}%`} vs prom.
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
