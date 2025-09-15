import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wand2, Copy, Check, Bot, Zap, Bolt } from 'lucide-react';
import { Specifications, VibePlatform } from '../types';
import { generateVibePrompt } from '../utils/promptGenerator';

interface PromptGeneratorProps {
  specifications: Specifications;
  onBack: () => void;
}

const platformDetails = {
  dualite: { name: 'Dualite.dev', icon: Bot, color: 'purple' },
  lovable: { name: 'Lovable', icon: Zap, color: 'pink' },
  bolt: { name: 'Bolt', icon: Bolt, color: 'yellow' },
};

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ specifications, onBack }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<VibePlatform>('dualite');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Generate prompt for the default platform on component mount
    handleGeneratePrompt();
  }, []);

  const handleGeneratePrompt = () => {
    const prompt = generateVibePrompt(specifications, selectedPlatform);
    setGeneratedPrompt(prompt);
  };
  
  useEffect(() => {
    handleGeneratePrompt();
  }, [selectedPlatform]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Générez votre Prompt de Vibe Coding
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Obtenez le prompt parfait pour donner vie à votre projet sur votre plateforme de génération de code préférée.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border">
        {/* Platform Selector */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Choisissez votre plateforme</h4>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(platformDetails).map(([key, details]) => {
              const platformKey = key as VibePlatform;
              const Icon = details.icon;
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPlatform(platformKey)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer text-center transition-all
                    ${selectedPlatform === platformKey
                      ? `border-${details.color}-500 bg-${details.color}-50 shadow-md`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className={`h-8 w-8 mx-auto mb-2 text-${details.color}-500`} />
                  <span className="font-medium text-gray-700">{details.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Generated Prompt */}
        <div className="relative">
          <h4 className="font-semibold text-gray-800 mb-3">Prompt Généré</h4>
          <textarea
            readOnly
            value={generatedPrompt}
            className="w-full h-96 p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Le prompt généré apparaîtra ici..."
          />
          <button
            onClick={handleCopyToClipboard}
            className="absolute top-12 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-colors"
          >
            {isCopied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t mt-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-700 font-medium inline-flex items-center space-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </button>
          
          <button
            onClick={handleGeneratePrompt}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <Wand2 className="h-4 w-4" />
            <span>Regénérer le Prompt</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptGenerator;
