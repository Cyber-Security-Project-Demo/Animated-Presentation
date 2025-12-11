import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { AttackSelector } from './components/AttackSelector';
import { SQLInjectionDemo } from './demos/SQLInjectionDemo';
import { XSSDemo } from './demos/XSSDemo';
import { IDORDemo } from './demos/IDORDemo';
import { CSRFDemo } from './demos/CSRFDemo';
import { CommandInjectionDemo } from './demos/CommandInjectionDemo';

export type AttackType = 'sqli' | 'xss' | 'idor' | 'csrf' | 'command-injection';

export interface DemoControls {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

function App() {
  const [selectedAttack, setSelectedAttack] = useState<AttackType | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => setIsPlaying(true);
  const handleBack = () => {
    setSelectedAttack(null);
    setIsPlaying(true);
  };

  const demoControls: DemoControls = {
    isPlaying,
    onPlayPause: handlePlayPause,
    onReset: handleReset
  };

  const renderDemo = () => {
    switch (selectedAttack) {
      case 'sqli':
        return <SQLInjectionDemo controls={demoControls} />;
      case 'xss':
        return <XSSDemo controls={demoControls} />;
      case 'idor':
        return <IDORDemo controls={demoControls} />;
      case 'csrf':
        return <CSRFDemo controls={demoControls} />;
      case 'command-injection':
        return <CommandInjectionDemo controls={demoControls} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AnimatePresence mode="wait">
        {!selectedAttack ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex flex-col"
          >
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 p-6">
              <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
                <Shield className="w-10 h-10 text-blue-600" />
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                    Cyber Attack Demos
                  </h1>
                  <p className="text-slate-500 font-medium mt-1">
                    Interactive Educational Tool for Understanding Security Vulnerabilities
                  </p>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
              <AttackSelector onSelectAttack={setSelectedAttack} />
            </main>

            {/* Footer */}
            <footer className="bg-yellow-100 border-t border-yellow-200 p-4">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-yellow-800 font-bold text-sm md:text-base">
                  ⚠️ For Educational Purposes Only • Never Attempt on Real Systems • Always Practice Ethical Security
                </p>
              </div>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="demo"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex flex-col"
          >
            {/* Demo Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 p-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Menu</span>
                </button>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>
            </header>

            {/* Demo Content */}
            <main className="flex-1">
              {renderDemo()}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;