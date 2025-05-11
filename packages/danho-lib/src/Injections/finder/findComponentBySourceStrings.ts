import { Patcher } from '@dium/api';
import * as DiumFinder from '@dium/api/finder';

export const findComponentBySourceStrings = async <TResult = React.JSX.BD.FC, RenderedProps = any>(...keywords: string[]): Promise<[TResult, React.JSX.BD.Rendered<RenderedProps>]> => {
  const jsxModule = DiumFinder.byKeys(['jsx']);
  const ReactModule = DiumFinder.byKeys(['createElement', 'cloneElement']);
  keywords = keywords.map(keyword => keyword.replace(/\s+/g, ''));

  const [component, result] = await new Promise<[TResult, React.JSX.BD.Rendered<RenderedProps>]>((resolve, reject) => {
    try {
      // According to actual plugin developers, custom comonents are rendered using the `jsx` module
      const cancelJsx = Patcher.after(jsxModule, 'jsx', ({ result, args: [component] }) => {
        if (typeof component === 'function' && keywords.every(keyword => component.toString().includes(keyword))) {
          cancelJsx();
          cancelCE();
          resolve([component, result]);
        }
      }, { name: `findComponentBySourceStrings([${keywords.join(',')}])`, });

      // According to actual plugin developers, default components are rendered using the `React` module
      const cancelCE = Patcher.after(ReactModule, 'createElement', ({ result, args: [component] }) => {
        if (typeof component === 'function' && keywords.every(keyword => component.toString().includes(keyword))) {
          cancelJsx();
          cancelCE();
          resolve([component, result]);
        }
      }, { name: `findComponentBySourceStrings([${keywords.join(',')}])`, });
    }
    catch (err) {
      reject(err);
    }
  });

  if (typeof component !== 'object') return [component, result] as const;
  if ('prototype' in component
    && typeof component.prototype === 'object'
    && 'render' in component.prototype
    && typeof component.prototype.render === 'function'
  ) {
    component.prototype.render = component.prototype.render.bind(component);
    return [component, result] as const;
  }

  // How does function components work?
  return [component, result] as const;
};

export default findComponentBySourceStrings;