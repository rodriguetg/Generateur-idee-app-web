import { ProjectIdea, Specifications, FunctionalRequirement, NonFunctionalRequirement, UserStory, TechnicalArchitecture, Phase, BudgetEstimate, Risk, AcceptanceCriteria } from '../types';
import { faker } from '@faker-js/faker';

export const generateSpecifications = (projectIdea: ProjectIdea): Specifications => {
  const functionalRequirements: FunctionalRequirement[] = projectIdea.mainFeatures.map((feature, index) => ({
    id: `FR-${(index + 1).toString().padStart(3, '0')}`,
    title: feature,
    description: `Implémentation complète de la fonctionnalité ${feature.toLowerCase()}`,
    priority: index < 3 ? 'Haute' : index < 6 ? 'Moyenne' : 'Basse',
    complexity: projectIdea.difficulty === 'Facile' ? 'Simple' : projectIdea.difficulty === 'Moyen' ? 'Modérée' : 'Complexe'
  }));

  const nonFunctionalRequirements: NonFunctionalRequirement[] = [
    {
      id: 'NFR-001',
      category: 'Performance',
      requirement: 'Temps de chargement de page',
      target: '< 3 secondes'
    },
    {
      id: 'NFR-002',
      category: 'Sécurité',
      requirement: 'Chiffrement des données',
      target: 'SSL/TLS, Hash des mots de passe'
    },
    {
      id: 'NFR-003',
      category: 'Disponibilité',
      requirement: 'Uptime du service',
      target: '99.9%'
    },
    {
      id: 'NFR-004',
      category: 'Scalabilité',
      requirement: 'Nombre d\'utilisateurs simultanés',
      target: projectIdea.difficulty === 'Facile' ? '1,000' : projectIdea.difficulty === 'Moyen' ? '10,000' : '100,000'
    },
    {
      id: 'NFR-005',
      category: 'Compatibilité',
      requirement: 'Support navigateurs',
      target: 'Chrome, Firefox, Safari, Edge (dernières versions)'
    }
  ];

  const userStories: UserStory[] = [
    {
      id: 'US-001',
      persona: 'Utilisateur final',
      story: `En tant qu'utilisateur, je veux pouvoir m'inscrire facilement pour accéder aux fonctionnalités de ${projectIdea.title}`,
      acceptance: ['Formulaire d\'inscription simple', 'Validation email', 'Redirection vers dashboard'],
      priority: 'Haute'
    },
    {
      id: 'US-002',
      persona: 'Utilisateur connecté',
      story: `En tant qu'utilisateur connecté, je veux accéder aux fonctionnalités principales depuis un tableau de bord intuitif`,
      acceptance: ['Interface claire', 'Navigation facile', 'Fonctionnalités accessibles'],
      priority: 'Haute'
    },
    {
      id: 'US-003',
      persona: 'Administrateur',
      story: `En tant qu'administrateur, je veux pouvoir gérer les utilisateurs et surveiller l'activité de l'application`,
      acceptance: ['Panel admin', 'Gestion utilisateurs', 'Analytics'],
      priority: 'Moyenne'
    }
  ];

  const technicalArchitecture: TechnicalArchitecture = {
    frontend: projectIdea.techStack.filter(tech => 
      ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind'].includes(tech)
    ),
    backend: projectIdea.techStack.filter(tech => 
      ['Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring'].includes(tech)
    ),
    database: projectIdea.techStack.filter(tech => 
      ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'].includes(tech)
    ),
    hosting: projectIdea.techStack.filter(tech => 
      ['AWS', 'Azure', 'GCP', 'Vercel', 'Netlify', 'Heroku'].includes(tech)
    ),
    thirdParty: projectIdea.techStack.filter(tech => 
      ['Stripe', 'PayPal', 'Google Maps', 'SendGrid', 'Twilio'].includes(tech)
    )
  };

  const phases: Phase[] = [
    {
      name: 'Phase 1: Conception et Design',
      duration: '2-3 semaines',
      deliverables: ['Wireframes', 'Maquettes UI/UX', 'Architecture technique', 'Base de données'],
      resources: ['Designer UI/UX', 'Architecte technique']
    },
    {
      name: 'Phase 2: Développement MVP',
      duration: getEstimatedDuration(projectIdea.estimatedTime, 0.6),
      deliverables: ['Fonctionnalités core', 'Interface utilisateur', 'API Backend', 'Base de données'],
      resources: ['Développeur Frontend', 'Développeur Backend', 'DevOps']
    },
    {
      name: 'Phase 3: Tests et Optimisation',
      duration: getEstimatedDuration(projectIdea.estimatedTime, 0.2),
      deliverables: ['Tests unitaires', 'Tests d\'intégration', 'Optimisations performance', 'Corrections bugs'],
      resources: ['QA Tester', 'Développeurs']
    },
    {
      name: 'Phase 4: Déploiement et Lancement',
      duration: getEstimatedDuration(projectIdea.estimatedTime, 0.2),
      deliverables: ['Déploiement production', 'Documentation', 'Formation utilisateurs', 'Support'],
      resources: ['DevOps', 'Support technique']
    }
  ];

  const baseCost = getDevelopmentCost(projectIdea.difficulty);
  const budget: BudgetEstimate = {
    development: baseCost,
    design: Math.round(baseCost * 0.25),
    testing: Math.round(baseCost * 0.15),
    deployment: Math.round(baseCost * 0.1),
    maintenance: Math.round(baseCost * 0.2),
    total: 0
  };
  budget.total = budget.development + budget.design + budget.testing + budget.deployment + budget.maintenance;

  const risks: Risk[] = [
    {
      id: 'RISK-001',
      description: 'Dépassement du budget de développement',
      probability: projectIdea.difficulty === 'Difficile' ? 'Élevée' : 'Moyenne',
      impact: 'Élevé',
      mitigation: 'Suivi rigoureux du budget, revues régulières des coûts'
    },
    {
      id: 'RISK-002',
      description: 'Retard dans les délais de livraison',
      probability: projectIdea.difficulty === 'Facile' ? 'Faible' : 'Moyenne',
      impact: 'Moyen',
      mitigation: 'Planning détaillé, méthodologie Agile, équipe expérimentée'
    },
    {
      id: 'RISK-003',
      description: 'Problèmes de performance avec la montée en charge',
      probability: 'Moyenne',
      impact: 'Élevé',
      mitigation: 'Tests de charge, architecture scalable, monitoring'
    },
    {
      id: 'RISK-004',
      description: 'Failles de sécurité',
      probability: 'Faible',
      impact: 'Élevé',
      mitigation: 'Audit sécurité, bonnes pratiques, tests de pénétration'
    }
  ];

  const acceptance: AcceptanceCriteria[] = [
    {
      id: 'AC-001',
      criterion: 'Toutes les fonctionnalités principales sont opérationnelles',
      method: 'Tests fonctionnels complets'
    },
    {
      id: 'AC-002',
      criterion: 'Performance conforme aux exigences',
      method: 'Tests de performance et monitoring'
    },
    {
      id: 'AC-003',
      criterion: 'Interface utilisateur conforme aux maquettes',
      method: 'Revue visuelle et tests utilisateurs'
    },
    {
      id: 'AC-004',
      criterion: 'Sécurité validée',
      method: 'Audit de sécurité et tests de pénétration'
    },
    {
      id: 'AC-005',
      criterion: 'Documentation complète fournie',
      method: 'Revue de la documentation technique et utilisateur'
    }
  ];

  return {
    id: faker.string.uuid(),
    projectIdea,
    projectOverview: `${projectIdea.title} est une application web innovante ciblant ${projectIdea.targetAudience.toLowerCase()}. ${projectIdea.description} Cette solution vise à transformer l'expérience utilisateur dans le domaine ${projectIdea.category} en proposant des fonctionnalités avancées et une interface intuitive.`,
    objectives: [
      `Développer une application web moderne et responsive pour ${projectIdea.targetAudience.toLowerCase()}`,
      'Implémenter toutes les fonctionnalités définies avec une expérience utilisateur optimale',
      'Assurer la scalabilité et la sécurité de la solution',
      'Livrer un produit conforme aux standards de qualité et aux délais convenus',
      'Mettre en place une stratégie de monétisation viable'
    ],
    scope: {
      included: [
        'Développement de l\'application web complète',
        'Interface utilisateur responsive (mobile, tablette, desktop)',
        'Backend et API RESTful',
        'Base de données et gestion des données',
        'Système d\'authentification et autorisation',
        'Tests unitaires et d\'intégration',
        'Déploiement en production',
        'Documentation technique et utilisateur'
      ],
      excluded: [
        'Applications mobiles natives (iOS/Android)',
        'Maintenance post-lancement (au-delà de 3 mois)',
        'Formation approfondie des utilisateurs finaux',
        'Marketing et promotion de l\'application',
        'Intégrations non spécifiées dans le scope initial'
      ]
    },
    functionalRequirements,
    nonFunctionalRequirements,
    userStories,
    technicalArchitecture,
    timeline: phases,
    budget,
    risks,
    acceptance
  };
};

function getEstimatedDuration(totalTime: string, percentage: number): string {
  // Extraction simple du nombre de mois
  const months = parseInt(totalTime.match(/\d+/) || ['3']);
  const phaseDuration = Math.round(months * percentage * 4); // Conversion en semaines
  return `${phaseDuration} semaines`;
}

function getDevelopmentCost(difficulty: string): number {
  switch (difficulty) {
    case 'Facile': return faker.number.int({ min: 15000, max: 30000 });
    case 'Moyen': return faker.number.int({ min: 30000, max: 60000 });
    case 'Difficile': return faker.number.int({ min: 60000, max: 120000 });
    default: return 45000;
  }
}
