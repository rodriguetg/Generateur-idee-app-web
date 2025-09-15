import jsPDF from 'jspdf';
import { Specifications } from '../types';

// A helper function to add a new page if needed
const checkPageBreak = (doc: jsPDF, y: number): number => {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y > pageHeight - 40) {
    doc.addPage();
    return 40;
  }
  return y;
};

// A helper to draw a section title
const drawSectionTitle = (doc: jsPDF, title: string, y: number): number => {
  y = checkPageBreak(doc, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, 40, y);
  return y + 25;
};

// A helper to draw text, handling wrapping
const drawText = (doc: jsPDF, text: string, x: number, y: number, options: any = {}): number => {
  const { fontSize = 10, fontStyle = 'normal', color = '#374151', maxWidth = doc.internal.pageSize.getWidth() - x - 40 } = options;
  doc.setFont('helvetica', fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(color);
  const splitText = doc.splitTextToSize(text, maxWidth);
  
  let currentY = y;
  splitText.forEach((line: string) => {
    currentY = checkPageBreak(doc, currentY);
    doc.text(line, x, currentY);
    currentY += fontSize * 1.2;
  });
  return currentY;
};

export const generatePdfFromSpecs = async (specifications: Specifications): Promise<void> => {
  const doc = new jsPDF('p', 'pt', 'a4');
  let y = 40;

  // Main Title
  y = drawText(doc, specifications.projectIdea.title, 40, y, { fontSize: 24, fontStyle: 'bold', color: '#111827' });
  y = drawText(doc, `Cahier des Charges - ${new Date().toLocaleDateString('fr-FR')}`, 40, y, { fontSize: 12, color: '#4B5563' });
  y += 20;

  // 1. Overview
  y = drawSectionTitle(doc, '1. Vue d\'ensemble', y);
  y = drawText(doc, specifications.projectOverview, 40, y);
  y += 10;
  y = drawText(doc, 'Objectifs :', 40, y, { fontStyle: 'bold' });
  specifications.objectives.forEach(obj => {
    y = drawText(doc, `• ${obj}`, 50, y);
  });
  y += 20;

  // 2. Requirements
  y = drawSectionTitle(doc, '2. Exigences', y);
  y = drawText(doc, 'Exigences Fonctionnelles', 40, y, { fontSize: 12, fontStyle: 'bold' });
  specifications.functionalRequirements.forEach(req => {
    y = checkPageBreak(doc, y + 10);
    y = drawText(doc, `${req.id}: ${req.title} (Priorité: ${req.priority})`, 40, y, { fontStyle: 'bold' });
    y = drawText(doc, req.description, 50, y);
    y += 5;
  });
  y += 10;
  y = drawText(doc, 'Exigences Non-Fonctionnelles', 40, y, { fontSize: 12, fontStyle: 'bold' });
  specifications.nonFunctionalRequirements.forEach(req => {
    y = checkPageBreak(doc, y + 5);
    y = drawText(doc, `• ${req.category} - ${req.requirement}: ${req.target}`, 40, y);
  });
  y += 20;

  // 3. User Stories
  y = drawSectionTitle(doc, '3. User Stories', y);
  specifications.userStories.forEach(story => {
    y = checkPageBreak(doc, y + 10);
    y = drawText(doc, `${story.id}: ${story.persona} (Priorité: ${story.priority})`, 40, y, { fontStyle: 'bold' });
    y = drawText(doc, `"${story.story}"`, 50, y, { fontStyle: 'italic' });
    y += 5;
  });
  y += 20;
  
  // 4. Architecture
  y = drawSectionTitle(doc, '4. Architecture Technique', y);
  const arch = specifications.technicalArchitecture;
  y = drawText(doc, `Frontend: ${arch.frontend.join(', ')}`, 40, y);
  y = drawText(doc, `Backend: ${arch.backend.join(', ')}`, 40, y);
  y = drawText(doc, `Base de données: ${arch.database.join(', ')}`, 40, y);
  y = drawText(doc, `Hébergement: ${arch.hosting.join(', ')}`, 40, y);
  y += 20;
  
  // 5. Timeline
  y = drawSectionTitle(doc, '5. Planning', y);
  specifications.timeline.forEach(phase => {
    y = checkPageBreak(doc, y + 10);
    y = drawText(doc, `${phase.name} (${phase.duration})`, 40, y, { fontStyle: 'bold' });
    y = drawText(doc, `Livrables: ${phase.deliverables.join(', ')}`, 50, y);
    y += 5;
  });
  y += 20;
  
  // 6. Budget
  y = drawSectionTitle(doc, '6. Budget', y);
  const budget = specifications.budget;
  y = drawText(doc, `Développement: ${budget.development.toLocaleString('fr-FR')}€`, 40, y);
  y = drawText(doc, `Design: ${budget.design.toLocaleString('fr-FR')}€`, 40, y);
  y = drawText(doc, `Tests: ${budget.testing.toLocaleString('fr-FR')}€`, 40, y);
  y = drawText(doc, `Déploiement: ${budget.deployment.toLocaleString('fr-FR')}€`, 40, y);
  y = drawText(doc, `Maintenance: ${budget.maintenance.toLocaleString('fr-FR')}€`, 40, y);
  y += 5;
  y = drawText(doc, `Total estimé: ${budget.total.toLocaleString('fr-FR')}€`, 40, y, { fontStyle: 'bold', fontSize: 12 });
  y += 20;

  // 7. Risks
  y = drawSectionTitle(doc, '7. Risques', y);
  specifications.risks.forEach(risk => {
    y = checkPageBreak(doc, y + 10);
    y = drawText(doc, risk.description, 40, y, { fontStyle: 'bold' });
    y = drawText(doc, `Probabilité: ${risk.probability}, Impact: ${risk.impact}`, 50, y);
    y = drawText(doc, `Mitigation: ${risk.mitigation}`, 50, y);
    y += 5;
  });

  // Save the PDF
  const safeTitle = specifications.projectIdea.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  doc.save(`cahier-des-charges-${safeTitle}.pdf`);
};
