
import { FC } from 'react';
import { Link } from 'react-router-dom';

const Footer: FC = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Questão Certa - Todos os direitos reservados
          </p>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-blue-primary text-sm">
              Início
            </Link>
            <Link to="/templates" className="text-gray-600 hover:text-blue-primary text-sm">
              Modelos de Prova
            </Link>
            <p className="text-gray-500 text-sm mt-2 md:mt-0 md:ml-4">
              Simplificando a correção de exames de múltipla escolha
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
