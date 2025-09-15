import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, ArrowRight, Star, Clock, TrendingUp, Brain, Sparkles } from 'lucide-react';
import { AppIdea, ApiConfig } from '../types';
import { ideaTemplates } from '../data/ideaTemplates';
import { aiService } from '../services/aiService';
import { faker } from '@faker-js/faker';
import AIInsights from './AIInsights';
import { parseJsonFromResponse } from '../utils/jsonParser';

interface EnhancedIdeaGeneratorProps {
  selectedCategory: string;
  onIdeaGenerated: (idea: AppIdea) => void;
  apiConfig: ApiConfig;
}

const EnhancedIdeaGenerator: React.FC<EnhancedIdeaGeneratorProps> = ({ selectedCategory, onIdeaGenerated, apiConfig }) => {
  const [currentIdea, setCurrentIdea] = useState<AppIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [preferences, setPreferences] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [complexity, setComplexity] = useState('Moyen');

  const generateAIIdea = async () => {
    setIsGenerating(true);
    setCurrentIdea(null);
    
    const prompt = `
    Génère une idée d'application web innovante pour la catégorie "${selectedCategory}".
    
    Contraintes:
    - Public cible: ${targetAudience || 'Utilisateurs génériques'}
    - Complexité: ${complexity || 'Moyenne'}
    - Préférences: ${preferences || 'Aucune'}
    
    Réponds au format JSON strict, sans texte d'introduction ni conclusion, uniquement l'objet JSON:
    {
      "title": "Titre accrocheur",
      "description": "Description détaillée (100-150 mots)",
      "targetAudience": "Public cible précis",
      "mainFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
      "monetization": ["Modèle 1", "Modèle 2", "Modèle 3"],
      "techStack": ["Tech 1", "Tech 2", "Tech 3", "Tech 4"],
      "difficulty": "Facile|Moyen|Difficile",
      "estimatedTime": "X-Y mois",
      "marketPotential": "nombre_entre_60_et_100"
    }
    `;

    try {
      const response = await aiService.generate({ prompt, config: apiConfig, isJson: true });

      if (response.success && response.content) {
        const aiIdea = parseJsonFromResponse<any>(response.content);
        
        if (aiIdea) {
          const idea: AppIdea = {
            id: faker.string.uuid(),
            title: aiIdea.title || 'Titre non généré',
            description: aiIdea.description || 'Description non générée',
            category: selectedCategory,
            targetAudience: aiIdea.targetAudience || 'Public non défini',
            mainFeatures: aiIdea.mainFeatures || [],
            monetization: aiIdea.monetization || [],
            techStack: aiIdea.techStack || [],
            difficulty: aiIdea.difficulty || 'Moyen',
            estimatedTime: aiIdea.estimatedTime || 'Indéfini',
            marketPotential: Number(aiIdea.marketPotential) || 75
          };
          setCurrentIdea(idea);
        } else {
          console.error("Échec de l'analyse de la réponse JSON de l'IA pour l'idée.");
          generateClassicIdea();
        }
      } else {
        generateClassicIdea();
      }
    } catch (error) {
      console.error('Erreur génération IA:', error);
      generateClassicIdea();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateClassicIdea = () => {
    setIsGenerating(true);
    setCurrentIdea(null);
    
    setTimeout(() => {
      const categoryTemplates = ideaTemplates.filter(template => template.category === selectedCategory);
      let selectedTemplate;
      
      if (categoryTemplates.length > 0) {
        selectedTemplate = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
      } else {
        selectedTemplate = ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)];
      }

      const idea: AppIdea = {
        id: faker.string.uuid(),
        title: selectedTemplate.title || 'Application Innovante',
        description: selectedTemplate.description || 'Une application révolutionnaire qui transforme l\'expérience utilisateur.',
        category: selectedTemplate.category || selectedCategory,
        targetAudience: targetAudience || selectedTemplate.targetAudience || 'Utilisateurs tech-savvy, 18-45 ans',
        mainFeatures: selectedTemplate.mainFeatures || ['Interface intuitive', 'Notifications push', 'Mode hors-ligne', 'Analytics intégrées'],
        monetization: selectedTemplate.monetization || ['Freemium', 'Publicité', 'Achats in-app'],
        techStack: selectedTemplate.techStack || ['React', 'Node.js', 'MongoDB', 'AWS'],
        difficulty: complexity as 'Facile' | 'Moyen' | 'Difficile',
        estimatedTime: selectedTemplate.estimatedTime || '4-6 mois',
        marketPotential: selectedTemplate.marketPotential || Math.floor(Math.random() * 40) + 60
      };

      setCurrentIdea(idea);
      setIsGenerating(false);
    }, 1500);
  };

  const generateIdea = () => {
    if (useAI) {
      generateAIIdea();
    } else {
      generateClassicIdea();
    }
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
      {/* Configuration de génération */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-4">Configuration de génération</h4>
        
        <div className="space-y-4">
          {/* Toggle IA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-700">Génération par IA</span>
              {useAI && <Sparkles className="h-4 w-4 text-yellow-500" />}
            </div>
            <button
              onClick={() => setUseAI(!useAI)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useAI ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useAI ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Options avancées pour IA */}
          {useAI && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Public cible préféré
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="ex: Entrepreneurs, étudiants..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau de complexité
                  </label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Facile">Facile - MVP simple</option>
                    <option value="Moyen">Moyen - Fonctionnalités avancées</option>
                    <option value="Difficile">Difficile - Solution complexe</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Préférences particulières
                </label>
                <textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="ex: Focus sur l'accessibilité, intégration blockchain, approche mobile-first..."
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bouton de génération */}
      <div className="text-center">
        <button
          onClick={generateIdea}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
        >
          {useAI ? <Brain className="h-5 w-5" /> : <Shuffle className="h-5 w-5" />}
          <span>
            {isGenerating 
              ? (useAI ? 'Génération IA en cours...' : 'Génération en cours...') 
              : (useAI ? 'Générer avec IA' : 'Générer une idée')
            }
          </span>
        </button>
      </div>

      {/* Animation de chargement */}
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

      {/* Idée générée */}
      {currentIdea && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentIdea.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{currentIdea.description}</p>
                </div>
                {useAI && (
                  <div className="flex items-center space-x-1 bg-purple-50 px-3 py-1 rounded-full">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Généré par IA</span>
                  </div>
                )}
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
                  {useAI ? <Brain className="h-4 w-4" /> : <Shuffle className="h-4 w-4" />}
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
          </div>

          {/* Insights IA */}
          {useAI && currentIdea && (
            <AIInsights idea={currentIdea} apiConfig={apiConfig} />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedIdeaGenerator;
