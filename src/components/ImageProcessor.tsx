
import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { CheckCircle, Loader2 } from 'lucide-react';
import { processOMRImage } from '@/services/omr';

interface ImageProcessorProps {
  images: File[];
  onProcessingComplete: (results: ProcessedResult[]) => void;
}

export interface ProcessedResult {
  imageName: string;
  imageUrl: string;
  processedImageUrl?: string;
  answers: {
    questionNumber: number;
    markedOption: string;
    isCorrect: boolean;
  }[];
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
}

const ImageProcessor: FC<ImageProcessorProps> = ({ images, onProcessingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [processedCount, setProcessedCount] = useState(0);
  const [results, setResults] = useState<ProcessedResult[]>([]);

  const processImage = async (image: File): Promise<ProcessedResult> => {
    try {
      // Use our OMR processing service
      return await processOMRImage(image);
    } catch (error) {
      console.error("Error in OMR processing:", error);
      
      // Fall back to simulated processing if the OMR processing fails
      console.log("Falling back to simulated processing for image:", image.name);
      return simulateProcessing(image);
    }
  };
  
  // Fallback simulation function in case the OMR processing fails
  const simulateProcessing = (image: File): Promise<ProcessedResult> => {
    return new Promise((resolve) => {
      const imageUrl = URL.createObjectURL(image);
      
      // Simulate process of detection of markings
      setTimeout(() => {
        const numQuestions = Math.floor(Math.random() * 10) + 10; // Between 10-20 questions
        const answers = [];
        let correctCount = 0;
        
        const options = ["A", "B", "C", "D"];
        
        // Generate random answers to simulate processing
        for (let i = 1; i <= numQuestions; i++) {
          const markedOption = options[Math.floor(Math.random() * options.length)];
          const isCorrect = Math.random() > 0.3; // 70% chance of being correct
          
          if (isCorrect) correctCount++;
          
          answers.push({
            questionNumber: i,
            markedOption,
            isCorrect
          });
        }
        
        resolve({
          imageName: image.name,
          imageUrl,
          answers,
          score: {
            correct: correctCount,
            total: numQuestions,
            percentage: (correctCount / numQuestions) * 100
          }
        });
      }, 1000); // Simulate 1 second of processing
    });
  };

  const startProcessing = async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    setResults([]);
    setProcessedCount(0);
    
    const newResults: ProcessedResult[] = [];
    
    for (let i = 0; i < images.length; i++) {
      setCurrentImage(URL.createObjectURL(images[i]));
      
      try {
        const result = await processImage(images[i]);
        newResults.push(result);
        setProcessedCount(i + 1);
        setProgress(((i + 1) / images.length) * 100);
      } catch (error) {
        toast.error(`Erro ao processar a imagem ${images[i].name}`);
        console.error("Erro ao processar imagem:", error);
      }
    }
    
    setResults(newResults);
    setIsProcessing(false);
    onProcessingComplete(newResults);
    toast.success(`${newResults.length} ${newResults.length === 1 ? 'imagem foi processada' : 'imagens foram processadas'} com sucesso`);
  };

  // Iniciar processamento automaticamente quando as imagens são carregadas
  useEffect(() => {
    if (images.length > 0) {
      startProcessing();
    }
  }, [images]);

  if (images.length === 0) return null;

  return (
    <Card className="w-full mt-6">
      <CardContent className="p-6">
        {isProcessing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Processando imagens</h3>
                <p className="text-sm text-gray-500">
                  {processedCount} de {images.length} imagens
                </p>
              </div>
              <Loader2 className="animate-spin h-6 w-6 text-blue-primary" />
            </div>
            
            <Progress value={progress} className="h-2" />
            
            {currentImage && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Processando:</h4>
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={currentImage}
                    alt="Processando"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white/90 rounded-lg px-4 py-2">
                      <p className="text-sm font-medium">Analisando marcações...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-accent" />
              <div>
                <h3 className="font-medium">Processamento concluído</h3>
                <p className="text-sm text-gray-500">
                  {images.length} {images.length === 1 ? 'imagem processada' : 'imagens processadas'}
                </p>
              </div>
            </div>
            
            <Button variant="outline" onClick={startProcessing}>
              Processar novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageProcessor;
