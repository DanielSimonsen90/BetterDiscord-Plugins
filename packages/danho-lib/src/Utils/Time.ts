export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
export const YEAR = DAY * 365;

export function timeSpan(startTime: number, endTime: number, format: 'full' | 'short' | 'min' = 'full') {
  const min = Math.min(startTime, endTime);
  const max = Math.max(startTime, endTime);
  const time = max - min;
  const seconds = Math.floor(time / SECOND);
  const minutes = Math.floor(time / MINUTE);
  const hours = Math.floor(time / HOUR);
  const days = Math.floor(time / DAY);
  const weeks = Math.floor(time / WEEK);
  const months = Math.floor(time / MONTH);
  const years = Math.floor(time / YEAR);

  const stringify = (value: number, unit: string) => `${
    format === 'full' ? value : value.toString().padStart(2, '0')
  }${unit}${
    value === 1 || format !== 'full' ? '' : 's'
  }`;
  const toString = () => [
    years ? stringify(years, format === 'full' ? ' year' : format === 'short' ? 'y' : '') : null,
    months ? stringify(months % 12, format === 'full' ? ' month' : format === 'short' ? 'M' : '') : null,
    weeks ? stringify(weeks % 4, format === 'full' ? ' week' : format === 'short' ? 'w' : '') : null,
    days ? stringify(days % 7, format === 'full' ? ' day' : format === 'short' ? 'd' : '') : null,
    hours ? stringify(hours % 24, format === 'full' ? ' hour' : format === 'short' ? 'h' : '') : null,
    minutes ? stringify(minutes % 60, format === 'full' ? ' minute' : format === 'short' ? 'm' : '') : null,
    seconds ? stringify(seconds % 60, format === 'full' ? ' second' : format === 'short' ? 's' : '') : null,
  ].filter(Boolean).join(format === 'full' ? ', ' : format === 'short' ? ' ' : ':');
  return {
    toString, stringify,
    years,
    months: months,
    weeks: weeks,
    days, hours, minutes, seconds,
    time, min, max,
  }
}

export function wait<T>(time: number): Promise<never>;
export function wait<T>(callback: (...args: any[]) => any, time: number): Promise<T>;
export function wait<T>(callbackOrTime: ((...args: any[]) => any) | number, time?: number) {
  const callback = typeof callbackOrTime === 'function' ? callbackOrTime : (() => undefined);
  time ??= callbackOrTime as number;

  return new Promise<T>((resolve, reject) => {
    try { setTimeout(() => resolve(callback()), time); }
    catch (err) { reject(err); }
  });
}

export function getUnixTime(date: Date | string): number;
export function getUnixTime(timestamp: number): number;
export function getUnixTime(arg: Date | string | number): number {
  const timestamp = typeof arg === 'number' ? arg : new Date(arg).getTime();
  return Math.floor(timestamp / 1000);
}

export function throttle<T>(callback: (...args: T[]) => void, delay: number) {
  let lastTime = 0;
  return function (...args: T[]) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      callback(...args);
    }
  };
}

export const TimeUtils = {
  SECOND, MINUTE, HOUR, DAY, WEEK, MONTH, YEAR,
  timeSpan, getUnixTime, wait,
  throttle,
}

export default TimeUtils;