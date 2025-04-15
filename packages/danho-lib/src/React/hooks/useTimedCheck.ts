import { useState, useEffect } from '../React';

export function useTimedCheck<TValue = any>(
  callback: () => TValue,
  delay: number,
  dependencies: React.DependencyList = [],
): TValue {
  const [value, setValue] = useState<TValue>(callback());

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(callback());
    }, delay);

    return () => clearTimeout(timer);
  }, [callback, delay, ...dependencies]);

  return value;
}