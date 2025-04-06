import { useState, useCallback } from '../React'

export function useForceUpdate() {
  const [, setState] = useState(0);
  return useCallback(() => setState((prev) => prev + 1), []);
}