import React from 'react';
import { Palette } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Palette size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Nuancier RVB</h1>
        </div>
        <nav>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            v1.0
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;