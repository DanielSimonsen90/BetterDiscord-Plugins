export function timeSpan(startTime: number, endTime: number, format: 'full' | 'short' | 'min' = 'full') {
  const min = Math.min(startTime, endTime);
  const max = Math.max(startTime, endTime);
  const time = max - min;
  const seconds = Math.floor(time / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const stringify = (value: number, unit: string) => `${
    format === 'full' ? value : value.toString().padStart(2, '0')
  }${unit}${
    value === 1 || format !== 'full' ? '' : 's'
  }`;
  const toString = () => [
    days ? stringify(days, format === 'full' ? 'day' : format === 'short' ? 'd' : '') : null,
    hours ? stringify(hours % 24, format === 'full' ? 'hour' : format === 'short' ? 'h' : '') : null,
    minutes ? stringify(minutes % 60, format === 'full' ? 'minute' : format === 'short' ? 'm' : '') : null,
    seconds ? stringify(seconds % 60, format === 'full' ? 'second' : format === 'short' ? 's' : '') : null,
  ].filter(Boolean).join(format === 'full' ? ', ' : format === 'short' ? ' ' : ':');
  return {
    toString, stringify,
    days, hours, minutes, seconds,
    time, min, max,
  }
}