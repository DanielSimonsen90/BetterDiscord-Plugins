import { useEffect, useRef } from '../React';

export function useDebounce(callback: () => void, delay: number, dependencies: any[]): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = setTimeout(() => callbackRef.current(), delay);
    return () => clearTimeout(handler);
  }, dependencies);
}

export function useDebounceCallback<T extends (...args: any[]) => any>(callback: T, delay: number): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useRef((...args: any[]) => {
    const handler = setTimeout(() => callbackRef.current(...args), delay);
    return () => clearTimeout(handler);
  }).current as T;
}

export default useDebounce;