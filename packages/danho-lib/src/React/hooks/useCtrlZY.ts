import { useEffect } from '../React';

type Props = {
  onCtrlZ: () => void;
  onCtrlY: () => void;
};

export function useCtrlZY({ onCtrlY, onCtrlZ }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        onCtrlZ();
      } else if (e.ctrlKey && e.key === 'y') {
        onCtrlY();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCtrlZ, onCtrlY]);
}