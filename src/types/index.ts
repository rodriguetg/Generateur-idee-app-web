export interface AppIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAudience: string;
  mainFeatures: string[];
  monetization: string[];
  techStack: string[];
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  estimatedTime: string;
  marketPotential: number;
}

export interface Specifications {
  id: string;
  appIdea: AppIdea;
  projectOverview: string;
  objectives: string[];
  scope: {
    included: string[];
    excluded: string[];
  };
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  userStories: UserStory[];
  technicalArchitecture: TechnicalArchitecture;
  timeline: Phase[];
  budget: BudgetEstimate;
  risks: Risk[];
  acceptance: AcceptanceCriteria[];
}

export interface FunctionalRequirement {
  id: string;
  title: string;
  description: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  complexity: 'Simple' | 'Modérée' | 'Complexe';
}

export interface NonFunctionalRequirement {
  id: string;
  category: string;
  requirement: string;
  target: string;
}

export interface UserStory {
  id: string;
  persona: string;
  story: string;
  acceptance: string[];
  priority: 'Haute' | 'Moyenne' | 'Basse';
}

export interface TechnicalArchitecture {
  frontend: string[];
  backend: string[];
  database: string[];
  hosting: string[];
  thirdParty: string[];
}

export interface Phase {
  name: string;
  duration: string;
  deliverables: string[];
  resources: string[];
}

export interface BudgetEstimate {
  development: number;
  design: number;
  testing: number;
  deployment: number;
  maintenance: number;
  total: number;
}

export interface Risk {
  id: string;
  description: string;
  probability: 'Faible' | 'Moyenne' | 'Élevée';
  impact: 'Faible' | 'Moyen' | 'Élevé';
  mitigation: string;
}

export interface AcceptanceCriteria {
  id: string;
  criterion: string;
  method: string;
}

export type AIProvider = 'openai' | 'gemini' | 'deepseek' | 'openrouter';

export interface ApiConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}
