import * as DiumFinder from '@dium/api/finder';
import * as BDFDB_Finder from './bdfdb';
import * as Logger from './logger';
import { Patcher } from '@dium/api';
import { SearchOptions } from 'betterdiscord';

export * from '@dium/api/finder';
export * from './bdfdb';

type CustomArgs = `backupId={number}` | `lazy=true` | `showMultiple=true`;
type FindBySourceStringsArgs<CustomArg extends CustomArgs | CustomArgs[] | undefined> =
  CustomArg extends string
  ? [...string[], CustomArg, SearchOptions<boolean>] | [...string[], CustomArg]
  : CustomArg extends Array<CustomArgs>
  ? [...string[], ...CustomArg, SearchOptions<boolean>] | [...string[], ...CustomArg]
  : [...string[], SearchOptions<boolean>] | [...string[]];

export function findBySourceStrings<TResult = any>(
  ...keywords: FindBySourceStringsArgs<["lazy=true", "showMultiple=true"]> 
    | FindBySourceStringsArgs<["showMultiple=true", "lazy=true"]>
  ): Promise<TResult[]>;
export function findBySourceStrings<TResult = any>(
  ...keywords: FindBySourceStringsArgs<`lazy=true`>
): Promise<TResult>;
export function findBySourceStrings<TResult = any>(
  ...keywords: FindBySourceStringsArgs<`showMultiple=true`>
): TResult[];
export function findBySourceStrings<TResult = any>(
  ...keywords: FindBySourceStringsArgs<any>
): TResult;
export function findBySourceStrings<TResult = any>(...keywords: FindBySourceStringsArgs<any>): Promise<TResult> | TResult[] | TResult {
  const searchOptions = keywords.find(k => typeof k === 'object') as SearchOptions<boolean>;
  if (searchOptions) keywords.splice(keywords.indexOf(searchOptions as any), 1);

  const backupIdKeyword = keywords.find(k => k.toString().startsWith('backupId=')) as `backupId={number}`;
  const backupId = backupIdKeyword ? backupIdKeyword.toString().split('=')[1] : null;
  const backupIdKeywordIndex = keywords.indexOf(backupIdKeyword);
  if (backupIdKeywordIndex > -1) keywords.splice(backupIdKeywordIndex, 1);
  if (backupId) Logger.debugLog(`[findBySourceStrings] Using backupId: ${backupId} - [${keywords.join(',')}]`, keywords);

  const showMultiple = keywords.find(k => k === 'showMultiple=true');
  const showMultipleIndex = keywords.indexOf(showMultiple as 'showMultiple=true');
  if (showMultipleIndex > -1) keywords.splice(showMultipleIndex, 1);
  if (showMultiple) Logger.debugLog(`[findBySourceStrings] Showing multiple results - [${keywords.join(',')}]`, keywords);

  const lazy = keywords.find(k => k === 'lazy=true');
  const lazyIndex = keywords.indexOf(lazy as 'lazy=true');
  if (lazyIndex > -1) keywords.splice(lazyIndex, 1);
  if (lazy) Logger.debugLog(`[findBySourceStrings] Using lazy search - [${keywords.join(',')}]`, keywords);

  const _keywords = keywords as string[];
  const moduleCallback = (exports, _, id) => {
    if (!exports || exports === window) return false;

    const eIsFunctionAndHasKeywords = typeof exports === 'function'
      && _keywords.every(keyword => exports.toString().includes(keyword));
    if (eIsFunctionAndHasKeywords) return true;

    const eIsObject = Object.keys(exports).length > 0;
    const moduleIsMethodOrFunctionComponent = Object.keys(exports).some(k =>
      typeof exports[k] === 'function'
      && _keywords.every(keyword => exports[k].toString().includes(keyword))
    );
    const eIsObjectAsE = _keywords.every(keyword => Object.keys(exports).reduce((acc, k) => acc += exports[k]?.toString?.(), '').includes(keyword));
    const moduleIsObjectFromE = Object.keys(exports).some(k =>
      exports[k] && typeof exports[k] === 'object'
      && _keywords.every(keyword =>
        Object.keys(exports[k])
          .reduce((acc, key) => acc += exports[k][key]?.toString?.(), '')
          .includes(keyword)
      )
    );
    const moduleIsClassComponent = Object.keys(exports).some(k =>
      typeof exports[k] === 'function'
      && exports[k].prototype
      && 'render' in exports[k].prototype
      && _keywords.every(keyword => exports[k].prototype.render.toString().includes(keyword))
    );
    const moduleIsObjectOfObjects = Object.keys(exports).some(k =>
      exports[k] && typeof exports[k] === 'object'
      && Object.keys(exports[k]).some(k2 =>
        exports[k][k2] && typeof exports[k][k2] === 'object'
        && _keywords.every(keyword =>
          Object.keys(exports[k][k2])
            .reduce((acc, k3) => exports[k][k2] === window ? acc : acc += exports[k][k2][k3]?.toString?.(), '')
            .includes(keyword)
        )
      )
    );
    const eIsClassAsE = typeof exports === 'object' && 'constructor' in exports && _keywords.every(keyword => exports.constructor.toString().includes(keyword));
    const eIsObjectWithKeywords = _keywords.every(keyword => Object.keys(exports).reduce((acc, k) => acc += k + exports[k]?.toString?.(), '').includes(keyword));

    const filter = eIsObject ? (
      moduleIsMethodOrFunctionComponent
      || eIsObjectAsE
      || moduleIsClassComponent
      || moduleIsObjectFromE
      || moduleIsObjectOfObjects
      || eIsClassAsE
      || eIsObjectWithKeywords
    ) : eIsFunctionAndHasKeywords;

    if ((filter && backupId && id !== backupId) || !filter && id === backupId) Logger.debugWarn(`[findBySourceStrings] Filter failed for keywords: [${keywords.join(',')}]`,
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

    if (backupId && backupId === id) Logger.debugLog('Found by id', { exports, id });
    return filter;
  };
  const moduleCallbackBoundary = (exports, _, id) => {
    try {
      return moduleCallback(exports, _, id);
    } catch (err) {
      const expectedErrorMessages = [
        `%TypedArray%`,
        `from 'Window'`,
        `Cannot convert a Symbol value to a string`
      ];
      if (err instanceof Error && expectedErrorMessages.some(message => err.message.includes(message))) return undefined;
      Logger.error(`[findBySourceStrings] Error in moduleCallback`, err);
    }
  };

  if (lazy) return BdApi.Webpack.waitForModule(moduleCallbackBoundary, {
    signal: DiumFinder.controller.signal,
    ...searchOptions
  }).then(module => {
    Logger.debugLog(`[findBySourceStrings] Found lazy module for [${keywords.join(',')}]`, module);
    return module;
  });

  const moduleSearchOptions = searchOptions ?? { searchExports: true };
  return showMultiple
    ? BdApi.Webpack.getModules(moduleCallbackBoundary, moduleSearchOptions)
    : BdApi.Webpack.getModule(moduleCallbackBoundary, moduleSearchOptions);
};

// type ModuleTest = { hello: 'world', age: 21; };
// const SingleModule = findBySourceStrings<ModuleTest>('hello', 'there');
// //    ^?
// const BackupId = findBySourceStrings<ModuleTest>('hello', 'there', 'backupId=123');
// const Multiple = findBySourceStrings<ModuleTest>('hello', 'there', 'showMultiple=true');
// //    ^?
// const Lazy = findBySourceStrings<ModuleTest>('hello', 'there', 'lazy=true');
// //    ^?
// const MultipleLazy = findBySourceStrings<ModuleTest>('hello', 'showMultiple=true', 'lazy=true');
// //    ^? 
// const SingleWithOptions = findBySourceStrings<ModuleTest>('hello', { searchExports: true });
// //    ^? 
// const MultipleWithOptions = findBySourceStrings<ModuleTest>('hello', 'showMultiple=true', { searchExports: true });
// //    ^? 
// const LazyWithOptions = findBySourceStrings<ModuleTest>('hello', 'lazy=true', { searchExports: true });
// //    ^? 
// const MultipleLazyWithOptions = findBySourceStrings<ModuleTest>('hello', 'lazy=true', 'showMultiple=true', { searchExports: true });
// //    ^?
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