
/**
 * Mark detection utilities for OMR processing
 */
import { preprocessImage } from './imagePreprocessor';

export type AnswerBubble = {
  questionNumber: number;
  option: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isFilled: boolean;
};

export type DetectedMarks = {
  processedImageUrl: string;
  answers: {
    questionNumber: number;
    markedOption: string;
    isCorrect?: boolean;
  }[];
};

/**
 * Simplified bubble detection algorithm
 * In a real implementation, this would use more sophisticated 
 * computer vision techniques to detect circles/bubbles
 */
export const detectBubbles = (
  imageData: ImageData, 
  gridConfig: {
    rows: number;
    cols: number;
    topMargin: number;
    leftMargin: number;
    rowSpacing: number;
    colSpacing: number;
    bubbleWidth: number;
    bubbleHeight: number;
  }
): AnswerBubble[] => {
  const { 
    rows, cols, topMargin, leftMargin, 
    rowSpacing, colSpacing, bubbleWidth, bubbleHeight 
  } = gridConfig;
  
  const bubbles: AnswerBubble[] = [];
  const options = ['A', 'B', 'C', 'D'];
  
  // For each row (question)
  for (let row = 0; row < rows; row++) {
    // For each column (option)
    for (let col = 0; col < cols; col++) {
      const questionNumber = row + 1;
      const option = options[col];
      
      const x = leftMargin + (col * colSpacing);
      const y = topMargin + (row * rowSpacing);
      
      bubbles.push({
        questionNumber,
        option,
        x,
        y,
        width: bubbleWidth,
        height: bubbleHeight,
        isFilled: false // Will be determined later
      });
    }
  }
  
  return bubbles;
};

/**
 * Determines if a bubble is filled by analyzing pixel darkness
 */
export const detectFilledBubbles = (
  imageData: ImageData,
  bubbles: AnswerBubble[],
  threshold: number = 128
): AnswerBubble[] => {
  const data = imageData.data;
  const width = imageData.width;
  
  return bubbles.map(bubble => {
    let darkPixelCount = 0;
    let totalPixelCount = 0;
    
    // Scan the area of the bubble
    for (let y = bubble.y; y < bubble.y + bubble.height; y++) {
      for (let x = bubble.x; x < bubble.x + bubble.width; x++) {
        // Ensure we're within the image bounds
        if (x >= 0 && x < width && y >= 0 && y < imageData.height) {
          const idx = (y * width + x) * 4;
          const pixelValue = data[idx];
          
          // If pixel is dark
          if (pixelValue < threshold) {
            darkPixelCount++;
          }
          totalPixelCount++;
        }
      }
    }
    
    // Calculate the ratio of dark pixels
    const darkRatio = darkPixelCount / totalPixelCount;
    
    // A bubble is considered filled if dark ratio exceeds 30%
    return {
      ...bubble,
      isFilled: darkRatio > 0.3
    };
  });
};

/**
 * Process the detected bubbles into question/answer format
 */
export const processDetectedBubbles = (bubbles: AnswerBubble[]): {
  questionNumber: number;
  markedOption: string;
}[] => {
  const answers: { questionNumber: number; markedOption: string }[] = [];
  const questionMap = new Map<number, string>();
  
  // Find filled bubbles
  bubbles.filter(bubble => bubble.isFilled).forEach(bubble => {
    questionMap.set(bubble.questionNumber, bubble.option);
  });
  
  // Convert map to array
  questionMap.forEach((option, questionNumber) => {
    answers.push({ questionNumber, markedOption: option });
  });
  
  // Sort by question number
  return answers.sort((a, b) => a.questionNumber - b.questionNumber);
};

/**
 * Main function to process an image and detect OMR marks
 */
export const detectMarks = async (
  imageUrl: string,
  gridConfig = {
    rows: 15,     // Assuming 15 questions
    cols: 4,      // A, B, C, D options
    topMargin: 200,
    leftMargin: 100,
    rowSpacing: 50,
    colSpacing: 50,
    bubbleWidth: 30,
    bubbleHeight: 30
  }
): Promise<DetectedMarks> => {
  try {
    // Preprocess the image
    const { processedImageUrl, width, height } = await preprocessImage(imageUrl);
    
    // Load the processed image data
    const processedImageData = await loadImageData(processedImageUrl);
    
    // Detect bubbles
    const bubbles = detectBubbles(processedImageData, gridConfig);
    
    // Detect filled bubbles
    const filledBubbles = detectFilledBubbles(processedImageData, bubbles);
    
    // Process bubbles into answer format
    const answers = processDetectedBubbles(filledBubbles);
    
    return {
      processedImageUrl,
      answers
    };
  } catch (error) {
    console.error('Error detecting marks:', error);
    throw error;
  }
};

// Helper function to load image data
const loadImageData = (imageUrl: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
};
