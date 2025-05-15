
import { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="bg-blue-primary py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 3v18m3-10h8M12.5 11a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-white">Questão Certa</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
