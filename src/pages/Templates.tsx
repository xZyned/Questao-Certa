
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateTemplate, saveTemplate } from '@/services/omr/templateGenerator';

const Templates = () => {
  const [questionCount, setQuestionCount] = useState<string>("10");
  const { toast } = useToast();
  
  const handleDownload = () => {
    try {
      // Generate the template with jsPDF
      const doc = generateTemplate({
        questionCount: parseInt(questionCount),
        optionsPerQuestion: ['A', 'B', 'C', 'D'],
        title: 'Questão Certa - Folha de Respostas',
        subtitle: `Gabarito de Múltipla Escolha - ${questionCount} questões`
      });
      
      // Save the template
      saveTemplate(doc, `gabarito-${questionCount}-questoes.pdf`);
      
      toast({
        title: "Download concluído",
        description: `Modelo de prova com ${questionCount} questões foi baixado com sucesso.`,
      });
    } catch (error) {
      console.error('Error generating template:', error);
      
      toast({
        title: "Erro ao gerar modelo",
        description: "Houve um problema ao gerar o modelo de prova. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Modelos de Prova Otimizados
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Baixe modelos de prova otimizados para leitura e reconhecimento automático.
            Estes modelos são projetados para garantir a máxima precisão na correção.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Baixar Modelo de Prova</CardTitle>
              <CardDescription>
                Escolha a quantidade de questões desejada e baixe o modelo otimizado para impressão.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <label htmlFor="question-count" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de Questões
                  </label>
                  <Select
                    value={questionCount}
                    onValueChange={setQuestionCount}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a quantidade de questões" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 questões</SelectItem>
                      <SelectItem value="10">10 questões</SelectItem>
                      <SelectItem value="15">15 questões</SelectItem>
                      <SelectItem value="20">20 questões</SelectItem>
                      <SelectItem value="30">30 questões</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-5 w-5 text-blue-primary" />
                    <span className="font-medium">Informações do Modelo</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>• Formato A4 otimizado para impressão</li>
                    <li>• Marcações de alta visibilidade para leitura</li>
                    <li>• Espaço para identificação do aluno</li>
                    <li>• Marcadores de orientação para alinhamento</li>
                    <li>• {questionCount} questões com alternativas A-D</li>
                    <li>• Compatível com impressoras padrão</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleDownload} className="w-full gap-2">
                <Download className="h-4 w-4" />
                Baixar Modelo ({questionCount} questões)
              </Button>
            </CardFooter>
          </Card>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
            <h3 className="font-medium text-blue-primary mb-2">Dicas para melhores resultados</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Imprima em papel branco sem marcas d'água ou padrões</li>
              <li>• Certifique-se de que a impressão está nítida e sem distorções</li>
              <li>• Oriente os alunos a preencherem completamente os círculos</li>
              <li>• Evite dobras ou amassados nos formulários</li>
              <li>• Digitalize em alta resolução (mínimo 300 DPI)</li>
              <li>• Mantenha o documento alinhado durante a digitalização</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Templates;
