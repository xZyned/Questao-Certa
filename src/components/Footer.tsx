
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Questão Certa - Todos os direitos reservados
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500 text-sm">
              Simplificando a correção de exames de múltipla escolha
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
