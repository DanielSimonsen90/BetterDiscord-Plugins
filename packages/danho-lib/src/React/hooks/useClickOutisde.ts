import { ClassNamesUtils, StringUtils } from '@utils';
import { useEffect } from '../React'

type Callback = (event: MouseEvent) => void;

const AppClassNames = ClassNamesUtils.combineModuleByKeys<(
  'app'
)>(['app', 'mobileApp'])

export function useClickOutside(callback: Callback): string;
export function useClickOutside(selector: string, callback: Callback): void;
export function useClickOutside(ref: React.RefObject<HTMLElement>, callback: Callback): void;
export function useClickOutside(
  arg: string | React.RefObject<HTMLElement> | Callback,
  callback?: Callback,
) {
  const clickId = StringUtils.generateRandomId();
  callback = callback || arg as Callback;

  const onClickOutside = (event: MouseEvent) => {
    const selectedNode = (
      typeof arg === 'string' ? document.querySelector(arg) 
      : 'current' in arg ? arg.current
      : document.querySelector(`[data-click-id="${clickId}"]`)
    );
    const target = event.target as Node;

    // Check appContainer incase context menu was used on element.
    // If context menu was used, don't trigger callback.
    const [appContainer] = document.getElementsByClassName(AppClassNames.app);

    if (selectedNode && appContainer.contains(target) && !selectedNode.contains(target)) callback(event);
  };

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('touchstart', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('touchstart', onClickOutside);
    };
  }, [arg, callback]);

  return clickId;
}