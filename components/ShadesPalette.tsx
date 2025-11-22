
import React from 'react';
import { generateShades, getContrastColor } from '../utils/colorUtils';

interface ShadesPaletteProps {
  baseColor: string;
  onSelect: (color: string) => void;
}

const ShadesPalette: React.FC<ShadesPaletteProps> = ({ baseColor, onSelect }) => {
  const shades = generateShades(baseColor);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Nuances & Variations</h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
        {shades.map((shade, index) => (
          <div key={`${shade}-${index}`} className="flex flex-col items-center gap-2">
            <button
              onClick={() => onSelect(shade)}
              className="w-full h-10 rounded-lg shadow-sm border border-slate-100 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={{ backgroundColor: shade }}
              title={shade}
            />
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              {shade}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShadesPalette;