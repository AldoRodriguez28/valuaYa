import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { ValuationPdfDocument } from './ValuationPdfDocument';
import { useValuationStore } from '../../store/useValuationStore';
import { Button } from '../ui/Button';

interface PdfDownloadButtonProps {
  className?: string;
  fullWidth?: boolean;
}

export const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({
  className = '',
  fullWidth = true,
}) => {
  const { branding, subject, comparables, homologation } = useValuationStore();

  const fileName = `Valuacion_${(subject.title || 'Inmueble').replace(/\s+/g, '_')}.pdf`;

  return (
    <PDFDownloadLink
      document={
        <ValuationPdfDocument
          branding={branding}
          subject={subject}
          comparables={comparables}
          homologation={homologation}
        />
      }
      fileName={fileName}
      style={{ textDecoration: 'none', width: fullWidth ? '100%' : 'auto' }}
    >
      {({ loading, error }) => (
        <Button
          variant="primary"
          size="lg"
          disabled={loading}
          icon={
            loading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-white" />
            )
          }
          fullWidth={fullWidth}
          className={`${className}`}
        >
          {loading ? 'Generando PDF Oficial...' : 'Descargar PDF Oficial'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
