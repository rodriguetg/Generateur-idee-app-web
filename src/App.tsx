import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import CategorySelector from './components/CategorySelector';
import EnhancedIdeaGenerator from './components/EnhancedIdeaGenerator';
import IdeaCustomizer from './components/IdeaCustomizer';
import SpecificationViewer from './components/SpecificationViewer';
import PromptGenerator from './components/PromptGenerator';
import AIAssistant from './components/AIAssistant';
import SettingsModal from './components/SettingsModal';
import { ProjectIdea, Specifications, ApiConfig } from './types';
import { generateSpecifications } from './utils/specificationGenerator';

type Step = 'category' | 'generate' | 'customize' | 'specifications' | 'prompt';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [generatedIdea, setGeneratedIdea] = useState<ProjectIdea | null>(null);
  const [specifications, setSpecifications] = useState<Specifications | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    try {
      const saved = localStorage.getItem('apiConfig');
      return saved ? JSON.parse(saved) : { provider: 'openai', apiKey: '', model: 'gpt-3.5-turbo' };
    } catch {
      return { provider: 'openai', apiKey: '', model: 'gpt-3.5-turbo' };
    }
  });

  const handleSaveApiConfig = (newConfig: ApiConfig) => {
    setApiConfig(newConfig);
    localStorage.setItem('apiConfig', JSON.stringify(newConfig));
    setIsSettingsOpen(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep('generate');
  };

  const handleIdeaGenerated = (idea: ProjectIdea) => {
    setGeneratedIdea(idea);
    setCurrentStep('customize');
  };

  const handleCustomizationComplete = (customizedIdea: ProjectIdea) => {
    const specs = generateSpecifications(customizedIdea);
    setSpecifications(specs);
    setCurrentStep('specifications');
  };
  
  const handleSpecsComplete = () => {
    setCurrentStep('prompt');
  };

  const handleBackToCategory = () => {
    setCurrentStep('category');
    setSelectedCategory(null);
    setGeneratedIdea(null);
    setSpecifications(null);
  };

  const handleBackToGenerate = () => {
    setCurrentStep('generate');
    setGeneratedIdea(null);
  };

  const handleBackToCustomize = () => {
    setCurrentStep('customize');
    setSpecifications(null);
  };

  const handleBackToSpecs = () => {
    setCurrentStep('specifications');
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'category': case 'generate': return 0;
      case 'customize': return 1;
      case 'specifications': return 2;
      case 'prompt': return 3;
      default: return 0;
    }
  };

  const getAIContext = () => ({
    step: currentStep,
    idea: generatedIdea,
    category: selectedCategory
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentStep={getStepNumber()} onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'category' && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Choisissez une catégorie de projet
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Sélectionnez le domaine qui vous intéresse pour générer des idées de projets numériques innovants avec l'IA
                </p>
              </div>
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </motion.div>
          )}

          {currentStep === 'generate' && selectedCategory && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Générez votre idée de projet
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Découvrez des concepts innovants générés par IA pour votre prochain projet numérique
                </p>
                <button
                  onClick={handleBackToCategory}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  ← Changer de catégorie
                </button>
              </div>
              <EnhancedIdeaGenerator
                selectedCategory={selectedCategory}
                onIdeaGenerated={handleIdeaGenerated}
                apiConfig={apiConfig}
              />
            </motion.div>
          )}

          {currentStep === 'customize' && generatedIdea && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Personnalisez votre projet
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Adaptez l'idée générée selon vos besoins et préférences
                </p>
              </div>
              <IdeaCustomizer
                idea={generatedIdea}
                onCustomizationComplete={handleCustomizationComplete}
                onBack={handleBackToGenerate}
              />
            </motion.div>
          )}

          {currentStep === 'specifications' && specifications && (
            <motion.div
              key="specifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SpecificationViewer
                specifications={specifications}
                onBack={handleBackToCustomize}
                onNext={handleSpecsComplete}
              />
            </motion.div>
          )}

          {currentStep === 'prompt' && specifications && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PromptGenerator
                specifications={specifications}
                onBack={handleBackToSpecs}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Assistant IA */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
        context={getAIContext()}
        apiConfig={apiConfig}
      />
      
      {/* Modale de configuration */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveApiConfig}
        currentConfig={apiConfig}
      />
    </div>
  );
}

export default App;
