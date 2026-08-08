import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { AgentBranding, SubjectProperty, ComparableProperty, HomologationAdjustments } from '../../types';

interface ValuationPdfDocumentProps {
  branding: AgentBranding;
  subject: SubjectProperty;
  comparables: ComparableProperty[];
  homologation: HomologationAdjustments;
  dateStr?: string;
}

const CONSERVATION_FACTORS: Record<string, number> = {
  excellent: 1.05,
  good: 1.00,
  regular: 0.90,
  renovation: 0.80,
};

const CONSERVATION_LABELS: Record<string, string> = {
  excellent: 'Excelente (1.05)',
  good: 'Bueno (1.00)',
  regular: 'Regular (0.90)',
  renovation: 'Requiere Remodelación (0.80)',
};

export const ValuationPdfDocument: React.FC<ValuationPdfDocumentProps> = ({
  branding,
  subject,
  comparables,
  homologation,
  dateStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
}) => {
  const primaryColor = branding.primaryColor || '#1E3A8A';

  // Calculations
  const validComparables = comparables.filter((c) => c.m2Construction > 0 && c.price > 0);
  const subjectConservationFactor = CONSERVATION_FACTORS[subject.condition] || 1.0;

  const homologatedComparables = validComparables.map((comp) => {
    const rawPriceM2 = comp.price / comp.m2Construction;
    const surfaceFactor = Math.pow(subject.m2Construction / comp.m2Construction, homologation.surfaceExponent);
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

  const rawAvgPriceM2 = validComparables.length > 0
    ? validComparables.reduce((acc, c) => acc + c.price / c.m2Construction, 0) / validComparables.length
    : 0;

  const homologatedAvgM2 = homologatedComparables.length > 0
    ? homologatedComparables.reduce((acc, c) => acc + c.homologatedPriceM2, 0) / homologatedComparables.length
    : 0;

  const targetMarketValue = Math.round(homologatedAvgM2 * subject.m2Construction);
  const quickSaleValue = Math.round(targetMarketValue * 0.95);
  const maxNegotiableValue = Math.round(targetMarketValue * 1.05);

  const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: '#FFFFFF',
      fontSize: 9,
      fontFamily: 'Helvetica',
      color: '#1E293B',
    },
    headerBanner: {
      backgroundColor: primaryColor,
      padding: 15,
      borderRadius: 8,
      marginBottom: 12,
      color: '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    agentTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 2,
      color: '#FFFFFF',
    },
    agencySubtitle: {
      fontSize: 9.5,
      color: '#E2E8F0',
    },
    logoImage: {
      width: 45,
      height: 45,
      objectFit: 'contain',
      backgroundColor: '#FFFFFF',
      borderRadius: 6,
      padding: 3,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: primaryColor,
      borderBottomWidth: 1.5,
      borderBottomColor: primaryColor,
      paddingBottom: 3,
      marginTop: 10,
      marginBottom: 6,
      textTransform: 'uppercase',
    },
    grid2: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 8,
    },
    grid3: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 10,
    },
    card: {
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 6,
      padding: 8,
      flex: 1,
    },
    priceBox: {
      borderRadius: 6,
      padding: 9,
      flex: 1,
      alignItems: 'center',
    },
    priceBoxQuick: {
      backgroundColor: '#FEF3C7',
      borderColor: '#F59E0B',
      borderWidth: 1,
    },
    priceBoxTarget: {
      backgroundColor: primaryColor,
      color: '#FFFFFF',
    },
    priceBoxMax: {
      backgroundColor: '#EFF6FF',
      borderColor: '#3B82F6',
      borderWidth: 1,
    },
    labelSmall: {
      fontSize: 7,
      color: '#64748B',
      textTransform: 'uppercase',
      marginBottom: 2,
    },
    valueLarge: {
      fontSize: 13,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 2.5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#F1F5F9',
    },
    rowBold: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 3.5,
      borderTopWidth: 1,
      borderTopColor: '#CBD5E1',
      marginTop: 4,
      fontWeight: 'bold',
    },
    photoGalleryGrid: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 6,
      marginBottom: 6,
    },
    photoThumb: {
      width: 70,
      height: 50,
      objectFit: 'cover',
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: '#CBD5E1',
    },
    table: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 4,
      overflow: 'hidden',
      marginTop: 6,
      marginBottom: 8,
    },
    tableHeader: {
      backgroundColor: primaryColor,
      color: '#FFFFFF',
      flexDirection: 'row',
      padding: 5,
      fontWeight: 'bold',
      fontSize: 7.5,
    },
    tableRow: {
      flexDirection: 'row',
      padding: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: '#E2E8F0',
      alignItems: 'center',
    },
    tableRowEven: {
      backgroundColor: '#F8FAFC',
    },
    colTitle: { flex: 2.5 },
    colPrice: { flex: 2, textAlign: 'right' },
    colM2: { flex: 1.5, textAlign: 'right' },
    colM2Price: { flex: 2, textAlign: 'right' },
    colFactor: { flex: 2, textAlign: 'right' },
    disclaimerText: {
      fontSize: 7,
      color: '#94A3B8',
      textAlign: 'center',
      marginTop: 12,
      borderTopWidth: 0.5,
      borderTopColor: '#E2E8F0',
      paddingTop: 4,
    },
    footer: {
      position: 'absolute',
      bottom: 18,
      left: 30,
      right: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 7.5,
      color: '#94A3B8',
      borderTopWidth: 0.5,
      borderTopColor: '#E2E8F0',
      paddingTop: 4,
    },
    signatureBlock: {
      marginTop: 16,
      alignItems: 'center',
    },
    signatureLine: {
      width: 170,
      borderTopWidth: 1,
      borderTopColor: '#64748B',
      marginTop: 24,
      marginBottom: 3,
    },
  });

  return (
    <Document title={`Valuacion_${subject.title.replace(/\s+/g, '_')}`} author={branding.fullName}>
      {/* PAGE 1: Executive Summary & Property Details */}
      <Page size="A4" style={styles.page}>
        {/* Header Banner */}
        <View style={styles.headerBanner}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.agentTitle}>{branding.fullName || 'Asesor Inmobiliario'}</Text>
            <Text style={styles.agencySubtitle}>
              {branding.agencyName} {branding.licenseId ? `| ${branding.licenseId}` : ''}
            </Text>
            <Text style={{ fontSize: 7.5, color: '#E2E8F0', marginTop: 2 }}>
              Tel: {branding.phone} | WA: {branding.whatsapp} | Email: {branding.email}
            </Text>
          </View>
          {branding.logoUrl && (
            <Image src={branding.logoUrl} style={styles.logoImage} />
          )}
        </View>

        {/* Title */}
        <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: primaryColor }}>
              DICTAMEN DE VALUACIÓN Y ANÁLISIS COMPARATIVO DE MERCADO
            </Text>
            <Text style={{ fontSize: 8, color: '#64748B' }}>
              Inmueble: {subject.title} | Fecha: {dateStr}
            </Text>
          </View>
        </View>

        {/* 3-Tier Price Matrix */}
        <Text style={styles.sectionTitle}>MATRIZ DE VALOR COMERCIAL DE MERCADO</Text>
        <View style={styles.grid3}>
          {/* Quick Sale */}
          <View style={[styles.priceBox, styles.priceBoxQuick]}>
            <Text style={[styles.labelSmall, { color: '#B45309' }]}>VENTA RÁPIDA (LIQUIDEZ &lt;30 DÍAS)</Text>
            <Text style={[styles.valueLarge, { color: '#92400E' }]}>
              ${quickSaleValue.toLocaleString('es-MX')} MXN
            </Text>
            <Text style={{ fontSize: 6.5, color: '#B45309', textAlign: 'center' }}>
              Base de colocación acelerada (-5%)
            </Text>
          </View>

          {/* Target Fair Market Value */}
          <View style={[styles.priceBox, styles.priceBoxTarget]}>
            <Text style={[styles.labelSmall, { color: '#A7F3D0' }]}>VALOR JUSTO DE MERCADO</Text>
            <Text style={[styles.valueLarge, { color: '#6EE7B7' }]}>
              ${targetMarketValue.toLocaleString('es-MX')} MXN
            </Text>
            <Text style={{ fontSize: 6.5, color: '#E2E8F0', textAlign: 'center' }}>
              Homologación: ${Math.round(homologatedAvgM2).toLocaleString('es-MX')}/m²
            </Text>
          </View>

          {/* Max Negotiable */}
          <View style={[styles.priceBox, styles.priceBoxMax]}>
            <Text style={[styles.labelSmall, { color: '#1D4ED8' }]}>MÁXIMO NEGOCIABLE</Text>
            <Text style={[styles.valueLarge, { color: '#1E40AF' }]}>
              ${maxNegotiableValue.toLocaleString('es-MX')} MXN
            </Text>
            <Text style={{ fontSize: 6.5, color: '#1D4ED8', textAlign: 'center' }}>
              Techo de negociación (+5%)
            </Text>
          </View>
        </View>

        {/* Subject Property Characteristics */}
        <Text style={styles.sectionTitle}>ESPECIFICACIONES DE LA PROPIEDAD SUJETO</Text>
        <View style={styles.grid2}>
          <View style={styles.card}>
            <Text style={{ fontWeight: 'bold', fontSize: 8.5, marginBottom: 3, color: primaryColor }}>
              Ubicación del Inmueble
            </Text>
            <View style={styles.row}>
              <Text style={{ color: '#64748B' }}>Dirección:</Text>
              <Text style={{ fontWeight: 'bold' }}>{subject.address || 'No especificada'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ color: '#64748B' }}>Colonia / Zona:</Text>
              <Text style={{ fontWeight: 'bold' }}>{subject.colonia}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ color: '#64748B' }}>Ciudad / Estado:</Text>
              <Text style={{ fontWeight: 'bold' }}>{subject.city}, {subject.state}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ color: '#64748B' }}>Tipo de Inmueble:</Text>
              <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{subject.propertyType}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={{ fontWeight: 'bold', fontSize: 8.5, marginBottom: 3, color: primaryColor }}>
              Distribución Físico-Constructiva
            </Text>
            <View style={styles.row}>
              <Text style={{ color: '#64748B' }}>Superficie Construcción:</Text>
              <Text style={{ fontWeight: 'bold' }}>{subject.m2Construction} m²</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ color: '#64748B' }}>Superficie Terreno:</Text>
              <Text style={{ fontWeight: 'bold' }}>{subject.m2Land} m²</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ color: '#64748B' }}>Recámaras / Baños:</Text>
              <Text style={{ fontWeight: 'bold' }}>{subject.bedrooms} Rec. | {subject.bathrooms} Baños</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ color: '#64748B' }}>Estado Conservación:</Text>
              <Text style={{ fontWeight: 'bold' }}>{CONSERVATION_LABELS[subject.condition] || subject.condition}</Text>
            </View>
          </View>
        </View>

        {/* Photo Gallery inside PDF */}
        {subject.photos && subject.photos.length > 0 && (
          <View style={{ marginTop: 4, marginBottom: 4 }}>
            <Text style={{ fontSize: 8, fontWeight: 'bold', color: primaryColor, marginBottom: 3 }}>
              Registro Fotográfico del Inmueble Sujeto:
            </Text>
            <View style={styles.photoGalleryGrid}>
              {subject.photos.slice(0, 4).map((photo, pIdx) => (
                <Image key={pIdx} src={photo} style={styles.photoThumb} />
              ))}
            </View>
          </View>
        )}

        {/* Amenities */}
        {subject.amenities && subject.amenities.length > 0 && (
          <View style={[styles.card, { marginTop: 4 }]}>
            <Text style={{ fontWeight: 'bold', color: primaryColor, marginBottom: 2, fontSize: 8 }}>
              Amenidades e Insumos Destacados:
            </Text>
            <Text style={{ fontSize: 7.5, color: '#334155' }}>
              {subject.amenities.join(' • ')}
            </Text>
          </View>
        )}

        {/* Footer Page 1 */}
        <View style={styles.footer} fixed>
          <Text>ValuaYa PWA - Reporte de Análisis Comparativo de Mercado</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* PAGE 2: Comparables Table & Homologation Breakdown */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginBottom: 6 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: primaryColor }}>
            MUESTRA DE MERCADO & HOMOLOGACIÓN TÉCNICA DE FACTORES
          </Text>
          <Text style={{ fontSize: 7.5, color: '#64748B' }}>
            Comparables analizados en la misma zona o micro-mercado homogéneo.
          </Text>
        </View>

        {/* Comparables Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colTitle}>Inmueble Comparable</Text>
            <Text style={styles.colPrice}>Precio Oferta</Text>
            <Text style={styles.colM2}>m² Const.</Text>
            <Text style={styles.colM2Price}>$/m² Oferta</Text>
            <Text style={styles.colFactor}>Factor Homol.</Text>
            <Text style={styles.colM2Price}>$/m² Homologado</Text>
          </View>

          {homologatedComparables.map((comp, i) => (
            <View key={comp.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowEven : {}]}>
              <View style={[styles.colTitle, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                {comp.photoUrl && (
                  <Image src={comp.photoUrl} style={{ width: 20, height: 16, borderRadius: 2, objectFit: 'cover' }} />
                )}
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 7.5 }}>{comp.title}</Text>
                  <Text style={{ fontSize: 6.5, color: '#64748B' }}>{comp.colonia}</Text>
                </View>
              </View>
              <Text style={styles.colPrice}>${comp.price.toLocaleString('es-MX')}</Text>
              <Text style={styles.colM2}>{comp.m2Construction} m²</Text>
              <Text style={styles.colM2Price}>${Math.round(comp.rawPriceM2).toLocaleString('es-MX')}</Text>
              <Text style={styles.colFactor}>{comp.totalFactor.toFixed(3)}x</Text>
              <Text style={[styles.colM2Price, { fontWeight: 'bold', color: '#059669' }]}>
                ${Math.round(comp.homologatedPriceM2).toLocaleString('es-MX')}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary Averages */}
        <View style={styles.card}>
          <Text style={{ fontWeight: 'bold', fontSize: 8.5, marginBottom: 3, color: primaryColor }}>
            Resumen de Homologación de Mercado
          </Text>
          <View style={styles.row}>
            <Text style={{ color: '#64748B' }}>Promedio Bruto por m² (Sin Ajustar):</Text>
            <Text style={{ fontWeight: 'bold' }}>${Math.round(rawAvgPriceM2).toLocaleString('es-MX')} MXN/m²</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: '#64748B' }}>Factor Exponente Superficie Aplicado:</Text>
            <Text style={{ fontWeight: 'bold' }}>{homologation.surfaceExponent} (Estándar Valuación)</Text>
          </View>
          <View style={styles.rowBold}>
            <Text style={{ color: primaryColor }}>Promedio Homologado Ponderado por m²:</Text>
            <Text style={{ color: '#059669', fontSize: 9.5 }}>${Math.round(homologatedAvgM2).toLocaleString('es-MX')} MXN/m²</Text>
          </View>
        </View>

        {/* Signature & Disclaimer Block */}
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text style={{ fontWeight: 'bold', fontSize: 9.5, color: primaryColor }}>
            {branding.fullName || 'Asesor Inmobiliario Responsable'}
          </Text>
          <Text style={{ fontSize: 7.5, color: '#64748B' }}>{branding.agencyName}</Text>
          {branding.licenseId && (
            <Text style={{ fontSize: 7, color: '#059669', marginTop: 1 }}>{branding.licenseId}</Text>
          )}
        </View>

        <Text style={styles.disclaimerText}>
          Este documento es un Análisis Comparativo de Mercado (ACM) elaborado por el asesor profesional mencionado para determinar el rango estimado de comercialización. No constituye un dictamen de avalúo hipotecario oficial emitido por Unidad de Valuación autorizada SHF. Vigencia recomendada: 180 días.
        </Text>

        {/* Footer Page 2 */}
        <View style={styles.footer} fixed>
          <Text>ValuaYa PWA - Reporte de Análisis Comparativo de Mercado</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
