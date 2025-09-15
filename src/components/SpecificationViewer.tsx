import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Target, 
  Users, 
  Settings, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  Code,
  Database,
  Server,
  Cloud,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { Specifications } from '../types';
import { generatePdfFromSpecs } from '../utils/pdfGenerator';

interface SpecificationViewerProps {
  specifications: Specifications;
  onBack: () => void;
  onNext: () => void;
}

const SpecificationViewer: React.FC<SpecificationViewerProps> = ({ specifications, onBack, onNext }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: FileText },
    { id: 'requirements', label: 'Exigences', icon: Target },
    { id: 'stories', label: 'User Stories', icon: Users },
    { id: 'architecture', label: 'Architecture', icon: Code },
    { id: 'timeline', label: 'Planning', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'risks', label: 'Risques', icon: AlertTriangle },
    { id: 'acceptance', label: 'Critères', icon: CheckCircle }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Élevée': case 'Élevé': return 'bg-red-100 text-red-800';
      case 'Moyenne': case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generatePdfFromSpecs(specifications);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{specifications.projectIdea.title}</h3>
        <p className="text-gray-700 leading-relaxed mb-4">{specifications.projectOverview}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{specifications.functionalRequirements.length}</div>
            <div className="text-sm text-gray-600">Exigences fonctionnelles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{specifications.userStories.length}</div>
            <div className="text-sm text-gray-600">User Stories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{specifications.timeline.length}</div>
            <div className="text-sm text-gray-600">Phases</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{specifications.budget.total.toLocaleString()}€</div>
            <div className="text-sm text-gray-600">Budget total</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-4">Objectifs du projet</h4>
          <ul className="space-y-3">
            {specifications.objectives.map((objective, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-4">Périmètre du projet</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-green-700 mb-2">✅ Inclus</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {specifications.scope.included.slice(0, 4).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium text-red-700 mb-2">❌ Exclu</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {specifications.scope.excluded.slice(0, 3).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-4">Exigences fonctionnelles</h4>
        <div className="space-y-4">
          {specifications.functionalRequirements.map((req) => (
            <div key={req.id} className="border border-gray-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-800">{req.id}: {req.title}</h5>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(req.priority)}`}>
                    {req.priority}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {req.complexity}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{req.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-4">Exigences non-fonctionnelles</h4>
        <div className="space-y-3">
          {specifications.nonFunctionalRequirements.map((req) => (
            <div key={req.id} className="flex items-center justify-between border border-gray-200 p-3 rounded-lg">
              <div>
                <span className="font-medium text-gray-800">{req.category}</span>
                <span className="text-gray-600 ml-2">- {req.requirement}</span>
              </div>
              <span className="text-sm font-medium text-purple-600">{req.target}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserStories = () => (
    <div className="space-y-4">
      {specifications.userStories.map((story) => (
        <div key={story.id} className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-800">{story.id}: {story.persona}</h5>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(story.priority)}`}>
              {story.priority}
            </span>
          </div>
          <p className="text-gray-700 mb-4 italic">"{story.story}"</p>
          <div>
            <h6 className="text-sm font-medium text-gray-800 mb-2">Critères d'acceptation:</h6>
            <ul className="text-sm text-gray-600 space-y-1">
              {story.acceptance.map((criterion, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  const renderArchitecture = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[
        { title: 'Frontend', items: specifications.technicalArchitecture.frontend, icon: Code, color: 'blue' },
        { title: 'Backend', items: specifications.technicalArchitecture.backend, icon: Server, color: 'green' },
        { title: 'Base de données', items: specifications.technicalArchitecture.database, icon: Database, color: 'purple' },
        { title: 'Hébergement', items: specifications.technicalArchitecture.hosting, icon: Cloud, color: 'orange' },
      ].map((section) => (
        <div key={section.title} className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-4">
            <section.icon className={`h-5 w-5 text-${section.color}-600`} />
            <h4 className="font-semibold text-gray-800">{section.title}</h4>
          </div>
          <div className="space-y-2">
            {section.items.length > 0 ? (
              section.items.map((item, index) => (
                <div key={index} className={`px-3 py-2 bg-${section.color}-50 text-${section.color}-800 rounded-lg text-sm`}>
                  {item}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Non spécifié</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      {specifications.timeline.map((phase, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">{phase.name}</h4>
            <span className="text-sm font-medium text-purple-600">{phase.duration}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Livrables</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {phase.deliverables.map((deliverable, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Ressources</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {phase.resources.map((resource, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBudget = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-6">Répartition du budget</h4>
        <div className="space-y-4">
          {[
            { label: 'Développement', amount: specifications.budget.development, color: 'bg-blue-500' },
            { label: 'Design', amount: specifications.budget.design, color: 'bg-purple-500' },
            { label: 'Tests', amount: specifications.budget.testing, color: 'bg-green-500' },
            { label: 'Déploiement', amount: specifications.budget.deployment, color: 'bg-yellow-500' },
            { label: 'Maintenance', amount: specifications.budget.maintenance, color: 'bg-orange-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span className="text-gray-700">{item.label}</span>
              </div>
              <span className="font-medium text-gray-800">{item.amount.toLocaleString()}€</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-6 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-xl font-bold text-purple-600">{specifications.budget.total.toLocaleString()}€</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRisks = () => (
    <div className="space-y-4">
      {specifications.risks.map((risk) => (
        <div key={risk.id} className="bg-white p-6 rounded-lg border">
          <div className="flex items-start justify-between mb-3">
            <h5 className="font-medium text-gray-800">{risk.id}</h5>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.probability)}`}>
                {risk.probability}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.impact)}`}>
                {risk.impact}
              </span>
            </div>
          </div>
          <p className="text-gray-700 mb-3">{risk.description}</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h6 className="text-sm font-medium text-gray-800 mb-1">Mitigation:</h6>
            <p className="text-sm text-gray-600">{risk.mitigation}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAcceptance = () => (
    <div className="space-y-4">
      {specifications.acceptance.map((criterion) => (
        <div key={criterion.id} className="bg-white p-6 rounded-lg border">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-medium text-gray-800 mb-2">{criterion.id}</h5>
              <p className="text-gray-700 mb-2">{criterion.criterion}</p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-blue-800">Méthode: </span>
                <span className="text-sm text-blue-700">{criterion.method}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'requirements': return renderRequirements();
      case 'stories': return renderUserStories();
      case 'architecture': return renderArchitecture();
      case 'timeline': return renderTimeline();
      case 'budget': return renderBudget();
      case 'risks': return renderRisks();
      case 'acceptance': return renderAcceptance();
      default: return renderOverview();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Cahier des Charges</h3>
            <p className="text-gray-500 text-sm">Explorez les détails de votre projet avant de générer le prompt final.</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2 disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{isDownloading ? 'Génération...' : 'PDF'}</span>
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu de l'onglet */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>

        <div className="flex justify-between items-center pt-6 border-t mt-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-700 font-medium inline-flex items-center space-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </button>

          <button
            onClick={onNext}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <span>Générer le Prompt</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecificationViewer;
