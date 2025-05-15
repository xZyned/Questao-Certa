
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import ImageProcessor, { ProcessedResult } from '@/components/ImageProcessor';
import ResultsDisplay from '@/components/ResultsDisplay';

const Index = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [results, setResults] = useState<ProcessedResult[]>([]);

  const handleImagesSelected = (images: File[]) => {
    setSelectedImages(images);
    setResults([]);
  };

  const handleProcessingComplete = (processedResults: ProcessedResult[]) => {
    setResults(processedResults);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questão Certa
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Corrija exames de múltipla escolha automaticamente. Basta fazer upload das imagens
            dos gabaritos e nosso sistema identificará automaticamente as marcações.
          </p>
        </div>
        
        <section className="mb-10">
          <div className="grid grid-cols-1 gap-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4">Upload de Imagens</h2>
              <ImageUploader onImagesSelected={handleImagesSelected} />
            </div>
            
            {selectedImages.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Processamento</h2>
                <ImageProcessor 
                  images={selectedImages} 
                  onProcessingComplete={handleProcessingComplete} 
                />
              </div>
            )}
            
            {results.length > 0 && <ResultsDisplay results={results} />}
          </div>
        </section>
        
        <section className="mb-10 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Como funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-primary text-white flex items-center justify-center mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">Faça Upload</h3>
              <p className="text-gray-600">
                Envie imagens dos gabaritos preenchidos para análise.
                Suportamos arquivos JPG, PNG até 20MB.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-primary text-white flex items-center justify-center mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">Processamento</h3>
              <p className="text-gray-600">
                Nosso sistema analisará automaticamente as marcações
                e identificará as respostas corretas e incorretas.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-primary text-white flex items-center justify-center mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">Resultados</h3>
              <p className="text-gray-600">
                Veja os resultados detalhados, pontuações e estatísticas
                para cada gabarito processado.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
