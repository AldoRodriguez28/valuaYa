import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ValuationState, AgentBranding, SubjectProperty, HomologationAdjustments, StepNumber, SavedValuationProject } from '../types';

const defaultBranding: AgentBranding = {
  fullName: 'Carlos Mendoza',
  agencyName: 'Mendoza Inmobiliaria Premier',
  phone: '55 1234 5678',
  whatsapp: '525512345678',
  email: 'carlos@mendozainmobiliaria.com',
  slogan: 'Asesoría experta para vender tu propiedad al mejor precio de mercado.',
  logoUrl: null,
  primaryColor: '#1E3A8A',
  licenseId: 'REG-MX-84920',
};

const defaultSubject: SubjectProperty = {
  title: 'Casa Residencia Polanco',
  propertyType: 'casa',
  address: 'Calle Anatole France 120',
  colonia: 'Polanco III Sección',
  city: 'Ciudad de México',
  state: 'CDMX',
  m2Land: 250,
  m2Construction: 310,
  bedrooms: 3,
  bathrooms: 3,
  halfBathrooms: 1,
  parkingSpaces: 2,
  condition: 'good',
  ageYears: 8,
  amenities: ['Seguridad 24/7', 'Terraza', 'Jardín privado'],
  notes: 'Excelente estado de conservación, acabados en mármol y madera de nogal.',
  photos: [],
};

const defaultHomologation: HomologationAdjustments = {
  surfaceExponent: 0.12,
  customLocationFactor: 1.0,
};

export const useValuationStore = create<ValuationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      branding: defaultBranding,
      subject: defaultSubject,
      comparables: [
        {
          id: 'comp-1',
          title: 'Casa Anatole France 180',
          price: 12500000,
          m2Construction: 295,
          m2Land: 240,
          bedrooms: 3,
          bathrooms: 3,
          condition: 'good',
          colonia: 'Polanco III Sección',
          notes: 'Propiedad muy similar, vendida recientemente.',
        },
        {
          id: 'comp-2',
          title: 'Residencia Campos Elíseos',
          price: 13800000,
          m2Construction: 330,
          m2Land: 260,
          bedrooms: 4,
          bathrooms: 4,
          condition: 'excellent',
          colonia: 'Polanco III Sección',
          notes: 'Remodelada totalmente hace 2 años.',
        },
        {
          id: 'comp-3',
          title: 'Casa Tennyson',
          price: 11200000,
          m2Construction: 280,
          m2Land: 220,
          bedrooms: 3,
          bathrooms: 2.5,
          condition: 'regular',
          colonia: 'Polanco IV Sección',
          notes: 'Requiere actualización de baños y cocina.',
        },
      ],
      homologation: defaultHomologation,
      savedProjects: [],

      setStep: (step: StepNumber) => set({ currentStep: step }),
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 5) {
          set({ currentStep: (currentStep + 1) as StepNumber });
        }
      },
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: (currentStep - 1) as StepNumber });
        }
      },
      updateBranding: (data) =>
        set((state) => ({
          branding: { ...state.branding, ...data },
        })),
      updateSubject: (data) =>
        set((state) => ({
          subject: { ...state.subject, ...data },
        })),
      addComparable: (comp) =>
        set((state) => ({
          comparables: [
            ...state.comparables,
            { ...comp, id: `comp-${Date.now()}` },
          ],
        })),
      updateComparable: (id, data) =>
        set((state) => ({
          comparables: state.comparables.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),
      removeComparable: (id) =>
        set((state) => ({
          comparables: state.comparables.filter((c) => c.id !== id),
        })),
      updateHomologation: (data) =>
        set((state) => ({
          homologation: { ...state.homologation, ...data },
        })),
      resetDraft: () =>
        set({
          currentStep: 1,
          subject: defaultSubject,
        }),
      saveCurrentProject: (customTitle) => {
        const { subject, comparables, homologation, savedProjects } = get();
        const projectTitle = customTitle || subject.title || 'Avalúo sin título';

        // Calculate target market value
        const validComps = comparables.filter((c) => c.m2Construction > 0 && c.price > 0);
        const avgM2 = validComps.length > 0
          ? validComps.reduce((acc, c) => acc + c.price / c.m2Construction, 0) / validComps.length
          : 0;
        const targetValue = Math.round(avgM2 * subject.m2Construction);

        const newProject: SavedValuationProject = {
          id: `proj-${Date.now()}`,
          createdAt: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }),
          updatedAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
          title: projectTitle,
          subject,
          comparables,
          homologation,
          targetMarketValue: targetValue,
        };

        set({
          savedProjects: [newProject, ...savedProjects.filter((p) => p.title !== projectTitle)],
        });
      },
      loadProject: (id) => {
        const { savedProjects } = get();
        const found = savedProjects.find((p) => p.id === id);
        if (found) {
          set({
            subject: found.subject,
            comparables: found.comparables,
            homologation: found.homologation,
            currentStep: 2,
          });
        }
      },
      deleteProject: (id) =>
        set((state) => ({
          savedProjects: state.savedProjects.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'valuaya-agent-draft-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
