
import React, { useState, useEffect, useRef } from 'react';
import { History, RotateCcw } from 'lucide-react';
import { hexToRgb, rgbToHex, rgbToHsv, hsvToHex } from '../utils/colorUtils';

interface SidebarProps {
  color: string;
  onChange: (color: string) => void;
  history: string[];
  onClearHistory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ color, onChange, history, onClearHistory }) => {
  // On utilise un state local pour les sliders RGB pour éviter le "saut" (jitter)
  // causé par le délai de mise à jour parent -> enfant ou la conversion hex.
  const [localRgb, setLocalRgb] = useState(hexToRgb(color) || { r: 0, g: 0, b: 0 });
  
  // État local pour HSV afin de maintenir la position du curseur même si on sélectionne du noir/blanc
  const [hsv, setHsv] = useState({ h: 0, s: 100, v: 100 });
  const [isDraggingSat, setIsDraggingSat] = useState(false);
  const satBoxRef = useRef<HTMLDivElement>(null);

  // Synchroniser localRgb quand la prop `color` change (venant de l'extérieur, ex: historique ou hex input)
  useEffect(() => {
    const derivedRgb = hexToRgb(color);
    if (derivedRgb) {
      setLocalRgb(derivedRgb);
    }
  }, [color]);

  // Synchroniser HSV depuis la prop color
  useEffect(() => {
    if (!isDraggingSat) {
      const rgb = hexToRgb(color) || { r: 0, g: 0, b: 0 };
      const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setHsv(prev => ({
        h: newHsv.s === 0 ? prev.h : newHsv.h,
        s: newHsv.s,
        v: newHsv.v
      }));
    }
  }, [color, isDraggingSat]);

  // Gestionnaires pour la zone Saturation/Luminosité
  const handleSatMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSat(true);
    updateSatVal(e);
  };

  const updateSatVal = (e: MouseEvent | React.MouseEvent) => {
    if (!satBoxRef.current) return;
    const rect = satBoxRef.current.getBoundingClientRect();
    
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Clamp
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    const s = Math.round((x / rect.width) * 100);
    const v = Math.round(100 - (y / rect.height) * 100);

    setHsv(prev => {
        const newHsv = { ...prev, s, v };
        onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
        return newHsv;
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSat) updateSatVal(e);
    };
    const handleMouseUp = () => setIsDraggingSat(false);

    if (isDraggingSat) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSat]);


  // Gestionnaires pour le slider de teinte (Hue)
  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newH = parseInt(e.target.value);
    setHsv(prev => {
        const newHsv = { ...prev, h: newH };
        onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
        return newHsv;
    });
  };

  // Gestionnaires pour les sliders RVB
  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    const numVal = Math.min(255, Math.max(0, parseInt(value) || 0));
    
    // Mise à jour immédiate du state local (fluidité UI)
    const newRgb = { ...localRgb, [component]: numVal };
    setLocalRgb(newRgb);
    
    // Propagation au parent
    onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  return (
    <div className="space-y-8">
      
      {/* Main Color Picker */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer">
        
        {/* Saturation / Value Box */}
        <div 
            className="w-full h-48 rounded-xl shadow-inner mb-5 relative cursor-pointer overflow-hidden touch-none"
            ref={satBoxRef}
            onMouseDown={handleSatMouseDown}
            style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
        >
            {/* White Gradient Horizontal */}
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            {/* Black Gradient Vertical */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
            
            {/* Cursor */}
            <div 
                className="absolute w-4 h-4 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md pointer-events-none"
                style={{ 
                    left: `${hsv.s}%`, 
                    top: `${100 - hsv.v}%`,
                    backgroundColor: color 
                }} 
            />
        </div>

        {/* Hue Slider */}
        <div className="mb-6">
            <input 
                type="range" 
                min="0" 
                max="360" 
                value={hsv.h}
                onChange={handleHueChange}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                    background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                }}
            />
        </div>

        {/* RGB Sliders Section */}
        <div className="space-y-5 pt-4 border-t border-slate-100">
          {/* Red */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wide">
              <span>Rouge</span>
              <span>{localRgb.r}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={localRgb.r}
              onChange={(e) => handleRgbChange('r', e.target.value)}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* Green */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wide">
              <span>Vert</span>
              <span>{localRgb.g}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={localRgb.g}
              onChange={(e) => handleRgbChange('g', e.target.value)}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Blue */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wide">
              <span>Bleu</span>
              <span>{localRgb.b}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={localRgb.b}
              onChange={(e) => handleRgbChange('b', e.target.value)}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
        
        {/* Hex Input */}
        <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono">#</span>
              <input 
                  type="text" 
                  value={color.replace('#', '').toUpperCase()} 
                  onChange={(e) => {
                      const val = e.target.value;
                      if (/^[0-9A-F]*$/i.test(val) && val.length <= 6) {
                         const newHex = '#' + val;
                         if (val.length === 6) {
                            onChange(newHex);
                         }
                      }
                  }}
                  className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-slate-700 outline-none uppercase cursor-text"
                  maxLength={6}
              />
            </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 text-slate-800">
            <div className="flex items-center gap-2">
                <History size={18} />
                <h3 className="text-lg font-semibold">Historique</h3>
            </div>
            <button 
                onClick={onClearHistory}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                title="Effacer l'historique"
            >
                <RotateCcw size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {history.map((histColor, idx) => (
              <button
                key={`${histColor}-${idx}`}
                onClick={() => onChange(histColor)}
                className="w-8 h-8 rounded-full shadow-sm border border-slate-100 hover:scale-110 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                style={{ backgroundColor: histColor }}
                title={histColor}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
