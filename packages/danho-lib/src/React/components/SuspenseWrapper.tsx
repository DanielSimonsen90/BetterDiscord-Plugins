import { Promiseable } from '@danho-lib/Utils/types';
import { useEffect, useMemo, useState } from '../React';
import { Logger } from '@danho-lib/dium/api/logger';

type SuspenseWrapperProps = {
  defaultChild: JSX.Element | ((retry: () => void) => JSX.Element);
  render: () => Promiseable<JSX.Element | undefined>;
};

export function SuspenseWrapper({ defaultChild, render }: SuspenseWrapperProps) {
  const [retries, setRetries] = useState(0);
  const initialChild = useMemo(() => (
    typeof defaultChild === 'function'
      ? defaultChild(() => setRetries((prev) => prev + 1))
      : defaultChild
  ), [defaultChild, setRetries]);
  const [child, setChild] = useState<JSX.Element>(initialChild);

  useEffect(() => {
    let isMounted = true;

    const handleRender = async () => {
      try {
        const result = await render();
        if (isMounted && result) setChild(result);
      } catch (error) {
        console.error('SuspenseWrapper render error:', error);
      }
    };

    handleRender();

    return () => {
      isMounted = false;
    };
  }, [render, retries]);

  try {
    return child;
  } catch (error) {
    Logger.error('SuspenseWrapper error', { error, defaultChild, render });
    return initialChild;
  }
}