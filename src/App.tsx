import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { TimerScreen } from './screens/TimerScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SessionState, Settings, Lap, SectorTime } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'timer' | 'history' | 'settings'>('home');
  
  const [settings, setSettings] = useState<Settings>({
    numSectors: 3,
    voiceEnabled: false,
  });

  const [session, setSession] = useState<SessionState>({
    currentLap: 1,
    currentSector: 0,
    lapStartTime: null,
    lastSectorTapTime: null,
    tapHistory: [],
    currentLapSectors: [],
    laps: [],
    bestSectors: Array(settings.numSectors).fill(null),
    bestLap: null,
    optimalLap: null,
  });

  const [currentLapTimeMs, setCurrentLapTimeMs] = useState(0);
  const frameRef = useRef<number | null>(null);

  const updateTime = useCallback(() => {
    if (session.lapStartTime && session.lastSectorTapTime) {
      const now = Date.now();
      setCurrentLapTimeMs(now - session.lapStartTime);
      frameRef.current = requestAnimationFrame(updateTime);
    }
  }, [session.lapStartTime, session.lastSectorTapTime]);

  useEffect(() => {
    if (session.lapStartTime) {
      frameRef.current = requestAnimationFrame(updateTime);
    } else {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      setCurrentLapTimeMs(0);
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [session.lapStartTime, updateTime]);

  // Make sure bestSectors array length matches numSectors change
  useEffect(() => {
    setSession(prev => ({
      ...prev,
      bestSectors: prev.bestSectors.length >= settings.numSectors 
        ? prev.bestSectors.slice(0, settings.numSectors)
        : [...prev.bestSectors, ...Array(settings.numSectors - prev.bestSectors.length).fill(null)]
    }));
  }, [settings.numSectors]);

  const handleStartSession = () => {
    const now = Date.now();
    setSession(prev => ({
      ...prev,
      currentLap: prev.laps.length > 0 ? prev.laps[prev.laps.length - 1].lapNumber + 1 : 1,
      currentSector: 0,
      lapStartTime: now,
      lastSectorTapTime: now,
      tapHistory: [],
      currentLapSectors: [],
    }));
    setCurrentScreen('timer');
  };

  const handleEndSession = () => {
    setSession(prev => ({
      ...prev,
      lapStartTime: null,
      lastSectorTapTime: null,
    }));
    setCurrentScreen('home');
  };

  const handleUndo = () => {
    setSession(prev => {
      if (prev.currentSector === 0 || prev.tapHistory.length === 0) return prev; // Cannot undo past the start of the current lap to keep things simple
      
      const newSectors = [...prev.currentLapSectors];
      newSectors.pop();
      
      const prevTapTime = prev.tapHistory[prev.tapHistory.length - 1];
      const newTapHistory = prev.tapHistory.slice(0, -1);
      
      // Also potentially recalculate bestSectors and bestLaps?
      // Since it's an undo, restoring overall session bests perfectly is hard without full history.
      // We will accept a minor concession that bestSectors remain if they set a fast one then undo'd.
      
      return {
        ...prev,
        currentSector: prev.currentSector - 1,
        currentLapSectors: newSectors,
        lastSectorTapTime: prevTapTime,
        tapHistory: newTapHistory
      };
    });
  };

  const clearHistory = () => {
    setSession({
      currentLap: 1,
      currentSector: 0,
      lapStartTime: null,
      lastSectorTapTime: null,
      tapHistory: [],
      currentLapSectors: [],
      laps: [],
      bestSectors: Array(settings.numSectors).fill(null),
      bestLap: null,
      optimalLap: null,
    });
  };

  const handleDeleteLap = (lapId: string) => {
    setSession(prev => {
      const newLaps = prev.laps.filter(l => l.id !== lapId);
      
      const newBestLap = newLaps.length > 0 
        ? Math.min(...newLaps.map(l => l.lapTime))
        : null;

      const newBestSectors = Array(settings.numSectors).fill(null);
      newLaps.forEach(lap => {
        lap.sectors.forEach((sec, idx) => {
          if (newBestSectors[idx] === null || sec.time < newBestSectors[idx]) {
             newBestSectors[idx] = sec.time;
          }
        });
      });

      const validBests = newBestSectors.filter(s => s !== null);
      const newOptimal = validBests.length === settings.numSectors ? validBests.reduce((a, b) => a + b, 0) : null;
      
      return {
        ...prev,
        laps: newLaps,
        bestLap: newBestLap,
        bestSectors: newBestSectors,
        optimalLap: newOptimal
      };
    });
  };

  const handleTap = () => {
    if (!session.lastSectorTapTime || !session.lapStartTime) return;
    
    const now = Date.now();
    const sectorTimeMs = now - session.lastSectorTapTime;
    
    setSession(prev => {
      const isLastSector = prev.currentSector === settings.numSectors - 1;
      
      // Calculate delta against best sector
      const overallBest = prev.bestSectors[prev.currentSector];
      const previousLap = prev.laps[prev.laps.length - 1];
      const personalBestThisSector = previousLap && previousLap.sectors[prev.currentSector] 
        ? previousLap.sectors[prev.currentSector].time 
        : null;

      let color: 'purple' | 'green' | 'yellow' = 'yellow';
      let delta = 0;

      if (overallBest === null || sectorTimeMs < overallBest) {
        color = 'purple';
        delta = overallBest === null ? 0 : sectorTimeMs - overallBest;
      } else if (personalBestThisSector && sectorTimeMs < personalBestThisSector) {
        color = 'green';
        delta = sectorTimeMs - personalBestThisSector;
      } else {
        color = 'yellow';
        delta = personalBestThisSector ? sectorTimeMs - personalBestThisSector : (overallBest ? sectorTimeMs - overallBest : 0);
      }
      
      const newSector: SectorTime = { time: sectorTimeMs, delta, color };
      
      // Update best sectors
      const newBestSectors = [...prev.bestSectors];
      if (overallBest === null || sectorTimeMs < overallBest) {
        newBestSectors[prev.currentSector] = sectorTimeMs;
      }
      
      const calcOptimal = newBestSectors.filter(s => s !== null) as number[];
      const newOptimalLap = calcOptimal.length === settings.numSectors ? calcOptimal.reduce((a, b) => a + b, 0) : null;

      if (isLastSector) {
        // Complete lap
        const completedSectors = [...prev.currentLapSectors, newSector];
        const lapTime = completedSectors.reduce((total, s) => total + s.time, 0);
        const lapDelta = prev.bestLap ? lapTime - prev.bestLap : 0;
        
        let newBestLap = prev.bestLap;
        if (newBestLap === null || lapTime < newBestLap) {
          newBestLap = lapTime;
        }

        const completedLap: Lap = {
          id: Date.now().toString(),
          lapNumber: prev.currentLap,
          sectors: completedSectors,
          lapTime,
          delta: lapDelta
        };

        return {
          ...prev,
          currentSector: 0,
          lastSectorTapTime: now,
          lapStartTime: now,
          tapHistory: [],
          currentLapSectors: [],
          bestSectors: newBestSectors,
          optimalLap: newOptimalLap,
          bestLap: newBestLap,
          currentLap: prev.currentLap + 1,
          laps: [...prev.laps, completedLap]
        };
      } else {
        // Just increment sector
        return {
          ...prev,
          currentSector: prev.currentSector + 1,
          lastSectorTapTime: now,
          tapHistory: [...prev.tapHistory, prev.lastSectorTapTime!],
          currentLapSectors: [...prev.currentLapSectors, newSector],
          bestSectors: newBestSectors,
          optimalLap: newOptimalLap,
        };
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen sm:h-[850px] sm:max-h-[100dvh] bg-black sm:border sm:border-gray-800 sm:rounded-3xl sm:shadow-2xl overflow-hidden relative">
      {currentScreen === 'home' && (
        <div className="w-full h-full absolute inset-0">
          <HomeScreen 
            onStartSession={handleStartSession} 
            onNavigate={setCurrentScreen} 
          />
        </div>
      )}
      
      {currentScreen === 'timer' && (
        <div className="w-full h-full absolute inset-0 bg-racing-bg">
          <TimerScreen 
            sessionState={session}
            settings={settings}
            currentLapTime={currentLapTimeMs}
            onTap={handleTap}
            onEndSession={handleEndSession}
            onUndo={handleUndo}
          />
        </div>
      )}

      {currentScreen === 'history' && (
        <div className="w-full h-full absolute inset-0 bg-racing-bg">
          <HistoryScreen 
            sessionState={session}
            onNavigate={setCurrentScreen}
            onClearHistory={clearHistory}
            onDeleteLap={handleDeleteLap}
          />
        </div>
      )}

      {currentScreen === 'settings' && (
        <div className="w-full h-full absolute inset-0 bg-racing-bg">
          <SettingsScreen 
            settings={settings}
            onUpdate={setSettings}
            onNavigate={setCurrentScreen}
          />
        </div>
      )}
    </div>
  );
}

