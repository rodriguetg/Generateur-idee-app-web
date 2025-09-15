import { Specifications, VibePlatform } from '../types';

const getDualitePrompt = (specs: Specifications): string => {
  return `
En tant que Dualite Alpha, un ingénieur Frontend senior expert en UI/UX, ta mission est de générer le code pour le projet suivant. Tu dois respecter scrupuleusement les consignes et produire un code complet, modulaire, responsive et esthétique.

### Contexte du Projet
- **Titre:** ${specs.projectIdea.title}
- **Description:** ${specs.projectIdea.description}
- **Public Cible:** ${specs.projectIdea.targetAudience}

### Stack Technique Obligatoire
- **Framework:** React (avec Hooks fonctionnels)
- **Langage:** TypeScript (avec typage strict)
- **Styling:** Tailwind CSS (approche utility-first)
- **Icônes:** lucide-react
- **Animations:** framer-motion

### Exigences Fonctionnelles Clés
Tu dois implémenter les fonctionnalités suivantes, en te basant sur leur description et priorité :
${specs.functionalRequirements.map(req => `- **${req.title} (Priorité: ${req.priority}):** ${req.description}`).join('\n')}

### User Stories Principales
Garde ces parcours utilisateurs en tête lors de la conception de l'interface :
${specs.userStories.map(story => `- **En tant que ${story.persona},** je veux ${story.story.split('je veux ')[1]}`).join('\n')}

### Architecture et Structure du Code
- Crée une structure de fichiers modulaire. Sépare la logique, les composants et les types.
- Utilise des composants réutilisables autant que possible.
- Assure une séparation claire des préoccupations.

### Directives UI/UX
- Le design doit être **moderne, épuré et professionnel**.
- L'interface doit être **entièrement responsive** (mobile, tablette, bureau).
- Utilise des animations subtiles avec \`framer-motion\` pour améliorer l'expérience sans la surcharger.
- Assure une bonne accessibilité (contrastes, navigation clavier).
- Utilise des données fictives générées par \`@faker-js/faker\` pour peupler l'interface.

### Format de Sortie
- Le code doit être fourni dans une structure XML \`<dualiteArtifact>\` avec des actions de type \`file\` et \`shell\`.
- Fournis le contenu **complet** de chaque fichier.
- N'oublie pas d'installer les dépendances nécessaires via une commande \`yarn add ...\` dans une action \`shell\`.

Maintenant, génère le code complet pour ce projet.
  `.trim();
};

const getLovablePrompt = (specs: Specifications): string => {
  return `
Crée une interface web pour le projet suivant, en mettant un accent particulier sur une expérience utilisateur **exceptionnelle et adorable**. Le design doit être doux, invitant et plein de charme.

### Projet: ${specs.projectIdea.title}
${specs.projectIdea.description}

### Ambiance et Style ("Vibe")
- **Palette de couleurs:** Pense à des couleurs pastel, douces et harmonieuses.
- **Typographie:** Choisis une police de caractères arrondie et amicale.
- **Formes:** Utilise des coins très arrondis, des formes organiques et douces.
- **Micro-interactions:** Intègre de nombreuses animations ludiques et satisfaisantes (boutons qui rebondissent, icônes qui s'animent, transitions de page fluides). Chaque interaction doit être un plaisir.
- **Illustrations:** Inclus des espaces pour des illustrations ou des icônes personnalisées au style "mignon" ou "kawaii".

### Fonctionnalités à Implémenter
${specs.functionalRequirements.map(req => `- ${req.title}`).join('\n')}

### Stack Technique
- React
- Tailwind CSS

### Instructions
- Code une application complète et fonctionnelle.
- L'accent est mis sur l'esthétique et le "feeling". Chaque détail compte.
- L'application doit être responsive.

Construis la plus belle et la plus agréable des interfaces pour ce projet.
  `.trim();
};

const getBoltPrompt = (specs: Specifications): string => {
  return `
Génère rapidement un MVP (Minimum Viable Product) fonctionnel et performant pour le projet suivant. L'objectif est la **vitesse, l'efficacité et la robustesse**.

### Projet: ${specs.projectIdea.title}
${specs.projectIdea.description}

### Priorités Absolues
1.  **Performance:** Le code doit être optimisé pour un chargement rapide. Pas de fioritures inutiles.
2.  **Fonctionnalité:** Concentre-toi sur l'implémentation des fonctionnalités de **haute priorité**.
3.  **Clarté du code:** Produis un code propre, bien structuré et facile à maintenir.

### Fonctionnalités de Haute Priorité à Coder
${specs.functionalRequirements.filter(req => req.priority === 'Haute').map(req => `- ${req.title}: ${req.description}`).join('\n')}

### Stack Technique
- React
- TypeScript
- Tailwind CSS

### Directives
- Le design doit être propre, simple et fonctionnel (style "brutaliste" ou minimaliste accepté).
- Pas d'animations complexes.
- L'application doit être responsive et fonctionner parfaitement sur tous les appareils.
- Génère des composants modulaires et bien typés.

Construis un MVP solide et rapide pour ce projet, prêt à être testé.
  `.trim();
};

export const generateVibePrompt = (specifications: Specifications, platform: VibePlatform): string => {
  switch (platform) {
    case 'dualite':
      return getDualitePrompt(specifications);
    case 'lovable':
      return getLovablePrompt(specifications);
    case 'bolt':
      return getBoltPrompt(specifications);
    default:
      return 'Plateforme non reconnue.';
  }
};
