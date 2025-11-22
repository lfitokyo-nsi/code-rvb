
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ColorDetails from './components/ColorDetails';
import ShadesPalette from './components/ShadesPalette';

// Start with a nice blue
const INITIAL_COLOR = "#6366f1";

const App: React.FC = () => {
  const [color, setColor] = useState<string>(INITIAL_COLOR);
  const [history, setHistory] = useState<string[]>([]);

  // Check for hash in URL to set initial color and load history
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && /^#[0-9A-F]{6}$/i.test(hash)) {
      setColor(hash);
    }

    // Load history from local storage
    const savedHistory = localStorage.getItem('color_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Update URL hash when color changes and update history (debounced)
  useEffect(() => {
    window.location.hash = color;

    // Debounce history update to avoid saving every step of dragging
    const timeoutId = setTimeout(() => {
      setHistory((prev) => {
        // Avoid duplicates at the very top
        if (prev.length > 0 && prev[0] === color) return prev;
        
        // Add to front, remove duplicates elsewhere, limit to 15
        const newHistory = [color, ...prev.filter(c => c !== color)].slice(0, 15);
        
        localStorage.setItem('color_history', JSON.stringify(newHistory));
        return newHistory;
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [color]);

  const handleClearHistory = () => {
    localStorage.removeItem('color_history');
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar / Controls - Mobile: Top, Desktop: Left */}
            <div className="lg:col-span-4 order-2 lg:order-1 space-y-6">
              <Sidebar 
                color={color} 
                onChange={setColor} 
                history={history} 
                onClearHistory={handleClearHistory}
              />
            </div>

            {/* Main Display - Mobile: Bottom, Desktop: Right */}
            <div className="lg:col-span-8 order-1 lg:order-2">
               <ColorDetails color={color} />
               <ShadesPalette baseColor={color} onSelect={setColor} />
            </div>

          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Sélecteur de Couleur Pro. Créé avec React & Tailwind.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;