import { AppIdea } from '../types';

export const ideaTemplates: Partial<AppIdea>[] = [
  // E-commerce
  {
    category: 'ecommerce',
    title: 'Marketplace de Produits Écologiques',
    description: 'Plateforme dédiée à la vente de produits respectueux de l\'environnement avec système de notation écologique.',
    targetAudience: 'Consommateurs soucieux de l\'environnement, 25-45 ans',
    mainFeatures: ['Catalogue produits éco-responsables', 'Score écologique', 'Système de reviews', 'Livraison verte', 'Programme de fidélité'],
    monetization: ['Commission sur ventes', 'Abonnement vendeurs premium', 'Publicité ciblée'],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
    difficulty: 'Moyen',
    estimatedTime: '6-8 mois',
    marketPotential: 85
  },
  {
    category: 'ecommerce',
    title: 'Plateforme de Vente de NFT Artistiques',
    description: 'Marketplace spécialisée pour les créateurs d\'art numérique et collectionneurs de NFT.',
    targetAudience: 'Artistes numériques, collectionneurs, investisseurs crypto',
    mainFeatures: ['Création NFT simplifiée', 'Galerie virtuelle', 'Enchères en temps réel', 'Portefeuille intégré', 'Analytics marché'],
    monetization: ['Frais de transaction', 'Frais de frappe NFT', 'Services premium créateurs'],
    techStack: ['React', 'Solidity', 'IPFS', 'Web3.js', 'Ethereum'],
    difficulty: 'Difficile',
    estimatedTime: '8-12 mois',
    marketPotential: 75
  },
  
  // Social
  {
    category: 'social',
    title: 'Réseau Social pour Nomades Numériques',
    description: 'Plateforme communautaire pour les travailleurs à distance partageant conseils et spots de travail.',
    targetAudience: 'Nomades numériques, freelances, entrepreneurs',
    mainFeatures: ['Profils géolocalisés', 'Carte des spots WiFi', 'Événements locaux', 'Groupes par ville', 'Reviews lieux de travail'],
    monetization: ['Abonnements premium', 'Partenariats coworking', 'Publicité locale'],
    techStack: ['React Native', 'Firebase', 'Google Maps API', 'Node.js'],
    difficulty: 'Moyen',
    estimatedTime: '4-6 mois',
    marketPotential: 90
  },
  
  // Productivity
  {
    category: 'productivity',
    title: 'Assistant IA pour Gestion de Projets',
    description: 'Outil de gestion de projets avec intelligence artificielle pour optimisation automatique des tâches.',
    targetAudience: 'Chefs de projet, équipes agiles, PME',
    mainFeatures: ['Planification IA', 'Prédiction risques', 'Allocation ressources automatique', 'Rapports intelligents', 'Intégrations APIs'],
    monetization: ['SaaS par utilisateur', 'Modules premium', 'Services consulting'],
    techStack: ['React', 'Python', 'TensorFlow', 'PostgreSQL', 'Docker'],
    difficulty: 'Difficile',
    estimatedTime: '10-14 mois',
    marketPotential: 95
  },
  
  // Education
  {
    category: 'education',
    title: 'Plateforme d\'Apprentissage Micro-Learning',
    description: 'Application d\'apprentissage basée sur des sessions de 5 minutes avec gamification.',
    targetAudience: 'Professionnels occupés, étudiants, autodidactes',
    mainFeatures: ['Leçons micro-format', 'Adaptive learning', 'Gamification', 'Badges et certifications', 'Communauté apprenants'],
    monetization: ['Freemium', 'Certificats payants', 'Contenu premium'],
    techStack: ['React', 'Node.js', 'MongoDB', 'Redis', 'ML algorithms'],
    difficulty: 'Moyen',
    estimatedTime: '6-9 mois',
    marketPotential: 88
  },
  
  // Health
  {
    category: 'health',
    title: 'Assistant Personnel de Nutrition IA',
    description: 'Application de suivi nutritionnel avec recommandations personnalisées basées sur l\'IA.',
    targetAudience: 'Personnes soucieuses de leur santé, sportifs, diabétiques',
    mainFeatures: ['Scan aliments', 'Recettes personnalisées', 'Suivi glucose', 'Coach IA', 'Intégration wearables'],
    monetization: ['Abonnement premium', 'Partenariats nutritionnistes', 'E-commerce compléments'],
    techStack: ['React Native', 'TensorFlow', 'Computer Vision', 'HealthKit', 'Node.js'],
    difficulty: 'Difficile',
    estimatedTime: '8-12 mois',
    marketPotential: 92
  },
  
  // Finance
  {
    category: 'finance',
    title: 'Robo-Advisor pour Crypto-Investissement',
    description: 'Plateforme d\'investissement automatisé spécialisée dans les crypto-monnaies.',
    targetAudience: 'Investisseurs crypto, débutants en trading, millennials',
    mainFeatures: ['Portefeuille auto-équilibré', 'DCA automatique', 'Analytics avancées', 'Alertes prix', 'Formation trading'],
    monetization: ['Frais de gestion', 'Abonnements premium', 'Spread sur transactions'],
    techStack: ['React', 'Python', 'APIs exchanges', 'PostgreSQL', 'Blockchain APIs'],
    difficulty: 'Difficile',
    estimatedTime: '10-15 mois',
    marketPotential: 85
  }
];
