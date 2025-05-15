
import { FC, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, Image } from 'lucide-react';

// Limite máximo de arquivos que podem ser enviados de uma vez (20MB no total)
const MAX_FILES = 50;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface ImageUploaderProps {
  onImagesSelected: (images: File[]) => void;
}

const ImageUploader: FC<ImageUploaderProps> = ({ onImagesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFiles = (files: File[]): File[] => {
    // Verificar número de arquivos
    if (files.length > MAX_FILES) {
      toast.error(`Você só pode enviar até ${MAX_FILES} imagens de uma vez`);
      return files.slice(0, MAX_FILES);
    }

    // Verificar tipos de arquivo
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`O arquivo "${file.name}" não é uma imagem válida`);
        return false;
      }
      return true;
    });

    // Verificar tamanho total
    let totalSize = 0;
    const sizeValidFiles = validFiles.filter(file => {
      totalSize += file.size;
      if (totalSize > MAX_FILE_SIZE) {
        toast.error(`O tamanho total dos arquivos excede o limite de 20MB`);
        return false;
      }
      return true;
    });

    return sizeValidFiles;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(fileArray);

      if (validFiles.length > 0) {
        onImagesSelected(validFiles);
        toast.success(`${validFiles.length} ${validFiles.length === 1 ? 'imagem selecionada' : 'imagens selecionadas'}`);
      }
    }
  }, [onImagesSelected]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      const validFiles = validateFiles(fileArray);

      if (validFiles.length > 0) {
        onImagesSelected(validFiles);
        toast.success(`${validFiles.length} ${validFiles.length === 1 ? 'imagem selecionada' : 'imagens selecionadas'}`);
      }
    }
  }, [onImagesSelected]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-blue-primary bg-blue-50' : 'border-gray-300'
          } transition-colors duration-200`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            {isDragging ? (
              <Image className="h-16 w-16 text-blue-primary animate-pulse" />
            ) : (
              <Upload className="h-16 w-16 text-gray-400" />
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                Arraste e solte as imagens aqui
              </h3>
              <p className="text-sm text-gray-500">
                Suporta arquivos JPG, PNG ou JPEG até 20MB
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="file-upload">
                <Button type="button" className="cursor-pointer">
                  Selecionar Imagens
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                  />
                </Button>
              </label>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Limite de {MAX_FILES} arquivos (máximo de 20MB no total)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
