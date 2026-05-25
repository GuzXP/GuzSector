import React from 'react';
import { Settings as SettingsIcon, History, Play, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onStartSession: () => void;
  onNavigate: (screen: 'settings' | 'history') => void;
}

export function HomeScreen({ onStartSession, onNavigate }: Props) {
  return (
    <div className="flex flex-col h-full bg-racing-bg text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 flex justify-center items-center pointer-events-none">
        <div className="w-[800px] h-[800px] border border-cyan-500/20 rounded-full blur-[2px] animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[600px] h-[600px] border border-emerald-500/10 rounded-full blur-[1px] animate-[spin_40s_linear_reverse_infinite]" />
        
        {/* Speed lines */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-racing-bg/80 to-racing-bg flex flex-col justify-center items-center">
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-20 px-6 z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 mb-16"
        >
          <div className="flex justify-center items-center gap-2 text-cyan-400 mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ghost">
              <path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8c0 0 0 0 0 0z"/>
            </svg>
            <h1 className="text-4xl font-display font-bold tracking-widest uppercase">Guz <span className="text-white">Sector</span></h1>
          </div>
          <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase">Manual Telemetry & Timing</p>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center items-center pb-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartSession}
            className="relative group w-64 h-64 flex flex-col justify-center items-center rounded-full bg-racing-panel border-2 border-emerald-500/50 hover:border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:shadow-[0_0_80px_rgba(16,185,129,0.25)] transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full border border-emerald-400/20 scale-110 animate-ping [animation-duration:3s]" />
            <Play className="w-16 h-16 text-emerald-400 mb-4 ml-2 group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            <span className="font-display font-bold text-xl tracking-wider text-emerald-500 group-hover:text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">START</span>
            <span className="font-display font-medium text-lg tracking-wider text-emerald-600 group-hover:text-emerald-500">SESSION</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom Nav / Actions */}
      <div className="h-24 px-8 pb-8 pt-4 flex justify-between items-center bg-gradient-to-t from-black to-transparent z-10">
        <button 
          onClick={() => onNavigate('settings')}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400 transition-colors"
        >
          <SettingsIcon className="w-6 h-6" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Setup</span>
        </button>

        <button 
          onClick={() => onNavigate('history')}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-emerald-400 transition-colors"
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Data</span>
        </button>
      </div>
    </div>
  );
}
