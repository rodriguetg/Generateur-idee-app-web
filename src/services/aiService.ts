import { ApiConfig } from '../types';

interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  errorType?: 'auth' | 'network' | 'generic';
}

class AIService {
  public async generate(request: AIRequest): Promise<AIResponse> {
    const { prompt, config, isJson = false } = request;
    const { provider, apiKey, model } = config;

    if (!apiKey) {
      return { 
        success: false, 
        error: "Aucune clé API n'est configurée.",
        errorType: 'auth' 
      };
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
        body = { contents: [{ parts: [{ text: prompt }] }] };
        if (isJson) {
           body.generationConfig = { response_mime_type: "application/json" };
        }
        break;

      default:
        return { success: false, error: 'Fournisseur IA non supporté', errorType: 'generic' };
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Erreur d\'authentification API (401). La clé API est probablement invalide ou manquante. L\'interface utilisateur doit afficher un message à l\'utilisateur.');
          return { 
            success: false, 
            error: 'Votre clé API est invalide, non autorisée ou manquante.', 
            errorType: 'auth' 
          };
        }
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || response.statusText || 'Réponse inattendue du serveur.';
        console.warn(`Erreur API gérée (${response.status}):`, errorMessage);
        return { 
          success: false, 
          error: `Le service IA a retourné une erreur ${response.status}. Vérifiez votre configuration et le modèle sélectionné.`, 
          errorType: 'generic' 
        };
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
      console.warn(`Erreur réseau lors de l'appel à ${provider}. Vérifiez la connexion internet.`, error);
      return { 
        success: false, 
        error: 'Erreur de connexion au service IA. Veuillez vérifier votre connexion internet.', 
        errorType: 'network' 
      };
    }
  }
}

interface AIRequest {
  prompt: string;
  config: ApiConfig;
  isJson?: boolean;
}

export const aiService = new AIService();
