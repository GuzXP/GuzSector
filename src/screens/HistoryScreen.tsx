import React from 'react';
import { SessionState } from '../types';
import { formatTime, formatDelta } from '../utils';
import { ChevronLeft, Trophy, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  sessionState: SessionState;
  onNavigate: (screen: 'home') => void;
  onClearHistory: () => void;
  onDeleteLap: (lapId: string) => void;
}

export function HistoryScreen({ sessionState, onNavigate, onClearHistory, onDeleteLap }: Props) {
  const { laps, bestLap } = sessionState;

  // Render delta color class
  const getDeltaColor = (delta: number | null) => {
    if (delta === null || isNaN(delta)) return 'text-gray-500';
    if (delta < 0) return 'text-sector-green';
    if (delta > 0) return 'text-sector-red';
    return 'text-gray-400';
  };

  const getBorderColorClass = (color: string | undefined) => {
    switch (color) {
      case 'purple': return 'border-purple-500';
      case 'green': return 'border-emerald-500';
      case 'yellow': return 'border-yellow-500';
      default: return 'border-gray-800/50';
    }
  }

  return (
    <div className="flex flex-col h-full bg-racing-bg text-white relative">
      <div className="flex items-center justify-between p-5 z-10 border-b border-racing-border bg-racing-panel shrink-0">
        <div className="flex items-center">
          <button onClick={() => onNavigate('home')} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="ml-2 font-display text-lg tracking-widest text-white uppercase">Lap History</h2>
        </div>
        <button onClick={onClearHistory} className="text-gray-500 hover:text-sector-red transition-colors flex items-center gap-2">
          <Trash2 className="w-5 h-5"/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 custom-scrollbar">
        {laps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-600">
            <p className="font-mono text-xs tracking-widest uppercase">No Laps Recorded</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...laps].reverse().map((lap, idx) => {
              const isBest = bestLap === lap.lapTime;
              const hasFullData = lap.sectors.length > 0 && typeof lap.lapTime === 'number';

              return (
                <div 
                  key={lap.id} 
                  className={`bg-racing-panel border rounded-xl overflow-hidden ${isBest ? 'border-sector-purple shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-racing-border'}`}
                >
                  <div className="flex justify-between items-center p-4 border-b border-gray-800/50 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xl text-gray-400 w-6">L{lap.lapNumber}</span>
                      {isBest && <Trophy className="w-4 h-4 text-sector-purple" />}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className={`font-mono text-xl ${isBest ? 'text-sector-purple font-bold' : 'text-white'}`}>
                          {hasFullData ? formatTime(lap.lapTime) : 'INCOMPLETE'}
                        </span>
                        {hasFullData && <span className={`font-mono text-[10px] ${getDeltaColor(lap.delta)}`}>{formatDelta(lap.delta)}</span>}
                      </div>
                      <button onClick={() => onDeleteLap(lap.id)} className="text-gray-600 hover:text-sector-red transition-colors p-1 -mr-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {hasFullData && (
                    <div className="flex divide-x divide-gray-800/50 bg-black/20">
                      {lap.sectors.map((sector, sIdx) => (
                        <div key={sIdx} className={`p-2 flex-1 flex flex-col items-center border-b-2 ${getBorderColorClass(sector.color)}`}>
                          <span className="font-mono text-[8px] text-gray-500 tracking-widest uppercase mb-1">S{sIdx + 1}</span>
                          <span className="font-mono text-xs text-gray-300">{formatTime(sector.time)}</span>
                          <span className={`font-mono text-[9px] ${getDeltaColor(sector.delta)}`}>{formatDelta(sector.delta)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
