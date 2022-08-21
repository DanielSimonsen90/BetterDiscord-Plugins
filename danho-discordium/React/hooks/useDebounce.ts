import { React } from '@discordium/modules';
const { useEffect, useRef } = React

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
export default useDebounce;