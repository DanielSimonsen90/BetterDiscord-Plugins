import * as DiumFinder from '@dium/api/finder';
import * as BDFDB_Finder from './bdfdb';
import { Patcher } from '@dium/api';

export * from '@dium/api/finder';
export * from './bdfdb';

export const findBySourceStrings = <TResult = any>(...keywords: string[]) => BdApi.Webpack.getModule(m =>
  m
  && m != window
  && Object.keys(m).length
  && (
    // Exported property is a function
    Object.keys(m).some(k => typeof m[k] === 'function' && keywords.every(keyword => m[k].toString().includes(keyword))
    // Exported property is an object with a render function
    || Object.keys(m).some(k => typeof m[k] === 'object' && m[k] && 'render' in m[k] && keywords.every(keyword => m[k].render.toString().includes(keyword)))
  )
), { defaultExport: false, searchExports: true }
) as TResult;

export const findComponentBySourceStrings = async <TResult = any>(...keywords: string[]) => {
  const jsxModule = Finder.byKeys(['jsx']);
  const ReactModule = Finder.byKeys(['createElement', 'cloneElement']);

  const component = await new Promise<TResult>((resolve, reject) => {
    try {
      // According to actual plugin developers, custom comonents are rendered using the `jsx` module
      const cancelJsx = Patcher.after(jsxModule, 'jsx', ({ args: [component] }) => {
        if (typeof component === 'function' && keywords.every(keyword => component.toString().includes(keyword))) {
          cancelJsx();
          cancelCE();
          resolve(component);
        }
      }, { silent: true });

      // According to actual plugin developers, default components are rendered using the `React` module
      const cancelCE = Patcher.after(ReactModule, 'createElement', ({ args: [component] }) => {
        if (typeof component === 'function' && keywords.every(keyword => component.toString().includes(keyword))) {
          cancelJsx();
          cancelCE();
          resolve(component);
        }
      }, { name: `findComponentBySourceStrings([${keywords.join(',')}])`,  });
    }
    catch (err) {
      reject(err);
    }
  });

  if (typeof component !== 'object') return component;
  if ('prototype' in component
    && typeof component.prototype === 'object'
    && 'render' in component.prototype
    && typeof component.prototype.render === 'function'
  ) {
    component.prototype.render = component.prototype.render.bind(component);
    return component;
  }

  // How does function components work?
  return component;
};

export const Finder = {
  ...DiumFinder,
  ...BDFDB_Finder,
  findBySourceStrings,
  findComponentBySourceStrings
};
export default Finder;