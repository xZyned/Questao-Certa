
/**
 * Template generation utilities for OMR system
 */
import jsPDF from 'jspdf';

export type TemplateConfig = {
  questionCount: number;
  optionsPerQuestion: string[];
  title?: string;
  subtitle?: string;
  pageSize?: string;
  showQuestionNumbers?: boolean;
};

/**
 * Generates an OMR sheet template as a PDF
 */
export const generateTemplate = (config: TemplateConfig): jsPDF => {
  const {
    questionCount,
    optionsPerQuestion = ['A', 'B', 'C', 'D'],
    title = 'Folha de Respostas',
    subtitle = 'Preencha completamente os círculos correspondentes às respostas corretas',
    pageSize = 'a4',
    showQuestionNumbers = true
  } = config;
  
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: pageSize
  });
  
  // Set font
  doc.setFont('helvetica');
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 105, 20, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(12);
  doc.text(subtitle, 105, 30, { align: 'center' });
  
  // Add student information fields
  doc.setFontSize(10);
  doc.text('Nome do Aluno:', 20, 50);
  doc.line(55, 50, 190, 50);
  
  doc.text('Número de Identificação:', 20, 60);
  doc.line(75, 60, 130, 60);
  
  doc.text('Data:', 140, 60);
  doc.line(155, 60, 190, 60);
  
  // Draw alignment markers
  drawAlignmentMarkers(doc);
  
  // Start answering grid at y=80mm
  const startY = 80;
  const startX = 40;
  const optionSpacing = 15;
  const questionSpacing = 12;
  
  // Draw header row
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  if (showQuestionNumbers) {
    doc.text('Questão', startX - 15, startY);
  }
  
  optionsPerQuestion.forEach((option, i) => {
    doc.text(option, startX + (i * optionSpacing) + 5, startY);
  });
  
  doc.setFont('helvetica', 'normal');
  
  // Draw answer grid
  for (let i = 0; i < questionCount; i++) {
    const y = startY + ((i + 1) * questionSpacing);
    
    if (showQuestionNumbers) {
      // Write question number
      doc.text(`${i + 1}`, startX - 15, y);
    }
    
    // Draw bubbles for each option
    optionsPerQuestion.forEach((_, j) => {
      const x = startX + (j * optionSpacing);
      doc.circle(x + 5, y - 3, 3);
    });
  }
  
  // Add instructions at bottom
  doc.setFontSize(9);
  doc.text('Instruções: Preencha completamente o círculo correspondente à sua resposta.', 105, 270, { align: 'center' });
  doc.text('Evite fazer marcas ou dobras nesta folha para melhor leitura do sistema.', 105, 275, { align: 'center' });
  
  return doc;
};

/**
 * Draws alignment markers on the template
 */
const drawAlignmentMarkers = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const markerSize = 10;
  const margin = 10;
  
  // Top left marker
  doc.rect(margin, margin, markerSize, markerSize, 'F');
  
  // Top right marker
  doc.rect(pageWidth - margin - markerSize, margin, markerSize, markerSize, 'F');
  
  // Bottom left marker
  doc.rect(margin, pageHeight - margin - markerSize, markerSize, markerSize, 'F');
  
  // Bottom right marker
  doc.rect(pageWidth - margin - markerSize, pageHeight - margin - markerSize, markerSize, markerSize, 'F');
};

/**
 * Saves the template as a PDF file
 */
export const saveTemplate = (doc: jsPDF, filename: string = 'omr-template.pdf') => {
  doc.save(filename);
};
