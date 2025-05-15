
/**
 * Result processing utilities for OMR system
 */
import { ProcessedResult } from '@/components/ImageProcessor';

export type AnswerKey = {
  [questionNumber: number]: string;
};

/**
 * Compares detected answers against an answer key
 */
export const evaluateAnswers = (
  detectedAnswers: {
    questionNumber: number;
    markedOption: string;
  }[],
  answerKey: AnswerKey,
  totalQuestions: number
): ProcessedResult['answers'] => {
  const results: ProcessedResult['answers'] = [];
  
  // Create a map of the detected answers for easier lookup
  const detectedAnswersMap = new Map<number, string>();
  detectedAnswers.forEach(answer => {
    detectedAnswersMap.set(answer.questionNumber, answer.markedOption);
  });
  
  // For each question in the answer key
  for (let i = 1; i <= totalQuestions; i++) {
    const correctOption = answerKey[i];
    const markedOption = detectedAnswersMap.get(i) || '';
    
    results.push({
      questionNumber: i,
      markedOption: markedOption,
      isCorrect: markedOption ? (markedOption === correctOption) : false
    });
  }
  
  return results;
};

/**
 * Calculates score based on evaluated answers
 */
export const calculateScore = (
  evaluatedAnswers: ProcessedResult['answers']
): ProcessedResult['score'] => {
  const total = evaluatedAnswers.length;
  const answeredQuestions = evaluatedAnswers.filter(a => a.markedOption).length;
  const correct = evaluatedAnswers.filter(a => a.isCorrect).length;
  
  return {
    correct,
    total,
    percentage: (correct / total) * 100
  };
};

/**
 * Generates a complete result from the OMR processing
 */
export const generateResult = (
  imageName: string,
  imageUrl: string,
  processedImageUrl: string,
  detectedAnswers: {
    questionNumber: number;
    markedOption: string;
  }[],
  answerKey: AnswerKey,
  totalQuestions: number
): ProcessedResult => {
  // Evaluate answers against answer key
  const evaluatedAnswers = evaluateAnswers(detectedAnswers, answerKey, totalQuestions);
  
  // Calculate score
  const score = calculateScore(evaluatedAnswers);
  
  return {
    imageName,
    imageUrl,
    processedImageUrl,
    answers: evaluatedAnswers,
    score
  };
};

/**
 * Default answer key for testing
 */
export const getDefaultAnswerKey = (totalQuestions: number = 15): AnswerKey => {
  const answerKey: AnswerKey = {};
  const options = ['A', 'B', 'C', 'D'];
  
  for (let i = 1; i <= totalQuestions; i++) {
    // Generate a pseudo-random answer for each question
    const randomIndex = Math.floor((i * 1234) % options.length);
    answerKey[i] = options[randomIndex];
  }
  
  return answerKey;
};
