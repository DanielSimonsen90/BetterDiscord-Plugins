import { useEffect } from "../React";

type Keys = 'Control' | 'Shift' | 'Alt' | string;

type onKeybind = (e: KeyboardEvent) => void;

export function useKeybind(keybinds: Array<Keys>, onKeybind: onKeybind) {
  const [isCtrl, isShift, isAlt] = ['Control', 'Shift', 'Alt'].map(k => keybinds.includes(k));
  const _keybinds = keybinds.filter(k => !['Control', 'Shift', 'Alt'].includes(k));

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isCtrl && !e.ctrlKey) return;
      if (isShift && !e.shiftKey) return;
      if (isAlt && !e.altKey) return;
      if (!_keybinds.includes(e.key)) return;

      onKeybind(e);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [keybinds, onKeybind]);
}