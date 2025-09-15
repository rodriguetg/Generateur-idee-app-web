import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { ProjectIdea, ApiConfig } from '../types';
import { aiService } from '../services/aiService';
import { parseJsonFromResponse } from '../utils/jsonParser';

interface AIInsightsProps {
  idea: ProjectIdea;
  apiConfig: ApiConfig;
  onInsightsReady?: (insights: any) => void;
}

const AIInsights: React.FC<AIInsightsProps> = ({ idea, apiConfig, onInsightsReady }) => {
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [personas, setPersonas] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (idea && apiConfig.apiKey) {
      generateInsights();
    } else if (idea && !apiConfig.apiKey) {
        setError("Veuillez configurer votre clé API pour générer les analyses IA.");
    }
  }, [idea, apiConfig]);

  const generateInsights = async () => {
    setIsLoading(true);
    setInsights(null);
    setPersonas(null);
    setError(null);
    
    const analysisPrompt = `
    Analyse cette idée de projet et fournis des insights.
    Idée: "${idea.title}: ${idea.description}"
    Catégorie: "${idea.category}"

    Réponds EXCLUSIVEMENT avec un objet JSON valide. Ne fournis aucun texte avant ou après le JSON.
    Le JSON doit être parfaitement formaté. Chaque chaîne de caractères dans un tableau DOIT être entre doubles guillemets.
    
    Format attendu:
    {
      "marketAnalysis": "Analyse du marché (50 mots)",
      "competitors": ["Concurrent 1", "Concurrent 2", "Concurrent 3"],
      "opportunities": ["Opportunité 1", "Opportunité 2"],
      "challenges": ["Défi 1", "Défi 2"],
      "recommendations": ["Conseil 1", "Conseil 2", "Conseil 3"],
      "score": "nombre_entre_1_et_100"
    }
    `;

    const personasPrompt = `
    Crée 3 personas utilisateurs détaillés pour ce projet.
    "${idea.title}: ${idea.description}"

    Réponds EXCLUSIVEMENT avec un objet JSON valide. Ne fournis aucun texte avant ou après le JSON.
    Le JSON doit être parfaitement formaté. Chaque chaîne de caractères dans un tableau DOIT être entre doubles guillemets.

    Format attendu:
    {
      "personas": [
        {
          "name": "Nom du persona",
          "age": "Tranche d'âge",
          "occupation": "Profession",
          "goals": ["Objectif 1", "Objectif 2"],
          "painPoints": ["Point de douleur 1", "Point de douleur 2"],
          "techSavviness": "Faible|Moyen|Élevé"
        }
      ]
    }
    `;

    try {
      const [analysisResponse, personasResponse] = await Promise.all([
        aiService.generate({ prompt: analysisPrompt, config: apiConfig, isJson: true }),
        aiService.generate({ prompt: personasPrompt, config: apiConfig, isJson: true })
      ]);

      if (analysisResponse.success && analysisResponse.content) {
        const content = parseJsonFromResponse<any>(analysisResponse.content);
        if (content) {
          content.score = Number(content.score) || 70;
          setInsights(content);
          onInsightsReady?.(content);
        } else {
          setError("L'IA a retourné une analyse mal formée.");
        }
      } else if (!analysisResponse.success) {
        setError(analysisResponse.error || "Erreur lors de la génération de l'analyse.");
        setIsLoading(false);
        return;
      }

      if (personasResponse.success && personasResponse.content) {
        const personasContent = parseJsonFromResponse<any>(personasResponse.content);
        if (personasContent) {
          setPersonas(personasContent);
        } else {
           console.error("L'IA a retourné des personas mal formés.");
        }
      } else if (!personasResponse.success) {
        setError(personasResponse.error || "Erreur lors de la génération des personas.");
      }
    } catch (err: any) {
      console.error('Erreur génération insights:', err);
      setError(err.message || "Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mt-4"
        role="alert"
      >
        <div className="flex">
          <div className="py-1"><AlertCircle className="h-5 w-5 text-red-500 mr-3" /></div>
          <div>
            <p className="font-bold">Erreur d'analyse IA</p>
            <p className="text-sm">{error} Veuillez vérifier votre clé API dans les paramètres.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-lg border"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
          <h4 className="font-semibold text-gray-800">Analyse IA en cours...</h4>
        </div>
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score global IA */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <h4 className="text-xl font-semibold text-gray-800">Analyse IA</h4>
          </div>
          <button
            onClick={generateInsights}
            className="text-purple-600 hover:text-purple-700 p-1"
            title="Regenerer l'analyse"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-1 ${getScoreColor(insights.score).split(' ')[0]}`}>
              {insights.score}
            </div>
            <div className="text-sm text-gray-600">Score IA Global</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {insights.competitors?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Concurrents identifiés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {insights.opportunities?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Opportunités</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {insights.recommendations?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Recommandations</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analyse de marché */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h5 className="font-semibold text-gray-800">Analyse de marché</h5>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {insights.marketAnalysis}
          </p>
        </div>

        {/* Opportunités */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="h-5 w-5 text-green-600" />
            <h5 className="font-semibold text-gray-800">Opportunités</h5>
          </div>
          <ul className="space-y-2">
            {insights.opportunities?.map((opportunity: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span className="text-sm text-gray-700">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Défis */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-orange-600" />
            <h5 className="font-semibold text-gray-800">Défis à relever</h5>
          </div>
          <ul className="space-y-2">
            {insights.challenges?.map((challenge: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                <span className="text-sm text-gray-700">{challenge}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommandations IA */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-5 w-5 text-purple-600" />
            <h5 className="font-semibold text-gray-800">Recommandations IA</h5>
          </div>
          <ul className="space-y-2">
            {insights.recommendations?.map((recommendation: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                <span className="text-sm text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Personas utilisateurs */}
      {personas && personas.personas && (
        <div className="bg-white p-6 rounded-lg border">
          <h5 className="font-semibold text-gray-800 mb-4">Personas utilisateurs (IA)</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personas.personas.map((persona: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h6 className="font-medium text-gray-800 mb-2">{persona.name}</h6>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Âge:</strong> {persona.age}</div>
                  <div><strong>Profession:</strong> {persona.occupation}</div>
                  <div><strong>Tech-savvy:</strong> {persona.techSavviness}</div>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">Objectifs:</div>
                  <ul className="text-xs text-gray-600">
                    {persona.goals?.slice(0, 2).map((goal: string, i: number) => (
                      <li key={i}>• {goal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concurrents */}
      <div className="bg-white p-6 rounded-lg border">
        <h5 className="font-semibold text-gray-800 mb-4">Concurrents identifiés</h5>
        <div className="flex flex-wrap gap-2">
          {insights.competitors?.map((competitor: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {competitor}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AIInsights;
