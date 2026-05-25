export function formatTime(ms: number): string {
  if (ms == null || isNaN(ms)) return '--:--.---';
  
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  const minStr = minutes > 0 ? `${minutes}:` : '';
  const secStr = minutes > 0 ? seconds.toString().padStart(2, '0') : seconds.toString();
  const msStr = milliseconds.toString().padStart(3, '0');

  return `${minStr}${secStr}.${msStr}`;
}

export function formatDelta(deltaMs: number): string {
  if (deltaMs == null || isNaN(deltaMs)) return '-.---';
  
  const isNegative = deltaMs < 0;
  const absDelta = Math.abs(deltaMs);
  const seconds = Math.floor(absDelta / 1000);
  const milliseconds = absDelta % 1000;

  const sign = isNegative ? '-' : '+';
  return `${sign}${seconds}.${milliseconds.toString().padStart(3, '0')}`;
}
