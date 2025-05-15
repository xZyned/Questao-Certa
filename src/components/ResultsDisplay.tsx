
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import type { ProcessedResult } from './ImageProcessor';

interface ResultsDisplayProps {
  results: ProcessedResult[];
}

const ResultsDisplay: FC<ResultsDisplayProps> = ({ results }) => {
  const [selectedTab, setSelectedTab] = useState<string>(results[0]?.imageName || "");

  if (results.length === 0) return null;

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Resultados</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="mb-4 flex flex-nowrap overflow-x-auto no-scrollbar pb-1">
              {results.map((result, index) => (
                <TabsTrigger key={result.imageName} value={result.imageName} className="whitespace-nowrap">
                  Imagem {index + 1} 
                  <Badge variant={result.score.percentage > 60 ? "default" : "destructive"} className="ml-2">
                    {result.score.percentage.toFixed(0)}%
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {results.map((result) => (
            <TabsContent key={result.imageName} value={result.imageName} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium mb-2">Imagem Analisada</h3>
                  <div className="bg-gray-100 rounded-lg p-2 overflow-hidden flex-1">
                    <img
                      src={result.imageUrl}
                      alt={`Gabarito ${result.imageName}`}
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium mb-2">Resumo</h3>
                    <div className="flex items-center gap-2 text-2xl font-bold">
                      <span className="text-green-accent">{result.score.correct}</span>
                      <span className="text-gray-400">/</span>
                      <span>{result.score.total}</span>
                      <span className="ml-2 text-lg">
                        ({result.score.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          result.score.percentage >= 70
                            ? 'bg-green-accent'
                            : result.score.percentage >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${result.score.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Questões</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {result.answers.map((answer) => (
                        <div 
                          key={answer.questionNumber}
                          className={`flex items-center justify-between p-2 rounded border ${
                            answer.isCorrect 
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <span className="font-medium">Q{answer.questionNumber}:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{answer.markedOption}</span>
                            {answer.isCorrect ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
