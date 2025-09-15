import React from 'react';
import { Lightbulb, Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentStep, onOpenSettings }) => {
  const steps = [
    'Génération d\'idée',
    'Personnalisation',
    'Cahier des charges',
    'Prompt Vibe Coding'
  ];

  return (
    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Lightbulb className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Générateur de Projets</h1>
              <p className="text-blue-100">Créez votre prochain projet numérique innovant</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Sparkles className="h-8 w-8 text-yellow-300" />
            <button onClick={onOpenSettings} className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center flex-shrink-0">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${index <= currentStep 
                  ? 'bg-white text-purple-600' 
                  : 'bg-white/20 text-white/70'
                }
              `}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm whitespace-nowrap ${index <= currentStep ? 'text-white' : 'text-white/70'}`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`mx-4 h-0.5 w-8 flex-shrink-0 ${index < currentStep ? 'bg-white' : 'bg-white/20'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
