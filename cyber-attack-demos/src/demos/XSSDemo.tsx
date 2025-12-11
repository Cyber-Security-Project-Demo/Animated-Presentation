import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, Database, Lock, Unlock, ArrowRight, AlertTriangle, User } from 'lucide-react';
import { DemoControls } from '../App';

type Stage = 'normal' | 'trick' | 'leaked' | 'explanation' | 'protection' | 'safety';

const STAGES: { id: Stage; title: string; description: string; duration: number }[] = [
  { id: 'normal', title: 'Normal Search', description: 'User searches safely - database stays protected', duration: 4000 },
  { id: 'trick', title: 'Malicious Script', description: 'Attacker injects XSS script into search field', duration: 4000 },
  { id: 'leaked', title: 'Database Exposed!', description: 'Script executes and reveals all user data!', duration: 4000 },
  { id: 'explanation', title: 'What is XSS?', description: 'XSS tricks websites into running malicious code', duration: 4000 },
  { id: 'protection', title: 'Security ON', description: 'Input validation blocks the malicious script!', duration: 4000 },
  { id: 'safety', title: 'Stay Safe', description: 'Always validate and sanitize user inputs', duration: 4000 }
];

interface XSSDemoProps {
  controls: DemoControls;
}

export function XSSDemo({ controls }: XSSDemoProps) {
  const [currentStage, setCurrentStage] = useState<Stage>('normal');
  const [progress, setProgress] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [shieldActive, setShieldActive] = useState(false);
  const [databaseExposed, setDatabaseExposed] = useState(false);
  const [arrowStatus, setArrowStatus] = useState<'idle' | 'moving-normal' | 'moving-danger' | 'blocked'>('idle');
  const [showDatabase, setShowDatabase] = useState(false);

  const loopRef = useRef<number | null>(null);
  const typeTimeoutRef = useRef<number | null>(null);

  const TOTAL_DURATION = STAGES.reduce((acc, stage) => acc + stage.duration, 0);

  useEffect(() => {
    if (!controls.isPlaying) return;

    let startTime = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime) % TOTAL_DURATION;
      const totalProgress = (elapsed / TOTAL_DURATION) * 100;
      setProgress(totalProgress);

      let accumulatedTime = 0;
      let newStage: Stage = 'normal';
      for (const stage of STAGES) {
        accumulatedTime += stage.duration;
        if (elapsed < accumulatedTime) {
          newStage = stage.id;
          break;
        }
      }

      setCurrentStage(prev => {
        if (prev !== newStage) {
          handleStageTransition(newStage);
        }
        return newStage;
      });

      loopRef.current = requestAnimationFrame(tick);
    };

    loopRef.current = requestAnimationFrame(tick);

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
    };
  }, [controls.isPlaying]);

  useEffect(() => {
    if (!controls.isPlaying) {
      setCurrentStage('normal');
      setProgress(0);
      setInputValue('');
      setShieldActive(false);
      setDatabaseExposed(false);
      setArrowStatus('idle');
      setShowDatabase(false);
    }
  }, [controls.isPlaying]);

  const handleStageTransition = (stage: Stage) => {
    setArrowStatus('idle');
    setShowDatabase(false);

    switch (stage) {
      case 'normal':
        setShieldActive(false);
        setDatabaseExposed(false);
        simulateTyping('user search');
        setTimeout(() => setArrowStatus('moving-normal'), 1500);
        break;
      case 'trick':
        setShieldActive(false);
        setDatabaseExposed(false);
        simulateTyping('<script>alert("XSS")</script>');
        setTimeout(() => setArrowStatus('moving-danger'), 2000);
        break;
      case 'leaked':
        setShieldActive(false);
        setInputValue('<script>alert("XSS")</script>');
        setDatabaseExposed(true);
        setTimeout(() => setShowDatabase(true), 500);
        break;
      case 'explanation':
        setShieldActive(false);
        setInputValue('<script>alert("XSS")</script>');
        setDatabaseExposed(true);
        setShowDatabase(true);
        break;
      case 'protection':
        setShieldActive(true);
        setDatabaseExposed(false);
        setShowDatabase(false);
        setInputValue('<script>alert("XSS")</script>');
        setTimeout(() => setArrowStatus('moving-danger'), 500);
        setTimeout(() => setArrowStatus('blocked'), 1500);
        break;
      case 'safety':
        setShieldActive(true);
        setDatabaseExposed(false);
        setArrowStatus('idle');
        setInputValue('');
        break;
    }
  };

  const simulateTyping = (text: string) => {
    setInputValue('');
    let charIndex = 0;
    const typeSpeed = 50;

    const typeNext = () => {
      if (charIndex < text.length) {
        setInputValue(text.slice(0, charIndex + 1));
        charIndex++;
        typeTimeoutRef.current = window.setTimeout(typeNext, typeSpeed);
      }
    };
    typeNext();
  };

  const currentStageData = STAGES.find(s => s.id === currentStage) || STAGES[0];

  return (
    <div className="min-h-screen bg-indigo-50 font-sans text-slate-800 flex flex-col overflow-hidden">
      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200">
        <div 
          className="h-full bg-indigo-500 transition-all duration-100 ease-linear" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Security Status Banner */}
          <div className={`mb-6 p-4 rounded-xl border-2 transition-all duration-500 ${
            shieldActive ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center justify-center gap-3">
              {shieldActive ? (
                <>
                  <Shield className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-green-800">🛡️ SECURITY ENABLED - Input Validation Active</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <span className="font-bold text-red-800">⚠️ NO SECURITY - Vulnerable to XSS Attacks</span>
                </>
              )}
            </div>
          </div>

          {/* Main Demo Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: User Input */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border-4 border-blue-200 p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" /> User Search Interface
                </h3>
                <div className="space-y-4">
                  <div className={`relative border-2 rounded-lg p-3 transition-all duration-300 ${
                    currentStage === 'trick' || currentStage === 'leaked' || currentStage === 'explanation' || currentStage === 'protection' 
                      ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                  }`}>
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      currentStage === 'trick' || currentStage === 'leaked' || currentStage === 'explanation' || currentStage === 'protection'
                        ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      value={inputValue}
                      readOnly
                      className={`w-full pl-10 pr-4 py-2 bg-transparent font-mono text-sm outline-none ${
                        currentStage === 'trick' || currentStage === 'leaked' || currentStage === 'explanation' || currentStage === 'protection'
                          ? 'text-red-700 font-bold' : 'text-gray-700'
                      }`}
                      placeholder="Search users..."
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-pulse text-gray-400">|</span>
                  </div>
                  {(currentStage === 'trick' || currentStage === 'leaked' || currentStage === 'explanation' || currentStage === 'protection') && (
                    <div className="text-red-600 text-sm font-bold text-center animate-pulse">
                      ⚠️ Malicious Script Detected!
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className={`transition-all duration-1000 ${
                  arrowStatus === 'idle' ? 'opacity-0' : 'opacity-100'
                } ${
                  arrowStatus === 'moving-normal' ? 'text-blue-500' : ''
                } ${
                  arrowStatus === 'moving-danger' ? 'text-red-500 animate-pulse' : ''
                } ${
                  arrowStatus === 'blocked' ? 'text-red-500 animate-bounce' : ''
                }`}>
                  <ArrowRight size={48} strokeWidth={3} className="rotate-90 lg:rotate-0" />
                </div>
              </div>
            </div>

            {/* Right: Database */}
            <div className="space-y-6">
              <div className={`bg-white rounded-2xl shadow-xl border-4 p-6 transition-all duration-500 relative ${
                databaseExposed ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}>
                {shieldActive && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full animate-pulse">
                    <Shield className="w-6 h-6" />
                  </div>
                )}
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Database className={`w-5 h-5 ${
                    databaseExposed ? 'text-red-600' : 'text-gray-600'
                  }`} />
                  User Database
                </h3>
                
                <div className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                  databaseExposed ? 'border-red-300 bg-red-100' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-center mb-4">
                    {databaseExposed ? (
                      <Unlock className="w-12 h-12 text-red-500 animate-bounce" />
                    ) : (
                      <Lock className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {showDatabase && databaseExposed && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2 text-sm"
                      >
                        <div className="bg-white p-3 rounded border border-red-200">
                          <div className="font-bold text-red-700">🚨 EXPOSED USER DATA:</div>
                          <div className="mt-2 space-y-1 text-xs font-mono">
                            <div>User: admin | Password: admin123</div>
                            <div>User: john | Email: john@bank.com</div>
                            <div>User: sarah | Balance: $50,000</div>
                            <div>User: mike | SSN: 123-45-6789</div>
                            <div>User: lisa | Card: 4532-****-****-1234</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {!databaseExposed && (
                    <div className="text-center text-gray-500 text-sm">
                      Database Protected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-8">
          <div className={`max-w-4xl mx-auto p-6 rounded-2xl border-l-8 transition-all duration-500 ${
            currentStage === 'normal' ? 'bg-blue-50 border-blue-500' : ''
          } ${
            currentStage === 'trick' || currentStage === 'leaked' ? 'bg-red-50 border-red-500' : ''
          } ${
            currentStage === 'protection' ? 'bg-green-50 border-green-500' : ''
          } ${
            currentStage === 'explanation' || currentStage === 'safety' ? 'bg-yellow-50 border-yellow-500' : ''
          }`}>
            <h2 className={`text-xl md:text-2xl font-bold mb-2 ${
              currentStage === 'trick' || currentStage === 'leaked' ? 'text-red-700' : ''
            } ${
              currentStage === 'protection' ? 'text-green-700' : ''
            } ${
              currentStage === 'normal' ? 'text-blue-700' : ''
            } ${
              currentStage === 'explanation' || currentStage === 'safety' ? 'text-yellow-700' : ''
            }`}>
              {currentStageData.title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentStageData.description}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 p-4 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm font-bold text-slate-600">
          <AlertTriangle size={16} />
          <span>Educational Demo Only • Never attempt on real systems</span>
        </div>
      </footer>
    </div>
  );
}