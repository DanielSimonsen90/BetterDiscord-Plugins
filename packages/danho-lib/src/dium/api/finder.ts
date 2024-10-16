import * as DiumFinder from '@dium/api/finder';
import * as BDFDB_Finder from './bdfdb';
import * as Logger from './logger';
import { Patcher } from '@dium/api';
import { SearchOptions } from 'betterdiscord';

export * from '@dium/api/finder';
export * from './bdfdb';

type AdditionalFindArgs = `backupId={number}` | SearchOptions<boolean>;
type FindBySourceStringsArgs = [...string[]] | [...string[], AdditionalFindArgs];

export const findBySourceStrings = <TResult = any>(...keywords: FindBySourceStringsArgs): TResult => {
  const searchOptions = keywords.find(k => typeof k === 'object') as SearchOptions<boolean>;
  if (searchOptions) keywords.splice(keywords.indexOf(searchOptions as any), 1);

  const backupIdKeyword = keywords.find(k => k.toString().startsWith('backupId=')) as `backupId={number}`;
  const backupId = backupIdKeyword ? backupIdKeyword.toString().split('=')[1] : null;
  const backupIdKeywordIndex = keywords.indexOf(backupIdKeyword);
  if (backupIdKeywordIndex > -1) keywords.splice(backupIdKeywordIndex, 1);
  if (backupId) Logger.log(`[findBySourceStrings] Using backupId: ${backupId} - [${keywords.join(',')}]`, keywords);

  return BdApi.Webpack.getModule((exports, _, id) => {
    if (!exports || exports === window) return false;

    const eIsFunctionAndHasKeywords = typeof exports === 'function'
      && keywords.every(keyword => exports.toString().includes(keyword));
    if (eIsFunctionAndHasKeywords) return true;

    const eIsObject = Object.keys(exports).length > 0;
    const moduleIsMethodOrFunctionComponent = Object.keys(exports).some(k =>
      typeof exports[k] === 'function'
      && keywords.every(keyword => exports[k].toString().includes(keyword))
    );
    const eIsObjectAsE = keywords.every(keyword => Object.keys(exports).reduce((acc, k) => acc += exports[k]?.toString?.(), '').includes(keyword));
    const moduleIsObjectFromE = Object.keys(exports).some(k =>
      exports[k] && typeof exports[k] === 'object'
      && keywords.every(keyword =>
        Object.keys(exports[k])
          .reduce((acc, key) => acc += exports[k][key]?.toString?.(), '')
          .includes(keyword)
      )
    );
    const moduleIsClassComponent = Object.keys(exports).some(k =>
      typeof exports[k] === 'function'
      && exports[k].prototype
      && 'render' in exports[k].prototype
      && keywords.every(keyword => exports[k].prototype.render.toString().includes(keyword))
    );
    const moduleIsObjectOfObjects = Object.keys(exports).some(k =>
      exports[k] && typeof exports[k] === 'object'
      && Object.keys(exports[k]).some(k2 =>
        exports[k][k2] && typeof exports[k][k2] === 'object'
        && keywords.every(keyword =>
          Object.keys(exports[k][k2])
            .reduce((acc, k3) => exports[k][k2] === window ? acc : acc += exports[k][k2][k3]?.toString?.(), '')
            .includes(keyword)
        )
      )
    );
    const eIsClassAsE = 'constructor' in exports && keywords.every(keyword => exports.constructor.toString().includes(keyword));

    const filter = eIsObject ? (
      moduleIsMethodOrFunctionComponent
      || eIsObjectAsE
      || moduleIsClassComponent
      || moduleIsObjectFromE
      || moduleIsObjectOfObjects
      || eIsClassAsE
    ) : eIsFunctionAndHasKeywords;

    if ((filter && id !== backupId) || !filter && id === backupId) Logger.log(`[findBySourceStrings] Filter failed for keywords: [${keywords.join(',')}]`,
    {
      exports,
      internal: {
        eIsFunctionAndHasKeywords,
        moduleIsMethodOrFunctionComponent,
        eIsObjectAsE,
        moduleIsClassComponent,
        moduleIsObjectFromE,
        moduleIsObjectOfObjects,
        eIsClassAsE,
      },
      strings: {
        exports: JSON.stringify(exports),
        keys: Object.keys(exports).map(k => `${k}: ${JSON.stringify(exports[k])}`),
      }
    }
    );
    return filter;
  }, searchOptions ?? { searchExports: true });
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