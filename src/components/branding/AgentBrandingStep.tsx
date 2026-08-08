import React, { useState, useRef } from 'react';
import {
  User,
  Building,
  Phone,
  MessageSquare,
  Mail,
  Award,
  Upload,
  Image as ImageIcon,
  Palette,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { useValuationStore } from '../../store/useValuationStore';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const COLOR_PALETTES = [
  { name: 'Navy Ejecutivo', hex: '#1E3A8A', bgClass: 'bg-[#1E3A8A]' },
  { name: 'Esmeralda Éxito', hex: '#059669', bgClass: 'bg-[#059669]' },
  { name: 'Zafiro Real', hex: '#2563EB', bgClass: 'bg-[#2563EB]' },
  { name: 'Vino Premium', hex: '#881337', bgClass: 'bg-[#881337]' },
  { name: 'Grafito Moderno', hex: '#1E293B', bgClass: 'bg-[#1E293B]' },
];

export const AgentBrandingStep: React.FC = () => {
  const { branding, updateBranding, nextStep } = useValuationStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedNotification, setSavedNotification] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateBranding({ [name]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('La imagen excede el límite recomendado de 3MB. Por favor selecciona una imagen más ligera.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateBranding({ logoUrl: dataUrl });
      triggerSavedToast();
    };
    reader.readAsDataURL(file);
  };

  const triggerSavedToast = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const formattedWhatsAppUrl = branding.whatsapp
    ? `https://wa.me/${branding.whatsapp.replace(/\D/g, '')}`
    : '#';

  return (
    <div className="space-y-5 animate-fade-in pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
          <User className="w-40 h-40" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Configuración de Marca Personal
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Paso 1: Identidad del Agente</h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-lg">
            Configura tu logo, datos de contacto y paleta ejecutiva. Estos datos personalizarán automáticamente todos tus reportes ACM y PDFs para tus clientes.
          </p>
        </div>
      </div>

      {/* Save Toast Notification */}
      {savedNotification && (
        <div className="fixed top-16 right-4 z-50 bg-[#059669] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Branding actualizado automáticamente</span>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column - Form Controls */}
        <div className="lg:col-span-2 space-y-5">
          {/* Logo & Basic Info Card */}
          <Card title="Información General del Asesor" subtitle="Aparecerá en el encabezado del reporte">
            <div className="space-y-4 mt-2">
              {/* Logo Upload Dropzone */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-2">
                  Logo Profesional / Inmobiliaria
                </label>
                <div className="flex items-start gap-4">
                  {branding.logoUrl ? (
                    <div className="relative group">
                      <img
                        src={branding.logoUrl}
                        alt="Logo Agente"
                        className="w-20 h-20 object-contain rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => updateBranding({ logoUrl: null })}
                        className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 transition-colors"
                        title="Eliminar logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-navy-900 bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-colors group text-slate-400 hover:text-navy-900"
                    >
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-semibold">Subir</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      icon={<Upload className="w-4 h-4 text-slate-600" />}
                      className="min-h-[40px]"
                    >
                      {branding.logoUrl ? 'Cambiar Logo' : 'Seleccionar Imagen (PNG, JPG)'}
                    </Button>
                    <p className="text-[11px] text-slate-500">
                      Recomendado: Fondo transparente PNG, máx 2000x2000px. Guardado en memoria local.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name & Agency inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="Nombre Completo del Agente"
                  name="fullName"
                  value={branding.fullName}
                  onChange={handleInputChange}
                  placeholder="Ej. Lic. Carlos Mendoza"
                  icon={<User className="w-5 h-5 text-slate-400" />}
                  required
                />

                <Input
                  label="Nombre de la Inmobiliaria / Marca"
                  name="agencyName"
                  value={branding.agencyName}
                  onChange={handleInputChange}
                  placeholder="Ej. Premier Real Estate México"
                  icon={<Building className="w-5 h-5 text-slate-400" />}
                />
              </div>

              {/* License / Registry */}
              <Input
                label="Cédula Profesional / Registro Inmobiliario"
                name="licenseId"
                value={branding.licenseId || ''}
                onChange={handleInputChange}
                placeholder="Ej. REG-CDMX-98421"
                icon={<Award className="w-5 h-5 text-slate-400" />}
                helperText="Opcional: Aumenta la confianza y profesionalismo del reporte."
              />
            </div>
          </Card>

          {/* Contact Details Card */}
          <Card title="Canales de Contacto Directo" subtitle="Para interacción rápida por WhatsApp y llamada">
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Teléfono de Contacto"
                  name="phone"
                  value={branding.phone}
                  onChange={handleInputChange}
                  placeholder="Ej. 55 1234 5678"
                  icon={<Phone className="w-5 h-5 text-slate-400" />}
                />

                <Input
                  label="WhatsApp Directo (con clave de país)"
                  name="whatsapp"
                  value={branding.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Ej. 525512345678"
                  icon={<MessageSquare className="w-5 h-5 text-emerald-600" />}
                  helperText="Utilizado para el enlace de envío 1-click del reporte."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={branding.email}
                  onChange={handleInputChange}
                  placeholder="ejemplo@agente.com"
                  icon={<Mail className="w-5 h-5 text-slate-400" />}
                />

                {/* WhatsApp Link preview */}
                <div className="flex flex-col gap-1.5 justify-end">
                  <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Prueba Enlace WhatsApp
                  </span>
                  <a
                    href={formattedWhatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[48px] px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-800 text-xs font-medium flex items-center justify-between transition-colors group"
                  >
                    <span className="truncate">wa.me/{branding.whatsapp || '...'}</span>
                    <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Slogan input */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                  Lema / Slogan Profesional
                </label>
                <textarea
                  name="slogan"
                  value={branding.slogan}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-navy-100 focus:border-navy-900 outline-none transition-all"
                  placeholder="Ej. Tu patrimonio en manos de especialistas certificados."
                />
              </div>
            </div>
          </Card>

          {/* Color Palette Selector */}
          <Card title="Paleta de Color Ejecutiva" subtitle="Color principal del PDF y encabezados">
            <div className="mt-3">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {COLOR_PALETTES.map((color) => {
                  const isSelected = branding.primaryColor === color.hex;
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => updateBranding({ primaryColor: color.hex })}
                      className={`min-h-[56px] p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center relative ${
                        isSelected
                          ? 'border-navy-900 ring-2 ring-navy-900/30 bg-slate-50 font-bold scale-[1.02]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full shadow-inner ${color.bgClass} flex items-center justify-center`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-[11px] text-slate-800 leading-tight">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Live Report Header Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-[125px] space-y-4">
            <Card
              title="Vista Previa de Tarjeta de Agente"
              subtitle="Así se presentará tu firma en el reporte final para el cliente"
            >
              <div
                className="mt-3 rounded-xl p-4 text-white shadow-md transition-colors"
                style={{ backgroundColor: branding.primaryColor || '#1E3A8A' }}
              >
                <div className="flex items-center gap-3 pb-3 border-b border-white/20">
                  {branding.logoUrl ? (
                    <img
                      src={branding.logoUrl}
                      alt="Logo Preview"
                      className="w-12 h-12 object-contain bg-white rounded-lg p-1 shrink-0 shadow-xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center font-bold text-white text-lg shrink-0">
                      {branding.agencyName ? branding.agencyName.charAt(0) : 'A'}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-base leading-tight truncate">
                      {branding.fullName || 'Tu Nombre Aquí'}
                    </h4>
                    <p className="text-xs text-white/80 truncate">
                      {branding.agencyName || 'Tu Agencia Inmobiliaria'}
                    </p>
                    {branding.licenseId && (
                      <p className="text-[10px] text-emerald-300 font-medium">
                        {branding.licenseId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 space-y-1.5 text-xs text-white/90">
                  {branding.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span className="truncate">{branding.phone}</span>
                    </div>
                  )}
                  {branding.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-white/70 shrink-0" />
                      <span className="truncate">{branding.email}</span>
                    </div>
                  )}
                  {branding.slogan && (
                    <p className="text-[11px] italic text-white/80 pt-1 border-t border-white/10 mt-2">
                      "{branding.slogan}"
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Los datos introducidos se guardan automáticamente en la memoria de tu dispositivo para futuros avalúos.
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
