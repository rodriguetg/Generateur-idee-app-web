import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';
import { AppIdea } from '../types';

interface IdeaCustomizerProps {
  idea: AppIdea;
  onCustomizationComplete: (customizedIdea: AppIdea) => void;
  onBack: () => void;
}

const IdeaCustomizer: React.FC<IdeaCustomizerProps> = ({ idea, onCustomizationComplete, onBack }) => {
  const [customizedIdea, setCustomizedIdea] = useState<AppIdea>(idea);
  const [newFeature, setNewFeature] = useState('');
  const [newMonetization, setNewMonetization] = useState('');
  const [newTech, setNewTech] = useState('');

  const handleInputChange = (field: keyof AppIdea, value: any) => {
    setCustomizedIdea(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setCustomizedIdea(prev => ({
        ...prev,
        mainFeatures: [...prev.mainFeatures, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setCustomizedIdea(prev => ({
      ...prev,
      mainFeatures: prev.mainFeatures.filter((_, i) => i !== index)
    }));
  };

  const addMonetization = () => {
    if (newMonetization.trim()) {
      setCustomizedIdea(prev => ({
        ...prev,
        monetization: [...prev.monetization, newMonetization.trim()]
      }));
      setNewMonetization('');
    }
  };

  const removeMonetization = (index: number) => {
    setCustomizedIdea(prev => ({
      ...prev,
      monetization: prev.monetization.filter((_, i) => i !== index)
    }));
  };

  const addTech = () => {
    if (newTech.trim()) {
      setCustomizedIdea(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTech = (index: number) => {
    setCustomizedIdea(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Personnalisez votre idée</h3>
        
        <div className="space-y-6">
          {/* Titre et description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'application
              </label>
              <input
                type="text"
                value={customizedIdea.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public cible
              </label>
              <input
                type="text"
                value={customizedIdea.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={customizedIdea.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Paramètres du projet */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulté
              </label>
              <select
                value={customizedIdea.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée estimée
              </label>
              <input
                type="text"
                value={customizedIdea.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Potentiel marché (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={customizedIdea.marketPotential}
                onChange={(e) => handleInputChange('marketPotential', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Fonctionnalités */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Fonctionnalités principales
            </label>
            <div className="space-y-2 mb-3">
              {customizedIdea.mainFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700">{feature}</span>
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Nouvelle fonctionnalité"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <button
                onClick={addFeature}
                className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Monétisation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Modèles de monétisation
            </label>
            <div className="space-y-2 mb-3">
              {customizedIdea.monetization.map((model, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700">{model}</span>
                  <button
                    onClick={() => removeMonetization(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMonetization}
                onChange={(e) => setNewMonetization(e.target.value)}
                placeholder="Nouveau modèle"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addMonetization()}
              />
              <button
                onClick={addMonetization}
                className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Stack technique */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Stack technique
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {customizedIdea.techStack.map((tech, index) => (
                <div key={index} className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  <span className="text-sm">{tech}</span>
                  <button
                    onClick={() => removeTech(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Nouvelle technologie"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addTech()}
              />
              <button
                onClick={addTech}
                className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t mt-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-700 font-medium inline-flex items-center space-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </button>

          <button
            onClick={() => onCustomizationComplete(customizedIdea)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <span>Générer le cahier des charges</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default IdeaCustomizer;
