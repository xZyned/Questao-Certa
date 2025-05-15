
/**
 * Main OMR service entry point
 */
import { ProcessedResult } from '@/components/ImageProcessor';
import { detectMarks } from './markDetector';
import { generateResult, getDefaultAnswerKey } from './resultProcessor';
import { generateTemplate, saveTemplate, TemplateConfig } from './templateGenerator';

/**
 * Main function to process an OMR image
 */
export const processOMRImage = async (
  image: File,
  totalQuestions: number = 15,
  answerKey?: { [questionNumber: number]: string }
): Promise<ProcessedResult> => {
  try {
    // Create object URL from the file
    const imageUrl = URL.createObjectURL(image);
    
    // Detect marks in the image
    const detectionResult = await detectMarks(imageUrl, {
      rows: totalQuestions,
      cols: 4,
      topMargin: Math.floor(image.height * 0.2),
      leftMargin: Math.floor(image.width * 0.1),
      rowSpacing: Math.floor(image.height * 0.05),
      colSpacing: Math.floor(image.width * 0.05),
      bubbleWidth: Math.floor(image.width * 0.03),
      bubbleHeight: Math.floor(image.height * 0.03)
    });
    
    // Use default answer key if none provided
    const key = answerKey || getDefaultAnswerKey(totalQuestions);
    
    // Generate the result
    return generateResult(
      image.name,
      imageUrl,
      detectionResult.processedImageUrl,
      detectionResult.answers,
      key,
      totalQuestions
    );
  } catch (error) {
    console.error('Error processing OMR image:', error);
    throw error;
  }
};

/**
 * Export template generation functionality
 */
export { generateTemplate, saveTemplate, type TemplateConfig };
