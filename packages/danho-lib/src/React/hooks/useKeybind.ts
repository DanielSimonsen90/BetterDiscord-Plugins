import { MutableRefObject, useEffect } from "../React";

type Keys = 'Control' | 'Shift' | 'Alt' | (string & {});

type onKeybind = (e: KeyboardEvent) => void;

export function useKeybind(keybinds: Array<Keys>, onKeybind: onKeybind): void;
export function useKeybind(ref: MutableRefObject<HTMLElement>, keybinds: Array<Keys>, onKeybind: onKeybind): void;
export function useKeybind() {
  const ref: MutableRefObject<HTMLElement> = Array.isArray(arguments[0]) ? { current: window as any } : arguments[0];
  const kebyinds : Array<Keys>= Array.isArray(arguments[0]) ? arguments[0] : arguments[1];
  const onKeybind: onKeybind = Array.isArray(arguments[0]) ? arguments[1] : arguments[2];

  const [isCtrl, isShift, isAlt] = ['Control', 'Shift', 'Alt'].map(k => kebyinds.includes(k));
  const _keybinds = kebyinds.filter(k => !['Control', 'Shift', 'Alt'].includes(k));

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isCtrl && !e.ctrlKey) return;
      if (isShift && !e.shiftKey) return;
      if (isAlt && !e.altKey) return;
      if (!_keybinds.includes(e.key)) return;

      onKeybind(e);
    };

    const target = ref?.current;
    if (!target) return;

    target.addEventListener('keydown', onKeyDown);
    return () => target.removeEventListener('keydown', onKeyDown);
  }, [ref, kebyinds, onKeybind]);
}