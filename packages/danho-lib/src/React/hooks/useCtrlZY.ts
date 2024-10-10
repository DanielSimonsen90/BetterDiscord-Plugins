import { useKeybind } from './useKeybind';

type Props = {
  onCtrlZ: () => void;
  onCtrlY: () => void;
};

export function useCtrlZY({ onCtrlY, onCtrlZ }: Props) {
  useKeybind(['Control', 'z'], onCtrlZ);
  useKeybind(['Control', 'y'], onCtrlY);
}