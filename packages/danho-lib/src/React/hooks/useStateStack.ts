import { useState, useCallback, Dispatch, SetStateAction } from '../React';
import useDebounce from './useDebounce';

export function useStateStack<State>(initialState: State): [State, {
  push: Dispatch<SetStateAction<State>>;
  pop: (amount?: number) => void;
  undo: () => void;
  redo: () => void;
  clear: (state?: State) => void;
}] {
  const [lastState, setLastState] = useState<State>(initialState);
  const [stack, setStack] = useState<State[]>([initialState]);

  useDebounce(() => setStack((prev) => {
    if (prev[prev.length - 1] === lastState) return prev;

    return [...prev, lastState];
  }), 1000, [lastState]);

  const pop = useCallback((amount: number = 0) => setStack((prev) => {
    if (prev.length === 1) return prev;

    return prev.slice(0, prev.length - 1 - amount);
  }), []);

  const undo = useCallback(() => setStack((prev) => {
    if (prev.length === 1) return prev;

    setLastState(prev[prev.length - 2]);
    return prev.slice(0, prev.length - 1);
  }), []);

  const redo = useCallback(() => setStack((prev) => {
    if (prev.length === 1) return prev;

    setLastState(prev[prev.length - 1]);
    return prev.slice(0, prev.length - 1);
  }), []);

  const clear = useCallback((state?: State) => {
    setLastState(state ?? initialState);
    setStack([state ?? initialState]);
  }, [initialState]);

  return [lastState, { push: setLastState, pop, undo, redo, clear }];
}
export default useStateStack;