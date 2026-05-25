import React from 'react';
import { SessionState, Settings } from '../types';
import { formatTime, formatDelta } from '../utils';
import { Flag, ChevronLeft, Undo2 } from 'lucide-react';

interface Props {
  sessionState: SessionState;
  settings: Settings;
  currentLapTime: number; // Current ongoing lap time
  onTap: () => void;
  onEndSession: () => void;
  onUndo: () => void;
}

export function TimerScreen({ sessionState, settings, currentLapTime, onTap, onEndSession, onUndo }: Props) {
  const { currentLap, currentSector, bestLap, optimalLap, bestSectors, laps, currentLapSectors, tapHistory } = sessionState;

  const currentLapData = laps.length > 0 ? laps[laps.length - 1] : null;

  const colorClasses = {
    purple: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]',
    green: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]',
    yellow: 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]',
    none: 'bg-transparent'
  };

  // Render delta color class for text
  const getDeltaColor = (delta: number | null) => {
    if (delta === null) return 'text-gray-500';
    if (delta < 0) return 'text-sector-green drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]';
    if (delta > 0) return 'text-sector-red drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]';
    return 'text-gray-400';
  };

  // Build sector indicators around the main tap area
  const renderSectorIndicators = () => {
    const indicators = [];
    for (let i = 0; i < settings.numSectors; i++) {
      const isCurrent = i === currentSector;
      const isCompleted = i < currentSector;
      
      let sectorData = null;
      if (isCompleted) {
         sectorData = currentLapSectors[i];
      } else {
         sectorData = currentLapData?.sectors[i];
      }
      
      let statusColor = 'border-racing-border';
      let titleColor = 'text-gray-600';
      if (isCurrent) {
        statusColor = 'border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)] bg-cyan-950/20';
        titleColor = 'text-cyan-400';
      } else if (isCompleted) {
        statusColor = 'border-gray-800 bg-racing-panel';
        titleColor = 'text-gray-400';
      }

      indicators.push(
        <div key={i} className={`flex-1 flex flex-col items-center justify-center pt-2 pb-1 px-1 rounded-xl border ${statusColor} transition-all duration-300 relative overflow-hidden`}>
          <span className={`text-[10px] font-mono tracking-widest ${titleColor}`}>S{i + 1}</span>
          {sectorData ? (
            <>
              <span className={`font-mono ${settings.numSectors > 3 ? 'text-[10px]' : 'text-xs'} mt-1`}>{formatTime(sectorData.time)}</span>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${sectorData.color ? colorClasses[sectorData.color] : colorClasses.none}`} />
            </>
          ) : isCurrent ? (
            <span className={`font-mono ${settings.numSectors > 3 ? 'text-[9px]' : 'text-xs'} mt-1 text-white animate-pulse`}>--.---</span>
          ) : (
            <span className={`font-mono ${settings.numSectors > 3 ? 'text-[9px]' : 'text-xs'} mt-1 text-gray-700`}>--.---</span>
          )}
        </div>
      );
    }
    return indicators;
  };

  return (
    <div className="flex flex-col h-full bg-racing-bg text-white relative">
      {/* Ghost background */}
      <div className="absolute inset-0 z-0 opacity-10 flex justify-center items-center pointer-events-none overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-[150%] h-[150%] opacity-20 text-cyan-500" preserveAspectRatio="none">
           <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-[dash_10s_linear_infinite]" strokeDasharray="5, 10" />
           <path d="M0,70 Q25,60 50,70 T100,70" fill="none" stroke="currentColor" strokeWidth="0.2" className="animate-[dash_15s_linear_infinite_reverse]" strokeDasharray="3, 10" />
        </svg>
      </div>

      {/* Top Bar */}
      <div className="flex justify-between items-center p-5 z-10 border-b border-racing-border bg-racing-bg/80 backdrop-blur">
        <button onClick={onEndSession} className="flex items-center text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6 mr-1" />
          <span className="font-display text-sm tracking-widest text-sector-red">END</span>
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onUndo} 
            disabled={currentSector === 0 || tapHistory.length === 0}
            className={`flex items-center gap-1 ${currentSector === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-cyan-400'} text-gray-400 transition-colors`}
          >
             <Undo2 className="w-5 h-5" />
             <span className="font-display text-xs tracking-widest uppercase">Undo</span>
          </button>
          <div className="flex flex-col items-end">
            <span className="font-display text-xs text-gray-500 tracking-[0.2em]">LAP</span>
            <span className="font-display text-xl text-cyan-400">{currentLap}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-6 px-4 z-10">
        
        {/* Main Stopwatch Area (LAP TIME) */}
        <div className="flex-none text-center mb-8">
          <div className="text-[10px] font-mono tracking-[0.3em] text-gray-500 mb-2 uppercase">Current Lap Time</div>
          <div className="font-display font-medium text-7xl text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {formatTime(currentLapTime)}
          </div>
        </div>

        {/* Sector Indicators Row */}
        <div className="flex gap-2 mb-8">
          {renderSectorIndicators()}
        </div>

        {/* HUGE Tap Area */}
        <button 
          onClick={onTap}
          className="flex-1 max-h-[40vh] w-full rounded-3xl bg-racing-panel border-2 border-cyan-500/30 hover:border-cyan-400 active:bg-cyan-900/40 relative overflow-hidden group shadow-[0_0_30px_rgba(34,211,238,0.05)] transition-colors"
        >
           <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
           <div className="h-full flex flex-col justify-center items-center">
             <div className="text-cyan-500/50 group-hover:text-cyan-400/80 mb-4 transition-colors">
               <Flag className="w-16 h-16" />
             </div>
             <span className="font-display font-bold text-2xl tracking-[0.1em] text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">TAP TO RECORD</span>
             <span className="font-mono text-xs text-cyan-600 tracking-widest mt-2 uppercase">Sector {currentSector + 1}</span>
           </div>
        </button>

      </div>

      {/* Bottom Telemetry Panel */}
      <div className="bg-racing-panel border-t border-racing-border rounded-t-3xl p-6 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex-none">
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div>
            <div className="font-mono text-[9px] text-gray-500 tracking-widest uppercase mb-1">Last Lap</div>
            <div className="font-mono text-xl text-white">{currentLapData ? formatTime(currentLapData.lapTime) : '--:--.---'}</div>
          </div>
          <div>
            <div className="font-mono text-[9px] text-gray-500 tracking-widest uppercase mb-1">Delta</div>
            <div className={`font-mono text-xl ${getDeltaColor(currentLapData?.sectors.length ? currentLapData.delta : null)}`}>
               {currentLapData?.sectors.length ? formatDelta(currentLapData.delta) : '-.---'}
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] text-gray-500 tracking-widest uppercase mb-1">Best Lap</div>
            <div className="font-mono text-lg text-sector-purple">{bestLap ? formatTime(bestLap) : '--:--.---'}</div>
          </div>
          <div>
            <div className="font-mono text-[9px] text-gray-500 tracking-widest uppercase mb-1">Optimal (Teo)</div>
            <div className="font-mono text-lg text-emerald-400">{optimalLap ? formatTime(optimalLap) : '--:--.---'}</div>
          </div>
        </div>

        {/* Best Sectors Micro Table */}
        <div className="mt-6 pt-4 border-t border-gray-800/50 flex flex-wrap justify-between gap-y-2">
          {Array.from({ length: settings.numSectors }).map((_, i) => (
             <div key={i} className="font-mono text-[9px] text-gray-600 uppercase tracking-wider flex items-center min-w-[70px]">
               S{i + 1}: <span className="text-gray-300 ml-1">{formatTime(bestSectors[i] || NaN)}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

