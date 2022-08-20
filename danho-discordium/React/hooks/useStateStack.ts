import { Dispatch, SetStateAction, useEffect, useState } from 'danho-discordium/React';
import useDebounce from './useDebounce';


export function useStateStack<State>(initialState: State, stackSize: number = 10): [State, {
  push: Dispatch<SetStateAction<State>>;
  pop: () => void;
  undo: () => void;
  redo: () => void;
}] {
  const [lastState, setLastState] = useState<State>(initialState);
  const [stack, setStack] = useState<State[]>([initialState]);

  useDebounce(() => {
    setStack((prev) => {
      if (prev[prev.length - 1] === lastState) {
        return prev;
      }
      return [...prev, lastState];
    });
  }, 1000, [lastState]);

  const pop = () => setStack((prev) => {
    if (prev.length === 1) return prev;

    return prev.slice(0, prev.length - 1);
  });

  const undo = () => setStack((prev) => {
    if (prev.length === 1) return prev;

    setLastState(prev[prev.length - 2]);
    return prev.slice(0, prev.length - 1);
  });

  const redo = () => setStack((prev) => {
    if (prev.length === 1) return prev;

    setLastState(prev[prev.length - 1]);
    return prev.slice(0, prev.length - 1);
  });

  return [lastState, { push: setLastState, pop, undo, redo }];
}
export default useStateStack;