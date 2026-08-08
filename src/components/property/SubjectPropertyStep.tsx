import React from 'react';
import { Home, MapPin, Layers, Building, Camera, Sparkles, Check } from 'lucide-react';
import { useValuationStore } from '../../store/useValuationStore';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { ImageUploader } from '../ui/ImageUploader';

const AMENITY_OPTIONS = [
  'Seguridad 24/7',
  'Alberca',
  'Terraza / Roof Garden',
  'Jardín Privado',
  'Elevador',
  'Bodega',
  'Gimnasio',
  'Estacionamiento de Visitas',
  'Salón de Eventos',
  'Circuito Cerrado (CCTV)',
];

export const SubjectPropertyStep: React.FC = () => {
  const { subject, updateSubject } = useValuationStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      updateSubject({ [name]: parseFloat(value) || 0 });
    } else {
      updateSubject({ [name]: value });
    }
  };

  const toggleAmenity = (amenityName: string) => {
    const currentAmenities = subject.amenities || [];
    const exists = currentAmenities.includes(amenityName);
    const updated = exists
      ? currentAmenities.filter((a) => a !== amenityName)
      : [...currentAmenities, amenityName];
    updateSubject({ amenities: updated });
  };

  return (
    <div className="space-y-5 animate-fade-in pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-2">
          <Home className="w-3.5 h-3.5" /> Características de la Propiedad
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Paso 2: Propiedad Sujeto</h2>
        <p className="text-xs sm:text-sm text-slate-200 mt-1">
          Captura los detalles físicos, fotografías y ubicación del inmueble a valuar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Photo Gallery Card */}
          <Card title="Fotografías del Inmueble Sujeto" subtitle="Fachada principal e interiores (aparecerán en el reporte PDF)">
            <div className="mt-3">
              <ImageUploader
                label="Galería Fotográfica del Inmueble"
                helperText="Sube hasta 6 fotografías (fachada, sala, recámaras, terraza). Se optimizan automáticamente."
                images={subject.photos || []}
                onChange={(photos) => updateSubject({ photos })}
                maxImages={6}
              />
            </div>
          </Card>

          {/* Location Card */}
          <Card title="Ubicación y Tipo de Inmueble">
            <div className="space-y-4 mt-2">
              <Input
                label="Título del Avalúo / Identificador"
                name="title"
                value={subject.title}
                onChange={handleInputChange}
                placeholder="Ej. Casa Residencia Polanco"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                    Tipo de Inmueble
                  </label>
                  <select
                    name="propertyType"
                    value={subject.propertyType}
                    onChange={handleInputChange}
                    className="w-full min-h-[48px] px-4 py-3 text-base text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-navy-100 outline-none"
                  >
                    <option value="casa">Casa en Condominio / Sola</option>
                    <option value="departamento">Departamento</option>
                    <option value="terreno">Terreno / Lote</option>
                    <option value="local">Local Comercial</option>
                    <option value="oficina">Oficina</option>
                  </select>
                </div>

                <Input
                  label="Colonia / Zona"
                  name="colonia"
                  value={subject.colonia}
                  onChange={handleInputChange}
                  placeholder="Ej. Polanco III Sección"
                  icon={<MapPin className="w-5 h-5 text-slate-400" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Dirección Completa"
                  name="address"
                  value={subject.address}
                  onChange={handleInputChange}
                  placeholder="Calle y número"
                />

                <Input
                  label="Ciudad / Municipio & Estado"
                  name="city"
                  value={`${subject.city}, ${subject.state}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    updateSubject({
                      city: parts[0]?.trim() || '',
                      state: parts[1]?.trim() || '',
                    });
                  }}
                  placeholder="Ej. Miguel Hidalgo, CDMX"
                />
              </div>
            </div>
          </Card>

          {/* Physical Specifications */}
          <Card title="Superficie y Distribución Físicas">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <Input
                label="Superficie de Terreno (m²)"
                name="m2Land"
                type="number"
                value={subject.m2Land || ''}
                onChange={handleInputChange}
                placeholder="Ej. 250"
                icon={<Layers className="w-5 h-5 text-slate-400" />}
              />

              <Input
                label="Superficie de Construcción (m²)"
                name="m2Construction"
                type="number"
                value={subject.m2Construction || ''}
                onChange={handleInputChange}
                placeholder="Ej. 310"
                icon={<Building className="w-5 h-5 text-slate-400" />}
                required
              />

              <Input
                label="Recámaras"
                name="bedrooms"
                type="number"
                value={subject.bedrooms || ''}
                onChange={handleInputChange}
                placeholder="Ej. 3"
              />

              <Input
                label="Baños Completos"
                name="bathrooms"
                type="number"
                value={subject.bathrooms || ''}
                onChange={handleInputChange}
                placeholder="Ej. 3"
              />

              <Input
                label="Estacionamientos"
                name="parkingSpaces"
                type="number"
                value={subject.parkingSpaces || ''}
                onChange={handleInputChange}
                placeholder="Ej. 2"
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                  Estado de Conservación
                </label>
                <select
                  name="condition"
                  value={subject.condition}
                  onChange={handleInputChange}
                  className="w-full min-h-[48px] px-4 py-3 text-base text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-navy-100 outline-none"
                >
                  <option value="excellent">Excelente (1.05 - Remodelado/Nuevo)</option>
                  <option value="good">Bueno (1.00 - Habitable/Buen estado)</option>
                  <option value="regular">Regular (0.90 - Requiere mantenimientos)</option>
                  <option value="renovation">Requiere Remodelación (0.80)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Interactive Amenity Chips */}
          <Card title="Amenidades e Insumos Destacados" subtitle="Toca las opciones para incluirlas en el reporte">
            <div className="flex flex-wrap gap-2 mt-3">
              {AMENITY_OPTIONS.map((item) => {
                const isSelected = (subject.amenities || []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E3A8A] text-white shadow-xs scale-102 ring-2 ring-navy-900/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <Card title="Resumen Físico del Inmueble">
            <div className="space-y-3 mt-3">
              {subject.photos && subject.photos.length > 0 && (
                <div className="rounded-xl overflow-hidden aspect-16/9 border border-slate-200">
                  <img
                    src={subject.photos[0]}
                    alt="Portada Sujeto"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-600 font-medium">Superficie Total:</span>
                <span className="font-bold text-slate-900">{subject.m2Construction} m² Const.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-600 font-medium">Terreno:</span>
                <span className="font-bold text-slate-900">{subject.m2Land} m²</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-600 font-medium">Distribución:</span>
                <span className="font-bold text-slate-900">
                  {subject.bedrooms} Rec. | {subject.bathrooms} Baños
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-600 font-medium">Amenidades:</span>
                <span className="font-bold text-navy-900">{subject.amenities?.length || 0} seleccionadas</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
