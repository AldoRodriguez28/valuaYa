import React from 'react';
import { useValuationStore } from './store/useValuationStore';
import { Header } from './components/layout/Header';
import { Stepper } from './components/layout/Stepper';
import { BottomActionBar } from './components/layout/BottomActionBar';
import { PWAInstallBanner } from './components/layout/PWAInstallBanner';
import { AgentBrandingStep } from './components/branding/AgentBrandingStep';
import { SubjectPropertyStep } from './components/property/SubjectPropertyStep';
import { ComparablesStep } from './components/comparables/ComparablesStep';
import { HomologationStep } from './components/homologation/HomologationStep';
import { ValuationSummaryStep } from './components/valuation/ValuationSummaryStep';

export function App() {
  const { currentStep } = useValuationStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AgentBrandingStep />;
      case 2:
        return <SubjectPropertyStep />;
      case 3:
        return <ComparablesStep />;
      case 4:
        return <HomologationStep />;
      case 5:
        return <ValuationSummaryStep />;
      default:
        return <AgentBrandingStep />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      {/* Top Header */}
      <Header />

      {/* PWA Mobile Install Banner */}
      <PWAInstallBanner />

      {/* Stepper Bar */}
      <Stepper />

      {/* Step View Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6">
        {renderStep()}
      </main>

      {/* Sticky Bottom Action Bar */}
      <BottomActionBar />
    </div>
  );
}

export default App;
