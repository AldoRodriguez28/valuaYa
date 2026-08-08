import React, { useState } from 'react';
import {
  FileText,
  Share2,
  TrendingDown,
  Target,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Eye,
  X,
} from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import { useValuationStore } from '../../store/useValuationStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PdfDownloadButton } from '../pdf/PdfDownloadButton';
import { ValuationPdfDocument } from '../pdf/ValuationPdfDocument';

const CONSERVATION_FACTORS: Record<string, number> = {
  excellent: 1.05,
  good: 1.00,
  regular: 0.90,
  renovation: 0.80,
};

export const ValuationSummaryStep: React.FC = () => {
  const { branding, subject, comparables, homologation } = useValuationStore();
  const [isSharing, setIsSharing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Calculations
  const validComparables = comparables.filter((c) => c.m2Construction > 0 && c.price > 0);
  const subjectConservationFactor = CONSERVATION_FACTORS[subject.condition] || 1.0;

  const homologatedComparables = validComparables.map((comp) => {
    const rawPriceM2 = comp.price / comp.m2Construction;
    const surfaceFactor = Math.pow(subject.m2Construction / comp.m2Construction, homologation.surfaceExponent);
    const compConservationFactor = CONSERVATION_FACTORS[comp.condition] || 1.0;
    const conservationRatio = subjectConservationFactor / compConservationFactor;
    const totalFactor = surfaceFactor * conservationRatio * homologation.customLocationFactor;
    return rawPriceM2 * totalFactor;
  });

  const homologatedAvgM2 = homologatedComparables.length > 0
    ? homologatedComparables.reduce((a, b) => a + b, 0) / homologatedComparables.length
    : 0;

  const targetMarketValue = Math.round(homologatedAvgM2 * subject.m2Construction);
  const quickSaleValue = Math.round(targetMarketValue * 0.95);
  const maxNegotiableValue = Math.round(targetMarketValue * 1.05);

  const handleShareWhatsApp = async () => {
    const textMessage = `*REPORTE DE VALUACIÓN INMOBILIARIA Y ACM*\n\n` +
      `🏠 *Propiedad:* ${subject.title}\n` +
      `📍 *Ubicación:* ${subject.colonia}, ${subject.city}\n` +
      `📐 *Superficie:* ${subject.m2Construction} m² construcción\n\n` +
      `📊 *MATRIZ DE VALUACIÓN DE MERCADO:*\n` +
      `🔴 Venta Rápida (Liquidez): $${quickSaleValue.toLocaleString('es-MX')} MXN\n` +
      `🟢 *Valor Justo de Mercado:* $${targetMarketValue.toLocaleString('es-MX')} MXN\n` +
      `🔵 Máximo Negociable: $${maxNegotiableValue.toLocaleString('es-MX')} MXN\n\n` +
      `👤 *Asesor:* ${branding.fullName} (${branding.agencyName})\n` +
      `📱 *Contacto:* ${branding.phone}`;

    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: `Valuación - ${subject.title}`,
          text: textMessage,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled or error:', err);
      } finally {
        setIsSharing(false);
      }
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-950 text-white rounded-2xl p-5 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Dictamen de Valuación Comercial
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">Paso 5: Resumen Ejecutivo & PDF</h2>
        <p className="text-xs sm:text-sm text-slate-200 mt-1">
          Presentación ejecutiva de la matriz de precios homologada y exportación directa para el cliente.
        </p>
      </div>

      {/* Agent Header Badge */}
      <Card className="bg-[#1E3A8A] text-white border-none shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-contain bg-white p-1" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white text-lg">
                {branding.agencyName ? branding.agencyName.charAt(0) : 'A'}
              </div>
            )}
            <div>
              <h3 className="font-bold text-base">{branding.fullName}</h3>
              <p className="text-xs text-white/80">{branding.agencyName}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full text-emerald-300">
            {branding.licenseId || 'Asesor Certificado'}
          </span>
        </div>
      </Card>

      {/* 3-Tier Price Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1: Quick Sale */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="w-2 h-full bg-amber-500 absolute left-0 top-0" />
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <TrendingDown className="w-4 h-4" /> Venta Rápida (Liquidez)
          </div>
          <p className="text-2xl font-black text-slate-900">
            ${quickSaleValue.toLocaleString('es-MX')} <span className="text-xs font-medium text-slate-500">MXN</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Precio estimado para colocación acelerada en menos de 30 días (-5% vs valor justo).
          </p>
        </div>

        {/* Tier 2: Target Market Value (Fair Price) */}
        <div className="bg-gradient-to-br from-[#1E3A8A] to-blue-900 text-white rounded-2xl p-5 shadow-md space-y-2 relative overflow-hidden ring-4 ring-navy-100">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4" /> Valor Justo de Mercado
          </div>
          <p className="text-3xl font-black text-emerald-300">
            ${targetMarketValue.toLocaleString('es-MX')} <span className="text-xs font-medium text-slate-200">MXN</span>
          </p>
          <p className="text-xs text-slate-200">
            Precio objetivo homologado (${Math.round(homologatedAvgM2).toLocaleString('es-MX')}/m²).
          </p>
        </div>

        {/* Tier 3: Maximum Negotiable */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="w-2 h-full bg-blue-600 absolute left-0 top-0" />
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" /> Máximo Negociable
          </div>
          <p className="text-2xl font-black text-slate-900">
            ${maxNegotiableValue.toLocaleString('es-MX')} <span className="text-xs font-medium text-slate-500">MXN</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Techo máximo de negociación inicial (+5% para amortiguar contraofertas).
          </p>
        </div>
      </div>

      {/* Property Details Recap */}
      <Card title="Resumen General del Informe" subtitle={`Para el inmueble en ${subject.colonia}, ${subject.city}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Construcción:</span>
            <span className="font-bold text-slate-900 text-sm">{subject.m2Construction} m²</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Terreno:</span>
            <span className="font-bold text-slate-900 text-sm">{subject.m2Land} m²</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Muestra Mercado:</span>
            <span className="font-bold text-slate-900 text-sm">{validComparables.length} comparables</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Conservación:</span>
            <span className="font-bold text-emerald-700 text-sm capitalize">{subject.condition}</span>
          </div>
        </div>
      </Card>

      {/* Export Actions Card */}
      <Card title="Acciones y Compartición 1-Click" subtitle="Descarga el documento PDF oficial o compártelo directamente por WhatsApp">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {/* Download PDF Button */}
          <div className="sm:col-span-1">
            <PdfDownloadButton />
          </div>

          {/* Preview PDF Modal Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowPreviewModal(true)}
            icon={<Eye className="w-5 h-5 text-slate-600" />}
            fullWidth
          >
            Ver Previa del PDF
          </Button>

          {/* WhatsApp Share */}
          <Button
            variant="emerald"
            size="lg"
            onClick={handleShareWhatsApp}
            disabled={isSharing}
            icon={<MessageSquare className="w-5 h-5 text-white" />}
            fullWidth
          >
            Compartir por WhatsApp
          </Button>
        </div>
      </Card>

      {/* PDF Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Vista Previa de Dictamen PDF</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal PDF Viewer Body */}
            <div className="flex-1 bg-slate-100 p-2 overflow-hidden">
              <PDFViewer width="100%" height="100%" className="rounded-xl border border-slate-200">
                <ValuationPdfDocument
                  branding={branding}
                  subject={subject}
                  comparables={comparables}
                  homologation={homologation}
                />
              </PDFViewer>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">Documento listo para envío oficial</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowPreviewModal(false)}>
                  Cerrar
                </Button>
                <PdfDownloadButton fullWidth={false} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
