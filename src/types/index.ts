export type PropertyCondition = 'excellent' | 'good' | 'regular' | 'renovation';

export interface AgentBranding {
  fullName: string;
  agencyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  slogan: string;
  logoUrl: string | null;
  primaryColor: string; // Hex color string, e.g. '#1E3A8A'
  licenseId?: string; // Cédula o Registro Inmobiliario
}

export interface SubjectProperty {
  title: string;
  propertyType: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina';
  address: string;
  colonia: string;
  city: string;
  state: string;
  m2Land: number;
  m2Construction: number;
  bedrooms: number;
  bathrooms: number;
  halfBathrooms: number;
  parkingSpaces: number;
  condition: PropertyCondition;
  ageYears: number;
  amenities: string[];
  notes: string;
  photos: string[];
}

export interface ComparableProperty {
  id: string;
  title: string;
  price: number; // In MXN
  m2Construction: number;
  m2Land: number;
  bedrooms: number;
  bathrooms: number;
  condition: PropertyCondition;
  colonia: string;
  sourceUrl?: string;
  photoUrl?: string;
  notes?: string;
}

export interface HomologationAdjustments {
  surfaceExponent: number; // Default 0.12
  customLocationFactor: number; // Default 1.0 (0.85 to 1.15)
}

export interface SavedValuationProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  subject: SubjectProperty;
  comparables: ComparableProperty[];
  homologation: HomologationAdjustments;
  targetMarketValue: number;
}

export type StepNumber = 1 | 2 | 3 | 4 | 5;

export interface ValuationState {
  currentStep: StepNumber;
  branding: AgentBranding;
  subject: SubjectProperty;
  comparables: ComparableProperty[];
  homologation: HomologationAdjustments;
  savedProjects: SavedValuationProject[];
  // Actions
  setStep: (step: StepNumber) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateBranding: (data: Partial<AgentBranding>) => void;
  updateSubject: (data: Partial<SubjectProperty>) => void;
  addComparable: (comp: Omit<ComparableProperty, 'id'>) => void;
  updateComparable: (id: string, data: Partial<ComparableProperty>) => void;
  removeComparable: (id: string) => void;
  updateHomologation: (data: Partial<HomologationAdjustments>) => void;
  resetDraft: () => void;
  saveCurrentProject: (title?: string) => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
}
