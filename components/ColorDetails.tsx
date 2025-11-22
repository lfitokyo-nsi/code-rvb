import React, { useState } from 'react';
import { Copy, Check, Hash, BookOpen } from 'lucide-react';
import { hexToRgb, getContrastColor } from '../utils/colorUtils';

interface ColorDetailsProps {
  color: string;
}

const ColorDetails: React.FC<ColorDetailsProps> = ({ color }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const rgb = hexToRgb(color);
  const textColor = getContrastColor(color);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '';
  const cssString = `background-color: ${color};`;

  return (
    <div className="space-y-6">
      {/* Large Preview Card */}
      <div 
        className="relative w-full h-48 sm:h-64 rounded-2xl shadow-lg transition-all duration-500 ease-in-out flex items-center justify-center group"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-black rounded-2xl"></div>
        <h2 
          className="text-4xl sm:text-5xl font-black tracking-tighter opacity-90 scale-95 group-hover:scale-100 transition-transform duration-300"
          style={{ color: textColor }}
        >
          {color}
        </h2>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* HEX Row */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <Hash size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Hex Code</p>
              <p className="text-lg font-mono font-medium text-slate-900">{color}</p>
            </div>
          </div>
          <button 
            onClick={() => handleCopy(color, 'hex')}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all active:scale-95"
            title="Copier Hex"
          >
            {copiedField === 'hex' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
          </button>
        </div>

        {/* RGB Row */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <span className="font-bold text-xs">RGB</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">RGB Value</p>
              <p className="text-lg font-mono font-medium text-slate-900">{rgbString}</p>
            </div>
          </div>
          <button 
            onClick={() => handleCopy(rgbString, 'rgb')}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all active:scale-95"
            title="Copier RGB"
          >
            {copiedField === 'rgb' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
          </button>
        </div>

        {/* CSS Row */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">CSS Snippet</p>
              <p className="text-sm font-mono text-slate-600 truncate max-w-[200px] sm:max-w-xs">{cssString}</p>
            </div>
          </div>
          <button 
            onClick={() => handleCopy(cssString, 'css')}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all active:scale-95"
            title="Copier CSS"
          >
            {copiedField === 'css' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorDetails;