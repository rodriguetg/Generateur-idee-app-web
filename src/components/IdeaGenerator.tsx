import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, ArrowRight, Star, Clock, TrendingUp } from 'lucide-react';
import { ProjectIdea } from '../types';
import { ideaTemplates } from '../data/ideaTemplates';
import { faker } from '@faker-js/faker';

interface IdeaGeneratorProps {
  selectedCategory: string;
  onIdeaGenerated: (idea: ProjectIdea) => void;
}

const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ selectedCategory, onIdeaGenerated }) => {
  const [currentIdea, setCurrentIdea] = useState<ProjectIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIdea = () => {
    setIsGenerating(true);
    
    // Filtrer les templates par catégorie
    const categoryTemplates = ideaTemplates.filter(template => template.category === selectedCategory);
    
    setTimeout(() => {
      let selectedTemplate;
      if (categoryTemplates.length > 0) {
        selectedTemplate = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
      } else {
        // Fallback si pas de template pour cette catégorie
        selectedTemplate = ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)];
      }

      const idea: ProjectIdea = {
        id: faker.string.uuid(),
        title: selectedTemplate.title || 'Projet Innovant',
        description: selectedTemplate.description || 'Un projet révolutionnaire qui transforme l\'expérience utilisateur.',
        category: selectedTemplate.category || selectedCategory,
        targetAudience: selectedTemplate.targetAudience || 'Utilisateurs tech-savvy, 18-45 ans',
        mainFeatures: selectedTemplate.mainFeatures || ['Interface intuitive', 'Notifications push', 'Mode hors-ligne', 'Analytics intégrées'],
        monetization: selectedTemplate.monetization || ['Freemium', 'Publicité', 'Achats in-app'],
        techStack: selectedTemplate.techStack || ['React', 'Node.js', 'MongoDB', 'AWS'],
        difficulty: selectedTemplate.difficulty || 'Moyen',
        estimatedTime: selectedTemplate.estimatedTime || '4-6 mois',
        marketPotential: selectedTemplate.marketPotential || Math.floor(Math.random() * 40) + 60
      };

      setCurrentIdea(idea);
      setIsGenerating(false);
    }, 1500);
  };

  const handleAcceptIdea = () => {
    if (currentIdea) {
      onIdeaGenerated(currentIdea);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'text-green-600 bg-green-100';
      case 'Moyen': return 'text-yellow-600 bg-yellow-100';
      case 'Difficile': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <button
          onClick={generateIdea}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
        >
          <Shuffle className="h-5 w-5" />
          <span>{isGenerating ? 'Génération en cours...' : 'Générer une idée'}</span>
        </button>
      </div>

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-6 shadow-lg border"
        >
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-gray-300 rounded"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </motion.div>
      )}

      {currentIdea && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentIdea.title}</h3>
              <p className="text-gray-600 leading-relaxed">{currentIdea.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-800">Difficulté</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentIdea.difficulty)}`}>
                  {currentIdea.difficulty}
                </span>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Durée estimée</span>
                </div>
                <span className="text-gray-700">{currentIdea.estimatedTime}</span>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Potentiel marché</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${currentIdea.marketPotential}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{currentIdea.marketPotential}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Fonctionnalités principales</h4>
                <ul className="space-y-2">
                  {currentIdea.mainFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Modèles de monétisation</h4>
                <ul className="space-y-2">
                  {currentIdea.monetization.map((model, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{model}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Stack technique recommandé</h4>
              <div className="flex flex-wrap gap-2">
                {currentIdea.techStack.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={generateIdea}
                className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center space-x-1"
              >
                <Shuffle className="h-4 w-4" />
                <span>Générer une autre idée</span>
              </button>

              <button
                onClick={handleAcceptIdea}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>Utiliser cette idée</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IdeaGenerator;
