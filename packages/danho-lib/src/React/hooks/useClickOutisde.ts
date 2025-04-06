import { StringUtils } from '@danho-lib/Utils';
import { useEffect } from '../React'

type Callback = (event: MouseEvent) => void;

export function useClickOutside(callback: Callback): string;
export function useClickOutside(selector: string, callback: Callback): void;
export function useClickOutside(ref: React.RefObject<HTMLElement>, callback: Callback): void;
export function useClickOutside(
  arg: string | React.RefObject<HTMLElement> | Callback,
  callback?: Callback,
) {
  const clickId = StringUtils.generateRandomId();
  callback = callback || arg as Callback;

  const handleClickOutside = (event: MouseEvent) => {
    const selectedNode = (
      typeof arg === 'string' ? document.querySelector(arg) 
      : 'current' in arg ? arg.current
      : document.querySelector(`[data-click-id="${clickId}"]`)
    );
    const target = event.target as Node;

    if (selectedNode && !selectedNode.contains(target)) callback(event);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [arg, callback]);

  return clickId;
}