import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Shield, User, AlertTriangle, CheckCircle, ArrowRight, Database, FileText } from 'lucide-react';
import { DemoControls } from '../App';

type UserProfile = {
  id: string;
  name: string;
  balance: number;
  color: string;
  avatarColor: string;
  borderColor: string;
};

const USERS: Record<string, UserProfile> = {
  '101': {
    id: '101',
    name: 'Alex',
    balance: 100,
    color: 'bg-blue-100',
    avatarColor: 'bg-blue-500',
    borderColor: 'border-blue-500'
  },
  '102': {
    id: '102',
    name: 'Sam',
    balance: 500,
    color: 'bg-purple-100',
    avatarColor: 'bg-purple-500',
    borderColor: 'border-purple-500'
  },
  '103': {
    id: '103',
    name: 'Hidden',
    balance: 999,
    color: 'bg-gray-100',
    avatarColor: 'bg-gray-500',
    borderColor: 'border-gray-500'
  }
};

interface IDORDemoProps {
  controls: DemoControls;
}

export function IDORDemo({ controls }: IDORDemoProps) {
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState('');
  const [displayedProfile, setDisplayedProfile] = useState<UserProfile | null>(null);
  const [isLockVisible, setIsLockVisible] = useState(true);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [arrowStatus, setArrowStatus] = useState<'idle' | 'moving' | 'blocked' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const addTimeout = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  useEffect(() => {
    if (!controls.isPlaying) return;

    const resetAnimation = () => {
      setStep(0);
      setUrl('');
      setDisplayedProfile(null);
      setIsLockVisible(true);
      setIsShieldActive(false);
      setArrowStatus('idle');
      setMessage('');
      setShowChecklist(false);
      runSequence();
    };

    const runSequence = () => {
      // STAGE 1: Normal Safe Access
      let currentUrl = 'www.bank.com/user?id=';
      setUrl(currentUrl);
      
      addTimeout(() => setUrl(currentUrl + '1'), 500);
      addTimeout(() => setUrl(currentUrl + '10'), 800);
      addTimeout(() => setUrl(currentUrl + '101'), 1100);
      
      addTimeout(() => {
        setArrowStatus('moving');
        setMessage('Alex asks for his page (ID: 101)...');
      }, 1500);
      
      addTimeout(() => {
        setArrowStatus('success');
        setDisplayedProfile(USERS['101']);
        setMessage('Website checks ID 101. It matches Alex. Safe! ✅');
      }, 2500);

      // STAGE 2: Unsafe Access
      addTimeout(() => {
        setStep(1);
        setArrowStatus('idle');
        setIsLockVisible(false);
        setMessage('Oh no! The security lock is gone! 😱');
      }, 6000);

      addTimeout(() => {
        setUrl(currentUrl + '10');
      }, 7000);
      addTimeout(() => {
        setUrl(currentUrl + '102');
        setMessage('Changing the number to 102...');
      }, 7300);

      addTimeout(() => {
        setArrowStatus('moving');
      }, 8000);

      addTimeout(() => {
        setArrowStatus('success');
        setDisplayedProfile(USERS['102']);
        setMessage("Wait! We accessed Sam's data just by changing the ID! 🚨");
      }, 9000);

      // STAGE 3: Explanation
      addTimeout(() => {
        setStep(2);
        setMessage('IDOR means the website trusted the number too much.');
      }, 12000);

      // STAGE 4: Security ON
      addTimeout(() => {
        setStep(3);
        setDisplayedProfile(null);
        setArrowStatus('idle');
        setIsLockVisible(true);
        setIsShieldActive(true);
        setMessage("Let's turn on the Safety Shield! 🛡️");
      }, 15000);

      addTimeout(() => {
        setArrowStatus('moving');
        setMessage("Trying to see Sam's page again...");
      }, 17000);

      addTimeout(() => {
        setArrowStatus('blocked');
        setMessage('Blocked! The shield checks who you are first. 🛑');
      }, 18000);

      addTimeout(() => {
        setDisplayedProfile(USERS['101']);
        setUrl(currentUrl + '101');
        setMessage('You can only see your own page now. Safe again! 😌');
      }, 20000);

      // STAGE 5: Checklist
      addTimeout(() => {
        setStep(4);
        setShowChecklist(true);
      }, 23000);

      // Loop
      addTimeout(() => {
        resetAnimation();
      }, 29000);
    };

    runSequence();

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [controls.isPlaying]);

  useEffect(() => {
    if (!controls.isPlaying) {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      setStep(0);
      setUrl('');
      setDisplayedProfile(null);
      setIsLockVisible(true);
      setIsShieldActive(false);
      setArrowStatus('idle');
      setMessage('');
      setShowChecklist(false);
    }
  }, [controls.isPlaying]);

  const currentUrlId = url.split('id=')[1];

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      {/* Main Cartoon Container */}
      <div className="w-full max-w-5xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden flex flex-col relative">
        {/* Header / Browser Bar */}
        <div className="bg-blue-400 border-b-4 border-black p-4 flex items-center gap-4 z-20 relative">
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-red-400 border-2 border-black"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-black"></div>
            <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-black"></div>
          </div>

          {/* Address Bar */}
          <div className="flex-1 bg-white border-2 border-black rounded-full px-4 py-2 flex items-center gap-2 font-mono text-lg md:text-xl relative overflow-hidden shadow-inner">
            {isLockVisible ? (
              <Lock className={`w-5 h-5 ${isShieldActive ? 'text-green-600' : 'text-gray-400'} transition-colors duration-500`} />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            )}
            <span className="z-10">{url}</span>
            <span className="w-2 h-6 bg-black animate-pulse inline-block ml-1"></span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-6 relative min-h-[500px]">
          {/* LEFT: User Profile Area (Result) */}
          <div className="flex-1 flex flex-col items-center justify-center relative order-3 md:order-1">
            <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 rounded-full text-sm font-bold transform -rotate-2 z-10">
              YOUR SCREEN
            </div>

            {/* Profile Card */}
            <AnimatePresence>
              {displayedProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`
                    w-full max-w-xs bg-white border-4 border-black rounded-2xl p-6 
                    shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-500
                    ${displayedProfile?.id === '102' ? 'bg-red-50 ring-4 ring-red-400 ring-offset-4' : ''}
                  `}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-full border-4 border-black ${displayedProfile.avatarColor} flex items-center justify-center`}>
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">{displayedProfile.name}</h3>
                      <p className="text-gray-500 font-bold">ID: {displayedProfile.id}</p>
                    </div>
                  </div>

                  <div className="bg-green-100 border-2 border-black rounded-xl p-4 mb-4">
                    <p className="text-sm font-bold text-green-800 uppercase">Balance</p>
                    <p className="text-4xl font-black text-green-600">${displayedProfile.balance}</p>
                  </div>

                  {displayedProfile.id === '102' && (
                    <div className="bg-red-500 text-white text-center font-bold py-2 px-4 rounded-lg animate-bounce border-2 border-black">
                      NOT YOUR DATA!
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CENTER: Animation Zone (Arrows & Security) */}
          <div className="w-full md:w-24 flex flex-col items-center justify-center relative z-10 order-2">
            {/* The Arrow */}
            <div className={`
              transition-all duration-1000 ease-in-out transform
              ${arrowStatus === 'idle' ? 'opacity-0' : ''}
              ${arrowStatus === 'moving' ? 'opacity-100 translate-x-0' : ''}
              ${arrowStatus === 'success' ? 'opacity-0 -translate-x-12' : ''}
              ${arrowStatus === 'blocked' ? 'opacity-0 translate-x-4 scale-50' : ''}
            `}>
              <ArrowRight className={`w-20 h-20 ${step === 1 ? 'text-red-500' : 'text-blue-500'} transform rotate-180`} strokeWidth={3} />
            </div>

            {/* The Shield */}
            <AnimatePresence>
              {isShieldActive && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative">
                    <Shield className="w-28 h-28 text-green-500 fill-green-100 drop-shadow-xl" strokeWidth={2} />
                    <Lock className="w-10 h-10 text-green-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  {arrowStatus === 'blocked' && (
                    <div className="absolute -right-8 top-0 text-4xl animate-ping">💥</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Website Vault (Database) */}
          <div className="flex-1 flex flex-col items-center relative order-1 md:order-3">
            <div className="absolute -top-3 right-0 bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-bold border-2 border-black z-10 flex items-center gap-2">
              <Database className="w-4 h-4" /> WEBSITE VAULT
            </div>

            <div className="w-full max-w-xs bg-gray-100 border-4 border-black rounded-2xl p-4 pt-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] flex flex-col gap-3 h-full justify-center">
              {Object.values(USERS).map(user => {
                const isTarget = currentUrlId === user.id;
                const isUnsafeAccess = step === 1 && user.id === '102';
                const isSafeAccess = step === 0 && user.id === '101';
                const isBlocked = step === 3 && user.id === '102' && arrowStatus === 'blocked';

                let cardStyle = 'border-gray-300 bg-white opacity-60 scale-95';
                let glowStyle = '';

                if (isTarget) {
                  if (isBlocked) {
                    cardStyle = 'border-gray-400 bg-gray-200 opacity-50';
                  } else if (isUnsafeAccess) {
                    cardStyle = 'border-red-500 bg-red-50 opacity-100 scale-105 z-10';
                    glowStyle = 'shadow-[0_0_20px_rgba(239,68,68,0.6)] ring-2 ring-red-400';
                  } else if (isSafeAccess) {
                    cardStyle = 'border-green-500 bg-green-50 opacity-100 scale-105 z-10';
                    glowStyle = 'shadow-[0_0_20px_rgba(34,197,94,0.6)] ring-2 ring-green-400';
                  } else {
                    cardStyle = 'border-blue-500 bg-blue-50 opacity-100 scale-100';
                  }
                }

                return (
                  <div
                    key={user.id}
                    className={`
                      relative border-2 rounded-xl p-3 flex items-center gap-3 transition-all duration-300
                      ${cardStyle} ${glowStyle}
                    `}
                  >
                    {isTarget && !isBlocked && arrowStatus === 'moving' && (
                      <div className="absolute -left-8 top-1/2 w-8 h-1 bg-black animate-pulse origin-right scale-x-100 md:block hidden"></div>
                    )}

                    <div className={`w-10 h-10 rounded-full border-2 border-black ${user.avatarColor} flex items-center justify-center flex-shrink-0`}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm truncate">{user.name}</span>
                        <span className="text-xs font-mono bg-black text-white px-1 rounded">#{user.id}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <FileText className="w-3 h-3" />
                        <span>Record Data</span>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {isTarget && !isBlocked ? (
                        <div className={`w-3 h-3 rounded-full ${isUnsafeAccess ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></div>
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Message Bar */}
        <div className="bg-yellow-100 border-t-4 border-black p-6 min-h-[120px] flex items-center justify-center text-center z-20">
          <p className="text-2xl md:text-3xl font-black text-black animate-pulse">
            {message}
          </p>
        </div>

        {/* Checklist Overlay */}
        <AnimatePresence>
          {showChecklist && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#22c55e] rounded-3xl p-8 max-w-lg w-full transform rotate-1">
                <h2 className="text-3xl font-black mb-6 text-center underline decoration-wavy decoration-green-400">
                  Safety Checklist
                </h2>
                <div className="space-y-4 text-xl font-bold">
                  <div className="flex items-center gap-4 p-3 bg-green-50 rounded-xl border-2 border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <span>Website checks who you are</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-green-50 rounded-xl border-2 border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <span>Numbers alone are not trusted</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-green-50 rounded-xl border-2 border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <span>You only see YOUR data</span>
                  </div>
                </div>
                <p className="mt-8 text-center text-gray-500 font-medium animate-bounce">
                  Restarting demo...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Warning */}
      <div className="mt-8 flex items-center gap-2 text-yellow-800 font-bold bg-yellow-200 px-4 py-2 rounded-full border-2 border-yellow-400 opacity-80">
        <AlertTriangle className="w-5 h-5" />
        <span className="text-sm uppercase tracking-wider">
          For Learning Only • Never Try on Real Websites
        </span>
      </div>
    </div>
  );
}