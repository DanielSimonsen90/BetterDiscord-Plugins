import * as DiumFinder from '@dium/api/finder';
import * as BDFDB_Finder from './bdfdb';
import * as Logger from './logger';
import { Patcher } from '@dium/api';

export * from '@dium/api/finder';
export * from './bdfdb';

export const findBySourceStrings = <TResult = any>(...keywords: (string | `backupId=${number}`)[]): TResult => {
  const backupIdKeyword = keywords.find(k => k.startsWith('backupId='));
  const backupId = backupIdKeyword ? backupIdKeyword.split('=')[1] : null;
  const backupIdKeywordIndex = keywords.indexOf(backupIdKeyword);
  if (backupIdKeywordIndex > -1) keywords.splice(backupIdKeywordIndex, 1);
  if (backupId) Logger.log(`[findBySourceStrings] Using backupId: ${backupId} - [${keywords.join(',')}]`, keywords);

  return BdApi.Webpack.getModule((e, m, id) => {
    const filter = (
      e
      && e != window
      && Object.keys(e).length ? (
        // Exported property is a function
        Object.keys(e).some(k => typeof e[k] === 'function' && keywords.every(keyword => e[k].toString().includes(keyword))
          // Exported property is an object with a render function
          || Object.keys(e).some(k => typeof e[k] === 'object' && e[k] && 'render' in e[k] && keywords.every(keyword => e[k].render.toString().includes(keyword)))
        )
      ) : (
        typeof e === 'function' && keywords.every(keyword => e.toString().includes(keyword))
      )
    );

    if (!filter && id === backupId) Logger.log(`[findBySourceStrings] Filter failed for keywords: [${keywords.join(',')}]`, e);
    return filter;
  }, { defaultExport: true, searchExports: true });
};

export const findComponentBySourceStrings = async <TResult = JSX.BD.FC>(...keywords: string[]) => {
  const jsxModule = Finder.byKeys(['jsx']);
  const ReactModule = Finder.byKeys(['createElement', 'cloneElement']);
  keywords = keywords.map(keyword => keyword.replace(/\s+/g, ''));

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
      }, { name: `findComponentBySourceStrings([${keywords.join(',')}])`, });
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