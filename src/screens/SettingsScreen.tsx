import React from 'react';
import { Settings } from '../types';
import { ChevronLeft, Volume2, VolumeX, Hash } from 'lucide-react';

interface Props {
  settings: Settings;
  onUpdate: (settings: Settings) => void;
  onNavigate: (screen: 'home') => void;
}

export function SettingsScreen({ settings, onUpdate, onNavigate }: Props) {
  return (
    <div className="flex flex-col h-full bg-racing-bg text-white relative">
      <div className="flex items-center p-5 z-10 border-b border-racing-border bg-racing-panel shrink-0">
        <button onClick={() => onNavigate('home')} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="ml-2 font-display text-lg tracking-widest text-white uppercase">Setup</h2>
      </div>

      <div className="flex-1 p-6 space-y-8">
        
        {/* Number of Sectors Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Hash className="w-4 h-4" />
            <h3 className="font-mono text-xs tracking-widest uppercase text-cyan-400">Track Sectors</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {[2, 3, 4, 5].map(num => (
               <button
                 key={num}
                 onClick={() => onUpdate({ ...settings, numSectors: num })}
                 className={`py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                   settings.numSectors === num 
                     ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                     : 'border-racing-border bg-racing-panel text-gray-500 hover:border-gray-600'
                 }`}
               >
                 <span className="font-display text-lg">{num}</span>
               </button>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-2 font-mono leading-relaxed">
            Most circuits use 3 timing sectors. Some short tracks or karting tracks use 2. You can also manually configure 4 or 5 sectors.
          </p>
        </div>

        <div className="h-px bg-racing-border w-full" />

        {/* Voice Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-400">
            {settings.voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <h3 className="font-mono text-xs tracking-widest uppercase text-emerald-400">Engineer Radio</h3>
          </div>
          
          <button
            onClick={() => onUpdate({ ...settings, voiceEnabled: !settings.voiceEnabled })}
            className={`w-full py-4 px-6 rounded-xl border flex justify-between items-center transition-all ${
              settings.voiceEnabled
                ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400'
                : 'border-racing-border bg-racing-panel text-gray-500'
            }`}
          >
            <span className="font-display text-sm tracking-widest uppercase">Audio Feedback</span>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.voiceEnabled ? 'bg-emerald-500' : 'bg-gray-800'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.voiceEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>
          
          <p className="text-gray-600 text-xs mt-2 font-mono leading-relaxed">
            When enabled, the race engineer will read out sector deltas and lap times. (Mockup functionality)
          </p>
        </div>

      </div>
    </div>
  );
}
