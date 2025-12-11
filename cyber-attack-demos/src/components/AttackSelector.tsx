import React from 'react';
import { motion } from 'framer-motion';
import { Database, Code, Key, Shield, Terminal } from 'lucide-react';
import { AttackType } from '../App';

interface AttackSelectorProps {
  onSelectAttack: (attack: AttackType) => void;
}

const attacks = [
  {
    id: 'sqli' as AttackType,
    title: 'SQL Injection',
    description: 'See how malicious code can trick databases into revealing secrets',
    icon: Database,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700'
  },
  {
    id: 'xss' as AttackType,
    title: 'Cross-Site Scripting (XSS)',
    description: 'Watch how bad scripts can steal your information from websites',
    icon: Code,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700'
  },
  {
    id: 'idor' as AttackType,
    title: 'Insecure Direct Object Reference',
    description: 'Learn how changing numbers in URLs can access other people\'s data',
    icon: Key,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  {
    id: 'csrf' as AttackType,
    title: 'Cross-Site Request Forgery',
    description: 'Discover how fake buttons can make actions without your permission',
    icon: Shield,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700'
  },
  {
    id: 'command-injection' as AttackType,
    title: 'Command Injection',
    description: 'See how search boxes can be tricked into deleting entire databases',
    icon: Terminal,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  }
];

export function AttackSelector({ onSelectAttack }: AttackSelectorProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
          Choose a Cyber Attack to Learn About
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Click on any attack type below to see an interactive demonstration. 
          Each demo shows how the attack works and how to protect against it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attacks.map((attack, index) => {
          const Icon = attack.icon;
          return (
            <motion.button
              key={attack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectAttack(attack.id)}
              className={`
                ${attack.bgColor} ${attack.borderColor} 
                border-2 rounded-2xl p-6 text-left transition-all duration-300 
                hover:shadow-xl hover:shadow-slate-200 group
              `}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`
                  p-3 rounded-xl bg-gradient-to-br ${attack.color} 
                  text-white shadow-lg group-hover:scale-110 transition-transform
                `}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${attack.textColor} mb-2`}>
                    {attack.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {attack.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${attack.textColor} uppercase tracking-wider`}>
                  Interactive Demo
                </span>
                <motion.div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${attack.color} flex items-center justify-center`}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white text-lg">→</span>
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 rounded-full border border-blue-200">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">
            All demos are safe simulations for learning purposes only
          </span>
        </div>
      </div>
    </div>
  );
}