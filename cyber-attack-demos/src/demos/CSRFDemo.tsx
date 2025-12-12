import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Gift, Cookie, ArrowRight, Lock, User, AlertTriangle, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { DemoControls } from '../App';

type Stage = 'SAFE_BANK' | 'FAKE_AD' | 'ATTACK_START' | 'ATTACK_FLOW' | 'EXPLANATION' | 'PROTECTION';

const STAGE_DURATION = {
  SAFE_BANK: 3000,
  FAKE_AD: 4000,
  ATTACK_START: 1500,
  ATTACK_FLOW: 5000,
  EXPLANATION: 8000,
  PROTECTION: 0 // Manual interaction
};

interface CSRFDemoProps {
  controls: DemoControls;
}

export function CSRFDemo({ controls }: CSRFDemoProps) {
  const [stage, setStage] = useState<Stage>('SAFE_BANK');
  const [victimBalance, setVictimBalance] = useState(1000);
  const [attackerBalance, setAttackerBalance] = useState(0);
  const [protectionOn, setProtectionOn] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    if (!controls.isPlaying) return;

    let timer: number;
    const advance = () => {
      switch (stage) {
        case 'SAFE_BANK':
          setStage('FAKE_AD');
          break;
        case 'FAKE_AD':
          setStage('ATTACK_START');
          break;
        case 'ATTACK_START':
          setStage('ATTACK_FLOW');
          break;
        case 'ATTACK_FLOW':
          setStage(protectionOn ? 'PROTECTION' : 'EXPLANATION');
          break;
        case 'EXPLANATION':
          setStage('PROTECTION');
          break;
        default:
          break;
      }
    };

    if (stage !== 'PROTECTION') {
      timer = setTimeout(advance, STAGE_DURATION[stage]);
    }

    return () => clearTimeout(timer);
  }, [stage, protectionOn, controls.isPlaying]);

  useEffect(() => {
    if (stage === 'ATTACK_FLOW') {
      if (protectionOn) {
        setTimeout(() => setShowExplosion(true), 1500);
        setTimeout(() => setShowExplosion(false), 2500);
      } else {
        const interval = setInterval(() => {
          setVictimBalance(prev => Math.max(0, prev - 10));
          setAttackerBalance(prev => prev + 10);
        }, 50);
        setTimeout(() => clearInterval(interval), 1000);
      }
    } else if (stage === 'SAFE_BANK') {
      setVictimBalance(1000);
      setAttackerBalance(0);
      setShowExplosion(false);
    }
  }, [stage, protectionOn]);

  useEffect(() => {
    if (!controls.isPlaying) {
      setStage('SAFE_BANK');
      setProtectionOn(false);
      setVictimBalance(1000);
      setAttackerBalance(0);
      setShowExplosion(false);
    }
  }, [controls.isPlaying]);

  const handleReset = () => {
    setStage('SAFE_BANK');
    setProtectionOn(false);
    setVictimBalance(1000);
    setAttackerBalance(0);
  };

  const handleReplayWithProtection = () => {
    setProtectionOn(true);
    setVictimBalance(1000);
    setAttackerBalance(0);
    setStage('FAKE_AD');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              <span className="text-red-600">CSRF Attack</span> Demo
            </h1>
            <p className="text-slate-600 mt-1">Cross-Site Request Forgery - When fake buttons steal your money</p>
          </div>
          
          {/* Security Status */}
          <div className={`p-3 rounded-lg border-2 transition-all duration-500 ${
            protectionOn ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center justify-center gap-3">
              {protectionOn ? (
                <>
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">🛡️ CSRF PROTECTION ENABLED</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-800">⚠️ NO CSRF PROTECTION - Vulnerable to Attacks</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Victim Bank */}
            <div className="order-1">
              <BankZone balance={victimBalance} />
            </div>

            {/* Attack Flow */}
            <div className="order-3 lg:order-2 flex flex-col gap-6">
              <AdZone stage={stage} />
              
              {/* Network Layer */}
              <div className="bg-slate-100 rounded-2xl border-2 border-slate-200 border-dashed p-4 min-h-[200px] flex flex-col items-center justify-center relative">
                <p className="absolute top-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Network Request
                </p>

                <AnimatePresence>
                  {stage === 'ATTACK_FLOW' && (
                    <AttackArrow blocked={protectionOn} onExplode={showExplosion} />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {stage === 'EXPLANATION' && <ExplanationIcons />}
                </AnimatePresence>

                <AnimatePresence>
                  {stage === 'PROTECTION' && (
                    <ProtectionControls
                      protectionOn={protectionOn}
                      onToggle={() => setProtectionOn(!protectionOn)}
                      onReplay={handleReplayWithProtection}
                      onReset={handleReset}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Attacker */}
            <div className="order-2 lg:order-3">
              <AttackerZone balance={attackerBalance} />
            </div>
          </div>
        </div>
      </main>

      {/* Contextual Overlay / Narrator */}
      <NarratorBar stage={stage} protectionOn={protectionOn} />
    </div>
  );
}

function BankZone({ balance }: { balance: number }) {
  return (
    <div className="bg-white rounded-2xl border-4 border-blue-200 shadow-xl overflow-hidden">
      {/* Browser Bar */}
      <div className="bg-blue-50 p-3 flex items-center justify-between border-b-2 border-blue-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="bg-white px-3 py-1 rounded-full text-xs font-mono text-slate-600 flex items-center gap-1">
          <Lock className="w-3 h-3" /> bank.com/account
        </div>
      </div>
      
      {/* Bank Content */}
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 relative">
            <User className="w-8 h-8 text-blue-600" />
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your Bank Account</h3>
          <p className="text-slate-500 text-sm">Logged in securely</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-center mb-4">
          <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Balance
          </p>
          <motion.div
            key={balance}
            initial={balance < 1000 ? { scale: 1.1, color: '#ef4444' } : {}}
            animate={{ scale: 1, color: '#1e293b' }}
            className="text-3xl font-black text-slate-800"
          >
            ${balance}
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-blue-200" />
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-blue-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdZone({ stage }: { stage: Stage }) {
  const showAd = stage !== 'SAFE_BANK';

  return (
    <div className="min-h-[250px] relative">
      <AnimatePresence mode="wait">
        {!showAd ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex items-center justify-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl p-8"
          >
            Browsing safely...
          </motion.div>
        ) : (
          <motion.div
            key="ad"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white text-center border-4 border-yellow-400 relative overflow-hidden"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Gift className="w-12 h-12 text-yellow-300 mb-3 mx-auto" />
            </motion.div>

            <h3 className="text-xl font-black text-yellow-300 mb-2">
              CONGRATULATIONS!
            </h3>
            <p className="text-purple-100 mb-4 text-sm">
              You won a mystery prize!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              animate={stage === 'ATTACK_START' ? { scale: [1, 0.95, 1] } : {}}
              className="bg-yellow-400 text-purple-900 px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto"
            >
              CLAIM NOW <ArrowRight className="w-4 h-4" />
            </motion.button>

            <div className="absolute bottom-1 right-2 opacity-30 text-[8px] font-mono">
              &lt;form action="bank.com/transfer"&gt;
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AttackerZone({ balance }: { balance: number }) {
  return (
    <div className="bg-slate-900 rounded-2xl border-4 border-slate-700 shadow-xl overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-slate-800 p-3 flex items-center justify-between border-b-2 border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs font-mono text-slate-400">
          attacker-terminal
        </div>
      </div>
      
      {/* Attacker Content */}
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-600">
          <div className="text-2xl">🦹</div>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">Attacker</h3>
        <p className="text-slate-400 text-sm mb-6">Waiting for victims...</p>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600">
          <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-2">
            Stolen Money
          </p>
          <motion.div
            key={balance}
            initial={balance > 0 ? { scale: 1.2, color: '#4ade80' } : {}}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-3xl font-black text-white"
          >
            ${balance}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AttackArrow({ blocked, onExplode }: { blocked: boolean; onExplode: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <motion.div
        initial={{ x: -100, opacity: 0, scale: 0.5 }}
        animate={{
          x: blocked ? 0 : 100,
          opacity: [0, 1, 1, 0],
          scale: 1
        }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="z-20 flex flex-col items-center"
      >
        <div className={`
          px-4 py-2 rounded-lg shadow-xl text-white font-bold text-sm flex items-center gap-2
          ${blocked ? 'bg-red-500' : 'bg-red-600'}
        `}>
          <Cookie className="w-4 h-4" />
          POST /transfer
        </div>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 5, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full border border-amber-300 shadow-sm mt-1"
        >
          session_id=123
        </motion.div>
      </motion.div>

      {blocked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute z-10"
        >
          <ShieldCheck className={`w-24 h-24 ${onExplode ? 'text-red-500' : 'text-green-500'} transition-colors duration-300`} />
          {onExplode && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              className="absolute inset-0 bg-red-400 rounded-full"
            />
          )}
        </motion.div>
      )}
    </div>
  );
}

function ExplanationIcons() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.5 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center"
    >
      <h3 className="text-xl font-bold text-slate-800 mb-6">
        Why did that happen?
      </h3>

      <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
        <motion.div variants={item} className="flex items-center gap-4 bg-blue-50 p-3 rounded-xl text-left">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Cookie className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">Automatic Cookies</p>
            <p className="text-xs text-slate-600">Browser sent your "ID card" automatically.</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-4 bg-red-50 p-3 rounded-xl text-left">
          <div className="bg-red-100 p-2 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">No Verification</p>
            <p className="text-xs text-slate-600">Bank didn't check if YOU clicked the button.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProtectionControls({ protectionOn, onToggle, onReplay, onReset }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-white z-30 flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Let's fix it!</h3>
        <p className="text-slate-500 text-sm">Turn on the CSRF Token protection.</p>
      </div>

      <button
        onClick={onToggle}
        className={`
          relative w-20 h-10 rounded-full transition-colors duration-300 mb-8
          ${protectionOn ? 'bg-green-500' : 'bg-slate-200'}
        `}
      >
        <motion.div
          animate={{ x: protectionOn ? 40 : 4 }}
          className="absolute top-1 left-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          {protectionOn ? (
            <ShieldCheck className="w-5 h-5 text-green-500" />
          ) : (
            <Shield className="w-5 h-5 text-slate-400" />
          )}
        </motion.div>
      </button>

      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg text-slate-500 font-medium hover:bg-slate-100 transition-colors flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" /> Reset
        </button>
        <button
          onClick={onReplay}
          disabled={!protectionOn}
          className={`
            px-6 py-2 rounded-lg font-bold text-white shadow-lg transition-all flex items-center gap-2
            ${protectionOn ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95' : 'bg-slate-300 cursor-not-allowed'}
          `}
        >
          Test Protection <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function NarratorBar({ stage, protectionOn }: { stage: Stage; protectionOn: boolean }) {
  const messages = {
    SAFE_BANK: {
      title: 'You are safely logged in',
      text: 'Look at your bank balance on the left. Everything is safe and secure.',
      color: 'bg-blue-600'
    },
    FAKE_AD: {
      title: 'Oh no! A trap appeared!',
      text: 'Attackers use fake ads, emails, or links to trick you into clicking.',
      color: 'bg-purple-600'
    },
    ATTACK_START: {
      title: 'You clicked the button...',
      text: "But the button does something you didn't expect!",
      color: 'bg-red-600'
    },
    ATTACK_FLOW: {
      title: protectionOn ? 'Protection Active!' : 'The Attack is Happening!',
      text: protectionOn 
        ? "The bank checked for the secret token. It wasn't there, so the request was blocked!" 
        : 'Your browser automatically sent your bank cookies. The bank thinks YOU made this request!',
      color: protectionOn ? 'bg-green-600' : 'bg-red-600'
    },
    EXPLANATION: {
      title: 'Why did that work?',
      text: 'This is called Cross-Site Request Forgery (CSRF). The attacker forged a request using your credentials.',
      color: 'bg-slate-800'
    },
    PROTECTION: {
      title: 'How do we stop it?',
      text: "We need a CSRF Token - a secret code that the attacker can't guess.",
      color: 'bg-blue-600'
    }
  };

  const current = messages[stage];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`${current.color} text-white p-6 shadow-lg z-50 transition-colors duration-500`}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center justify-center md:justify-start gap-2">
            {stage === 'ATTACK_FLOW' && !protectionOn && (
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            )}
            {current.title}
          </h3>
          <p className="text-blue-50 text-lg leading-relaxed max-w-2xl">
            {current.text}
          </p>
        </div>

        <div className="flex gap-2">
          {['SAFE_BANK', 'FAKE_AD', 'ATTACK_START', 'ATTACK_FLOW', 'EXPLANATION', 'PROTECTION'].map((s, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                s === stage ? 'bg-white scale-125' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}