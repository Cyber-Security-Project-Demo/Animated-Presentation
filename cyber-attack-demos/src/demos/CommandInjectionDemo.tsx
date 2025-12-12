import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw, ShieldCheck, ShieldAlert, Search, Brain, Database, Terminal, Lock } from 'lucide-react';
import { DemoControls } from '../App';

type AnimationStage = 'IDLE' | 'TYPING_NORMAL' | 'SEARCHING_NORMAL' | 'CLEARING' | 'TYPING_ATTACK' | 'ATTACK_THINKING' | 'ATTACK_RESULT' | 'RESET';

interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
}

const TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2025-01-01', desc: 'Lunch', amount: 10 },
  { id: 2, date: '2025-01-02', desc: 'Bus Ticket', amount: 3 },
  { id: 3, date: '2025-01-03', desc: 'Books', amount: 25 },
  { id: 4, date: '2025-01-04', desc: 'Ice Cream', amount: 5 }
];

interface CommandInjectionDemoProps {
  controls: DemoControls;
}

export function CommandInjectionDemo({ controls }: CommandInjectionDemoProps) {
  const [stage, setStage] = useState<AnimationStage>('IDLE');
  const [searchText, setSearchText] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [safetyOn, setSafetyOn] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!controls.isPlaying) return;

    const runSequence = async () => {
      switch (stage) {
        case 'IDLE':
          setConsoleOutput([]);
          setSearchText('');
          timerRef.current = setTimeout(() => setStage('TYPING_NORMAL'), 1000);
          break;
        case 'TYPING_NORMAL':
          let text = 'food';
          let i = 0;
          const typeInterval = setInterval(() => {
            setSearchText(text.substring(0, i + 1));
            i++;
            if (i === text.length) {
              clearInterval(typeInterval);
              timerRef.current = setTimeout(() => setStage('SEARCHING_NORMAL'), 1000);
            }
          }, 150);
          break;
        case 'SEARCHING_NORMAL':
          timerRef.current = setTimeout(() => setStage('CLEARING'), 3000);
          break;
        case 'CLEARING':
          setSearchText('');
          timerRef.current = setTimeout(() => setStage('TYPING_ATTACK'), 1000);
          break;
        case 'TYPING_ATTACK':
          let attackText = 'DROP TABLE users; --';
          let j = 0;
          const attackTypeInterval = setInterval(() => {
            setSearchText(attackText.substring(0, j + 1));
            j++;
            if (j === attackText.length) {
              clearInterval(attackTypeInterval);
              timerRef.current = setTimeout(() => setStage('ATTACK_THINKING'), 800);
            }
          }, 100);
          break;
        case 'ATTACK_THINKING':
          timerRef.current = setTimeout(() => setStage('ATTACK_RESULT'), 1500);
          break;
        case 'ATTACK_RESULT':
          if (safetyOn) {
            setConsoleOutput([
              '[SAFE] Input validation active...',
              "[SAFE] Dangerous command blocked: 'DROP TABLE'",
              '[SAFE] Input treated as search text only.'
            ]);
          } else {
            setConsoleOutput([
              "[DANGER] Executing: 'DROP TABLE users; --'",
              '[CRITICAL] Deleting database table...',
              '[ERROR] All user data permanently lost!',
              '[SYSTEM] Database connection terminated.',
              '[ALERT] Security breach detected!'
            ]);
          }
          timerRef.current = setTimeout(() => setStage('RESET'), 6000);
          break;
        case 'RESET':
          setSearchText('');
          setConsoleOutput([]);
          timerRef.current = setTimeout(() => setStage('IDLE'), 1000);
          break;
      }
    };

    runSequence();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, controls.isPlaying, safetyOn]);

  useEffect(() => {
    if (!controls.isPlaying) {
      setStage('IDLE');
      setSearchText('');
      setConsoleOutput([]);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [controls.isPlaying]);

  const isTrick = stage === 'TYPING_ATTACK' || stage === 'ATTACK_THINKING' || stage === 'ATTACK_RESULT';
  const isNormalSearch = stage === 'SEARCHING_NORMAL';

  const getSystemStage = () => {
    if (stage === 'ATTACK_THINKING') return 'thinking';
    if (stage === 'ATTACK_RESULT') return safetyOn ? 'blocked' : 'hacked';
    if (stage === 'SEARCHING_NORMAL') return 'thinking';
    return 'idle';
  };

  const getFlowStage = () => {
    if (stage === 'SEARCHING_NORMAL') return 'normal_flow';
    if (stage === 'ATTACK_THINKING' || stage === 'ATTACK_RESULT') {
      return safetyOn ? 'blocked_flow' : 'attack_flow';
    }
    return 'idle';
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            How <span className="text-red-500">Command Injection</span> Works
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            A visual guide for humans (and future hackers) 🕵️♂️
          </p>
        </div>

        {/* Safety Toggle */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border-2 border-slate-100">
          <button
            onClick={() => setSafetyOn(!safetyOn)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300
              ${safetyOn ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
            `}
          >
            {safetyOn ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            {safetyOn ? 'Safety ON' : 'Safety OFF'}
          </button>
        </div>
      </header>

      {/* Main Stage */}
      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left: Transaction App */}
        <div className="lg:col-span-4 min-h-[400px]">
          <TransactionPanel 
            searchText={searchText} 
            isTrick={isTrick} 
            highlightMatches={stage === 'SEARCHING_NORMAL'} 
          />
        </div>

        {/* Center: Flow Arrows */}
        <div className="lg:col-span-2 min-h-[100px] lg:min-h-auto">
          <FlowVisualizer stage={getFlowStage()} />
        </div>

        {/* Right: System Internals */}
        <div className="lg:col-span-6 min-h-[400px]">
          <SystemPanel 
            stage={getSystemStage()} 
            safetyOn={safetyOn} 
            consoleOutput={consoleOutput} 
          />
        </div>
      </main>

      {/* Explanation Banner */}
      <div className="max-w-3xl mx-auto w-full mt-8">
        <div className={`
          p-6 rounded-2xl border-l-8 shadow-lg transition-all duration-500
          ${stage === 'SEARCHING_NORMAL' ? 'bg-blue-100 border-blue-500' : ''}
          ${stage === 'ATTACK_RESULT' && !safetyOn ? 'bg-red-100 border-red-500' : ''}
          ${stage === 'ATTACK_RESULT' && safetyOn ? 'bg-green-100 border-green-500' : ''}
          ${stage === 'IDLE' || stage === 'TYPING_NORMAL' || stage === 'CLEARING' || stage === 'TYPING_ATTACK' || stage === 'ATTACK_THINKING' ? 'bg-white border-slate-300' : ''}
        `}>
          <h3 className="font-bold text-lg mb-1">
            {stage === 'SEARCHING_NORMAL' && '🔍 Normal Search'}
            {stage === 'ATTACK_RESULT' && !safetyOn && '🚨 Command Injection!'}
            {stage === 'ATTACK_RESULT' && safetyOn && '🛡️ Attack Blocked'}
            {(stage === 'IDLE' || stage === 'TYPING_NORMAL' || stage === 'CLEARING') && '👀 Watch the demo...'}
            {(stage === 'TYPING_ATTACK' || stage === 'ATTACK_THINKING') && '⚡ Attempting Trick...'}
          </h3>
          <p className="text-slate-700">
            {stage === 'SEARCHING_NORMAL' && "The app just looks for the word 'food' in the list. It's safe."}
            {stage === 'ATTACK_RESULT' && !safetyOn && "The app got confused! It ran 'show database' as a command instead of just searching for text."}
            {stage === 'ATTACK_RESULT' && safetyOn && "The safety shield stopped the command. It treated 'show database' as just text, not an instruction."}
            {(stage === 'IDLE' || stage === 'TYPING_NORMAL' || stage === 'CLEARING') && 'Wait for the search...'}
            {(stage === 'TYPING_ATTACK' || stage === 'ATTACK_THINKING') && 'Someone is typing a command instead of a search word!'}
          </p>
        </div>
      </div>
    </div>
  );
}

function TransactionPanel({ searchText, isTrick, highlightMatches }: {
  searchText: string;
  isTrick: boolean;
  highlightMatches: boolean;
}) {
  return (
    <div className="bg-white rounded-3xl border-4 border-slate-200 shadow-xl p-6 h-full flex flex-col gap-6">
      <div className="absolute -top-3 left-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        My Money App
      </div>

      {/* Search Box */}
      <div className="flex flex-col gap-2 mt-2">
        <label className="text-slate-500 font-bold ml-2">
          Search Transactions
        </label>
        <div className={`
          relative flex items-center transition-all duration-300
          ${isTrick ? 'scale-105' : ''}
        `}>
          <Search className={`absolute left-4 w-6 h-6 ${isTrick ? 'text-red-500' : 'text-slate-400'}`} />
          <input
            type="text"
            readOnly
            value={searchText}
            className={`
              w-full pl-12 pr-4 py-4 rounded-2xl border-4 font-mono text-lg font-bold outline-none transition-colors
              ${isTrick ? 'border-red-400 bg-red-50 text-red-600 shadow-[0_0_20px_rgba(248,113,113,0.3)]' : 'border-slate-200 bg-slate-50 text-slate-700'}
            `}
            placeholder="Type to search..."
          />
        </div>
        {isTrick && (
          <div className="text-red-500 text-sm font-bold text-center animate-pulse">
            ⚠️ Trick Command Detected!
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        <div className="text-slate-400 font-bold text-sm uppercase tracking-wider ml-2">
          Recent Activity
        </div>
        {TRANSACTIONS.map(tx => {
          const isMatch = highlightMatches && searchText.length > 0 && !isTrick && 
            tx.desc.toLowerCase().includes(searchText.toLowerCase());
          
          return (
            <div
              key={tx.id}
              className={`
                flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-500
                ${isMatch ? 'bg-yellow-100 border-yellow-400 scale-105 shadow-md' : 'bg-white border-slate-100 text-slate-400'}
              `}
            >
              <div className="flex flex-col">
                <span className={`font-bold ${isMatch ? 'text-slate-800' : 'text-slate-400'}`}>
                  {tx.desc}
                </span>
                <span className="text-xs opacity-70">{tx.date}</span>
              </div>
              <span className={`font-bold text-lg ${isMatch ? 'text-slate-800' : 'text-slate-400'}`}>
                ${tx.amount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FlowVisualizer({ stage }: { stage: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      <div className="flex flex-col items-center gap-4">
        {/* Arrow indicators based on stage */}
        <AnimatePresence>
          {stage !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`
                text-6xl transition-colors duration-500
                ${stage === 'normal_flow' ? 'text-blue-500' : ''}
                ${stage === 'attack_flow' ? 'text-red-500 animate-pulse' : ''}
                ${stage === 'blocked_flow' ? 'text-green-500' : ''}
              `}
            >
              →
            </motion.div>
          )}
        </AnimatePresence>
        
        {stage === 'blocked_flow' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute text-4xl"
          >
            🛡️
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SystemPanel({ stage, safetyOn, consoleOutput }: {
  stage: 'idle' | 'thinking' | 'hacked' | 'blocked';
  safetyOn: boolean;
  consoleOutput: string[];
}) {
  const isThinking = stage === 'thinking' || stage === 'hacked' || stage === 'blocked';
  const isHacked = stage === 'hacked';
  const isBlocked = stage === 'blocked';

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* App Brain Section */}
      <div className={`
        bg-white rounded-3xl border-4 shadow-xl p-6
        flex-1 flex flex-col items-center justify-center gap-4 transition-all duration-300
        ${isThinking ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}
        ${isHacked ? 'border-red-400 bg-red-50 animate-shake' : ''}
      `}>
        <div className="absolute -top-3 left-4 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          App Brain
        </div>
        
        <div className={`
          relative p-6 rounded-full bg-white border-4 transition-all duration-500 mt-2
          ${isHacked ? 'border-red-400' : 'border-blue-200'}
        `}>
          <Brain className={`
            w-16 h-16 transition-colors duration-300
            ${isHacked ? 'text-red-500' : 'text-blue-500'}
            ${isThinking ? 'animate-pulse' : ''}
          `} />
          {isThinking && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" />
          )}
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-700 text-xl">The Logic</h3>
          <p className="text-slate-500 text-sm">
            {isHacked ? "I'm confused! This isn't a search!" : 'Processing request...'}
          </p>
        </div>
      </div>

      {/* Database & Console Section */}
      <div className={`
        bg-white rounded-3xl border-4 shadow-xl p-6
        flex-[2] flex flex-col gap-4 transition-all duration-500
        ${isHacked ? 'border-red-400 shadow-[0_0_30px_rgba(248,113,113,0.2)]' : 'border-slate-200'}
        ${isBlocked ? 'border-green-400' : ''}
      `}>
        <div className="absolute -top-3 left-4 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Secret Database
        </div>

        {/* Database Icon State */}
        <div className="flex items-center justify-center gap-4 py-2 mt-2">
          <div className={`
            p-4 rounded-2xl border-4 transition-all duration-500 flex flex-col items-center gap-3
            ${isHacked ? 'bg-red-100 border-red-400' : 'bg-slate-100 border-slate-200'}
            ${isBlocked ? 'bg-green-100 border-green-400' : ''}
          `}>
            {isBlocked ? (
              <>
                <ShieldCheck className="w-12 h-12 text-green-600" />
                <span className="font-bold text-green-700">PROTECTED</span>
              </>
            ) : isHacked ? (
              <>
                <div className="text-4xl animate-bounce mb-2">💥</div>
                <span className="font-bold text-red-700">DATABASE DELETED!</span>
                <div className="w-full bg-red-200 rounded-full h-3 mt-2">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="bg-red-600 h-3 rounded-full"
                  />
                </div>
                <span className="text-xs text-red-600 mt-1">Deletion Complete</span>
              </>
            ) : (
              <>
                <Lock className="w-12 h-12 text-slate-400" />
                <span className="font-bold text-slate-500">Database Secure</span>
              </>
            )}
          </div>
        </div>

        {/* Console Output */}
        <div className="flex-1 bg-slate-900 rounded-xl p-4 font-mono text-sm overflow-hidden border-4 border-slate-800 relative">
          <div className="absolute top-0 left-0 right-0 h-6 bg-slate-800 flex items-center px-2 gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs text-slate-400">System Console</span>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            {consoleOutput.length === 0 && (
              <span className="text-slate-600 italic opacity-50">
                Waiting for system logs...
              </span>
            )}
            {consoleOutput.map((line, i) => (
              <div key={i} className="animate-fade-in">
                {line.startsWith('[SAFE]') ? (
                  <span className="text-green-400">{line}</span>
                ) : line.startsWith('[Warning]') ? (
                  <span className="text-yellow-400">{line}</span>
                ) : line.startsWith('[DANGER]') ? (
                  <span className="text-red-400 font-bold">{line}</span>
                ) : (
                  <span className="text-slate-300">{line}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}