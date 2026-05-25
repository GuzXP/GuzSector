export interface SectorTime {
  time: number;
  delta: number;
  color: 'purple' | 'green' | 'yellow' | 'none';
}

export interface Lap {
  id: string;
  lapNumber: number;
  sectors: SectorTime[];
  lapTime: number;
  delta: number;
}

export interface SessionState {
  currentLap: number;
  currentSector: number; // 0, 1, 2...
  lapStartTime: number | null;
  lastSectorTapTime: number | null;
  tapHistory: number[]; // timeline of sectorTapTimes to allow undo
  currentLapSectors: SectorTime[];
  laps: Lap[];
  bestSectors: (number | null)[];
  bestLap: number | null;
  optimalLap: number | null;
}

export interface Settings {
  numSectors: number;
  voiceEnabled: boolean;
}
