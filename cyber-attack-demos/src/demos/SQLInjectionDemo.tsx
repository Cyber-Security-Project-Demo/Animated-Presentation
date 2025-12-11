import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Unlock, Database, AlertTriangle, User, Key, ArrowRight } from 'lucide-react';
import { DemoControls } from '../App';

type Stage = 'normal' | 'injection' | 'explanation' | 'protection' | 'safety';

const STAGES: { id: Stage; title: string; description: string; duration: number }[] = [
  { id: 'normal', title: 'Normal Login', description: 'User enters correct credentials - database stays secure', duration: 4000 },
  { id: 'injection', title: 'SQL Injection Attack', description: 'Malicious SQL code bypasses authentication!', duration: 4000 },
  { id: 'explanation', title: 'How It Works', description: 'The injected code tricks the database into granting access', duration: 4000 },
  { id: 'protection', title: 'Security Enabled', description: 'Input validation blocks the malicious SQL code!', duration: 4000 },
  { id: 'safety', title: 'Stay Protected', description: 'Always validate and sanitize user inputs', duration: 4000 }
];

interface SQLInjectionDemoProps {
  controls: DemoControls;
}

export function SQLInjectionDemo({ controls }: SQLInjectionDemoProps) {
  const [currentStage, setCurrentStage] = useState<Stage>('normal');
  const [progress, setProgress] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [doorOpen, setDoorOpen] = useState(false);
  const [doorShake, setDoorShake] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [arrowStatus, setArrowStatus] = useState<'idle' | 'moving' | 'blocked' | 'success'>('idle');

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
      setUsername('');
      setPassword('');
      setDoorOpen(false);
      setDoorShake(false);
      setShieldActive(false);
      setArrowStatus('idle');
    }
  }, [controls.isPlaying]);

  const handleStageTransition = (stage: Stage) => {
    setDoorShake(false);
    setArrowStatus('idle');

    switch (stage) {
      case 'normal':
        setDoorOpen(false);
        setShieldActive(false);
        simulateTyping('admin', 'password123');
        setTimeout(() => setArrowStatus('moving'), 1500);
        setTimeout(() => setDoorShake(true), 2500);
        break;
      case 'injection':
        setDoorOpen(false);
        setShieldActive(false);
        simulateTyping('admin', "' OR 1=1 --");
        setTimeout(() => setArrowStatus('success'), 1500);
        setTimeout(() => setDoorOpen(true), 2500);
        break;
      case 'explanation':
        setDoorOpen(true);
        setShieldActive(false);
        setUsername('admin');
        setPassword("' OR 1=1 --");
        break;
      case 'protection':
        setDoorOpen(false);
        setShieldActive(true);
        setUsername('admin');
        setPassword("' OR 1=1 --");
        setArrowStatus('idle');
        setTimeout(() => setArrowStatus('blocked'), 1000);
        break;
      case 'safety':
        setDoorOpen(false);
        setShieldActive(true);
        setArrowStatus('idle');
        setUsername('');
        setPassword('');
        break;
    }
  };

  const simulateTyping = (targetUser: string, targetPass: string) => {
    setUsername('');
    setPassword('');
    let charIndex = 0;
    const typeSpeed = 50;

    const typeNext = () => {
      if (charIndex < targetUser.length) {
        setUsername(targetUser.slice(0, charIndex + 1));
        charIndex++;
        typeTimeoutRef.current = window.setTimeout(typeNext, typeSpeed);
      } else if (charIndex < targetUser.length + targetPass.length) {
        const passIndex = charIndex - targetUser.length;
        setPassword(targetPass.slice(0, passIndex + 1));
        charIndex++;
        typeTimeoutRef.current = window.setTimeout(typeNext, typeSpeed);
      }
    };
    typeNext();
  };

  const currentStageData = STAGES.find(s => s.id === currentStage) || STAGES[0];

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              <span className="text-purple-600">SQL Injection</span> Attack Demo
            </h1>
            <p className="text-slate-600 mt-1">How malicious code tricks databases</p>
          </div>
          
          {/* Security Status */}
          <div className={`p-3 rounded-lg border-2 transition-all duration-500 ${
            shieldActive ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center justify-center gap-3">
              {shieldActive ? (
                <>
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">🛡️ SQL INJECTION PROTECTION ENABLED</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-800">⚠️ NO PROTECTION - Vulnerable to SQL Injection</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-100 ease-linear" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
            {/* Login Form */}
            <div className="order-1">
              <div className={`bg-white rounded-2xl border-4 shadow-xl p-6 transition-all duration-500 ${
                currentStage === 'injection' || currentStage === 'explanation' ? 'border-red-300 bg-red-50' : 'border-blue-300'
              }`}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" /> Login Form
                </h3>
                
                <div className="space-y-4">
                  <div className={`border-2 rounded-lg p-3 transition-all duration-300 ${
                    currentStage === 'injection' || currentStage === 'explanation' ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                  }`}>
                    <User className={`w-4 h-4 inline mr-2 ${
                      currentStage === 'injection' || currentStage === 'explanation' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      value={username}
                      readOnly
                      className={`bg-transparent font-mono text-sm outline-none w-full ${
                        currentStage === 'injection' || currentStage === 'explanation' ? 'text-red-700 font-bold' : 'text-gray-700'
                      }`}
                      placeholder="Username"
                    />
                    <span className="animate-pulse text-gray-400">|</span>
                  </div>
                  
                  <div className={`border-2 rounded-lg p-3 transition-all duration-300 ${
                    currentStage === 'injection' || currentStage === 'explanation' ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                  }`}>
                    <Key className={`w-4 h-4 inline mr-2 ${
                      currentStage === 'injection' || currentStage === 'explanation' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      value={currentStage === 'normal' && password !== '' ? '•'.repeat(password.length) : password}
                      readOnly
                      className={`bg-transparent font-mono text-sm outline-none w-full ${
                        currentStage === 'injection' || currentStage === 'explanation' ? 'text-red-700 font-bold' : 'text-gray-700'
                      }`}
                      placeholder="Password"
                    />
                    <span className="animate-pulse text-gray-400">|</span>
                  </div>
                  
                  {(currentStage === 'injection' || currentStage === 'explanation') && (
                    <div className="text-red-600 text-sm font-bold text-center animate-pulse">
                      ⚠️ SQL Injection Detected!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="order-2 flex justify-center">
              <div className={`transition-all duration-1000 ${
                arrowStatus === 'idle' ? 'opacity-0' : 'opacity-100'
              } ${
                arrowStatus === 'moving' ? 'scale-110' : ''
              } ${
                arrowStatus === 'success' ? 'scale-125 text-green-500' : ''
              } ${
                arrowStatus === 'blocked' ? 'animate-bounce text-red-500' : ''
              } ${
                currentStage === 'normal' ? 'text-gray-400' : ''
              } ${
                currentStage === 'injection' || currentStage === 'explanation' ? 'text-red-500' : ''
              }`}>
                <ArrowRight size={48} strokeWidth={3} className="rotate-90 lg:rotate-0" />
              </div>
            </div>

            {/* Database */}
            <div className="order-3">
              <div className={`bg-white rounded-2xl border-4 shadow-xl p-6 relative transition-all duration-500 ${
                currentStage === 'injection' || currentStage === 'explanation' ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${
                currentStage === 'explanation' ? 'border-yellow-400 bg-yellow-50' : ''
              }`}>
                {shieldActive && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full animate-pulse">
                    <Shield className="w-6 h-6" />
                  </div>
                )}
                
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Database className={`w-5 h-5 ${
                    currentStage === 'injection' || currentStage === 'explanation' ? 'text-red-600' : 'text-gray-600'
                  } ${
                    currentStage === 'explanation' ? 'text-yellow-600' : ''
                  }`} />
                  Database
                </h3>

                <div className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                  currentStage === 'injection' || currentStage === 'explanation' ? 'border-red-300 bg-red-100' : 'border-gray-200 bg-gray-50'
                } ${
                  currentStage === 'explanation' ? 'border-yellow-300 bg-yellow-100' : ''
                }`}>
                  <div className="flex items-center justify-center mb-4">
                    {doorOpen ? (
                      <div className="text-center">
                        <Unlock className="w-12 h-12 text-red-500 animate-bounce mx-auto mb-2" />
                        <div className="font-bold text-red-700">ACCESS GRANTED!</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="font-bold text-gray-700">SECURE</div>
                      </div>
                    )}
                  </div>
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
            currentStage === 'injection' || currentStage === 'explanation' ? 'bg-red-50 border-red-500' : ''
          } ${
            currentStage === 'protection' ? 'bg-green-50 border-green-500' : ''
          } ${
            currentStage === 'safety' ? 'bg-yellow-50 border-yellow-500' : ''
          }`}>
            <h2 className={`text-xl md:text-2xl font-bold mb-2 ${
              currentStage === 'injection' || currentStage === 'explanation' ? 'text-red-700' : ''
            } ${
              currentStage === 'protection' ? 'text-green-700' : ''
            } ${
              currentStage === 'normal' ? 'text-blue-700' : ''
            } ${
              currentStage === 'safety' ? 'text-yellow-700' : ''
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