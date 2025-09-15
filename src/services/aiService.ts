import { ApiConfig } from '../types';

interface AIRequest {
  prompt: string;
  config: ApiConfig;
  isJson?: boolean;
}

interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

class AIService {
  private getMockResponse(prompt: string): AIResponse {
    console.warn("Utilisation du mode démo (clé API non configurée ou invalide).");
    let mockContent = {
      title: "Idée d'App Démo (IA)",
      description: "Ceci est une description générée par le mode démo car la clé API n'est pas configurée. Veuillez configurer votre clé API dans les paramètres pour obtenir des résultats réels.",
      targetAudience: "Développeurs en test",
      mainFeatures: ["Fonctionnalité Démo 1", "Fonctionnalité Démo 2"],
      monetization: ["Modèle Démo"],
      techStack: ["React", "TypeScript", "Tailwind CSS"],
      difficulty: "Moyen",
      estimatedTime: "1 mois",
      marketPotential: 75,
      marketAnalysis: "Analyse de marché simulée.",
      competitors: ["Concurrent Démo A", "Concurrent Démo B"],
      opportunities: ["Opportunité Démo"],
      challenges: ["Défi Démo"],
      recommendations: ["Recommandation Démo"],
      score: 75
    };
    return { success: true, content: JSON.stringify(mockContent) };
  }

  public async generate(request: AIRequest): Promise<AIResponse> {
    const { prompt, config, isJson = false } = request;
    const { provider, apiKey, model } = config;

    if (!apiKey) {
      return this.getMockResponse(prompt);
    }

    let endpoint = '';
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    let body: any;

    const messages = [{ role: 'user', content: prompt }];
    const jsonMode = isJson ? { response_format: { type: "json_object" } } : {};

    switch (provider) {
      case 'openai':
        endpoint = 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = { model: model || 'gpt-3.5-turbo', messages, ...jsonMode };
        break;
      
      case 'deepseek':
        endpoint = 'https://api.deepseek.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = { model: model || 'deepseek-chat', messages, ...jsonMode };
        break;

      case 'openrouter':
        endpoint = 'https://openrouter.ai/api/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['HTTP-Referer'] = 'http://localhost:5173'; // Required by OpenRouter for dev
        headers['X-Title'] = 'Générateur Idées App'; // Required by OpenRouter for dev
        body = { model: model || 'mistralai/mistral-7b-instruct', messages, ...jsonMode };
        break;

      case 'gemini':
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}:generateContent?key=${apiKey}`;
        // Gemini has a different body structure
        body = { contents: [{ parts: [{ text: prompt }] }] };
        if (isJson) {
           body.generationConfig = { response_mime_type: "application/json" };
        }
        break;

      default:
        return { success: false, error: 'Fournisseur IA non supporté' };
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API:', errorData);
        throw new Error(`Erreur ${response.status}: ${errorData.error?.message || 'Erreur inconnue'}`);
      }

      const data = await response.json();
      let content: string;

      if (provider === 'gemini') {
        content = data.candidates[0].content.parts[0].text;
      } else {
        content = data.choices[0].message.content;
      }
      
      return { success: true, content };

    } catch (error: any) {
      console.error(`Erreur lors de l'appel à ${provider}:`, error);
      return this.getMockResponse(prompt);
    }
  }
}

export const aiService = new AIService();
