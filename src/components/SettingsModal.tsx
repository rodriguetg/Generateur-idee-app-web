import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Key, BrainCircuit } from 'lucide-react';
import { ApiConfig, AIProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ApiConfig) => void;
  currentConfig: ApiConfig;
}

const providerDetails = {
  openai: { name: 'OpenAI', model: 'gpt-3.5-turbo' },
  gemini: { name: 'Google Gemini', model: 'gemini-pro' },
  deepseek: { name: 'DeepSeek', model: 'deepseek-chat' },
  openrouter: { name: 'OpenRouter', model: 'mistralai/mistral-7b-instruct' },
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentConfig }) => {
  const [config, setConfig] = useState<ApiConfig>(currentConfig);

  useEffect(() => {
    setConfig(currentConfig);
  }, [currentConfig]);

  const handleSave = () => {
    onSave(config);
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as AIProvider;
    setConfig({
      ...config,
      provider: newProvider,
      model: providerDetails[newProvider].model,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Configuration IA</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                Fournisseur d'IA
              </label>
              <div className="relative">
                <BrainCircuit className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="provider"
                  value={config.provider}
                  onChange={handleProviderChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Object.entries(providerDetails).map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                Clé API
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="apiKey"
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="Entrez votre clé API ici"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Votre clé API est stockée localement dans votre navigateur et n'est jamais envoyée à nos serveurs.
              </p>
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Modèle (optionnel)
              </label>
              <input
                id="model"
                type="text"
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                placeholder="ex: gpt-4, gemini-1.5-pro..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Laissez vide pour utiliser le modèle par défaut : <code className="bg-gray-100 px-1 rounded">{providerDetails[config.provider].model}</code>
              </p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Sauvegarder</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;
