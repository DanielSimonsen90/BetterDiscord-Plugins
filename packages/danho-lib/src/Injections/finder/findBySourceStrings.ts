import { SearchOptions as BaseSearchOptions } from "betterdiscord";
import * as DiumFinder from '@dium/api/finder';

import { createLogger } from "../logger";
import { Autocomplete, If } from "../../Utils/types";
import StringUtils from '../../Utils/String';
import ObjectUtils from '../../Utils/Object';

interface SearchOptions<
  T extends boolean,
  TLazy extends boolean,
  TMultiple extends boolean,
  TModule extends boolean = false,
> extends BaseSearchOptions<T> {
  backupId?: number | string;
  lazy?: TLazy;
  multiple?: TMultiple;
  module?: TModule;
}

type bySourceStringsArgs<
  TModule extends boolean = false,
  TLazy extends boolean = false,
  TMultiple extends boolean = false,
> = (
    [...string[], SearchOptions<boolean, TLazy, TMultiple, TModule>] | [...string[]]
  );

// type ModuleWrapper<TModule extends boolean, TResult> = If<TModule, Record<'Z' | (string  & {}), TResult>, TResult>;
type ModuleWrapper<TModule extends boolean, TResult> = If<TModule, Record<Autocomplete<'Z'>, TResult>, TResult>;

const Logger = createLogger('bySourceStrings');

export function bySourceStrings<TResult extends any, TModule extends boolean = false>(...keywords: bySourceStringsArgs<TModule, false, false>): ModuleWrapper<TModule, TResult>;          // Default
export function bySourceStrings<TResult extends any, TModule extends boolean = false>(...keywords: bySourceStringsArgs<TModule, false, true>): ModuleWrapper<TModule, TResult>[];         // Multiple
export function bySourceStrings<TResult extends any, TModule extends boolean = false>(...keywords: bySourceStringsArgs<TModule, true, false>): Promise<ModuleWrapper<TModule, TResult>>;  // Lazy, Single
export function bySourceStrings<TResult extends any, TModule extends boolean = false>(...keywords: bySourceStringsArgs<TModule, true, true>): Promise<ModuleWrapper<TModule, TResult>[]>; // Lazy, Multiple
export function bySourceStrings<TResult extends any, TModule extends boolean = false>(...keywords: bySourceStringsArgs<TModule, boolean, boolean>): ModuleWrapper<TModule, TResult> {
  const searchOptions = keywords.find(k => typeof k === 'object') as SearchOptions<boolean, boolean, boolean>;
  if (searchOptions) keywords.splice(keywords.indexOf(searchOptions as any), 1);

  const { backupId, lazy, multiple } = searchOptions ?? {} as SearchOptions<boolean, boolean, boolean>;
  if (backupId || lazy || multiple) {
    const loggedMessage = `Using search options: ${StringUtils.join([
      backupId ? `backupId: ${backupId}` : null,
      lazy ? `lazy: ${lazy}` : null,
      multiple ? `multiple: ${multiple}` : null,
    ].filter(Boolean))} - [${keywords.join(',')}]`;

    Logger.debugLog(loggedMessage, { keywords, searchOptions });
  }

  const moduleCallback = (exports: any, _: any, id: string) => {
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
    const eIsClassAsE = typeof exports === 'object' && 'constructor' in exports && keywords.every(keyword => exports.constructor.toString().includes(keyword));
    const eIsObjectWithKeywords = keywords.every(keyword => Object.keys(exports).reduce((acc, k) => acc += k + exports[k]?.toString?.(), '').includes(keyword));

    const filter = eIsObject ? (
      moduleIsMethodOrFunctionComponent
      || eIsObjectAsE
      || moduleIsClassComponent
      || moduleIsObjectFromE
      || moduleIsObjectOfObjects
      || eIsClassAsE
      || eIsObjectWithKeywords
    ) : eIsFunctionAndHasKeywords;

    if ((filter && backupId && id.toString() !== backupId) || !filter && id.toString() === backupId) Logger.debugWarn(`Filter failed for keywords: [${keywords.join(',')}]`,
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

    if (backupId && backupId === id.toString()) Logger.debugLog('Found by id', { exports, id });
    return filter;
  };
  const moduleCallbackBoundary = (exports: any, _: any, id: string) => {
    try {
      return moduleCallback(exports, _, id.toString());
    } catch (err) {
      const expectedErrorMessages = [
        `TypedArray`,
        `from 'Window'`,
        `Cannot convert a Symbol value to a string`,
        '$$baseObject',
      ];
      if (err instanceof Error && expectedErrorMessages.some(message => err.message.includes(message))) return undefined;
      Logger.error(`Error in moduleCallback`, err);
    }
  };

  const moduleSearchOptions: BaseSearchOptions<boolean> = (() => {
    const defaultOptions: BaseSearchOptions<boolean> = ObjectUtils.pick(searchOptions ?? { searchExports: true }, 'defaultExport', 'searchExports', 'first')
    if (searchOptions && 'module' in searchOptions) return Object.assign(defaultOptions, { defaultExport: !searchOptions.module } satisfies BaseSearchOptions<boolean>)
    return defaultOptions;
  })();
  const module = multiple
    ? BdApi.Webpack.getModules(moduleCallbackBoundary, moduleSearchOptions)
    : BdApi.Webpack.getModule(moduleCallbackBoundary, moduleSearchOptions);
  if (module) return lazy ? Promise.resolve(module) as any : module;
  if (lazy) return BdApi.Webpack.waitForModule(moduleCallbackBoundary, {
    signal: DiumFinder.controller.signal,
    ...searchOptions
  }).then(module => {
    Logger.debugLog(`[bySourceStrings] Found lazy module for [${keywords.join(',')}]`, module);
    return module;
  }).catch(err => {
    Logger.error(`[bySourceStrings] Error in lazy search`, err);
    return undefined;
  }) as any;
}

// type ModuleTest = { hello: 'world', age: 21; };
// const SingleModule = bySourceStrings<ModuleTest>('hello', 'there');
// //    ^?
// const BackupId = bySourceStrings<ModuleTest>('hello', 'there', { backupId: '123' });
// const Multiple = bySourceStrings<ModuleTest>('hello', 'there', { multiple: true });
// //    ^?
// const Lazy = bySourceStrings<ModuleTest>('hello', 'there', { lazy: true });
// //    ^?
// const MultipleLazy = bySourceStrings<ModuleTest>('hello', { multiple: true, lazy: true });
// //    ^?
// const SingleWithOptions = bySourceStrings<ModuleTest>('hello', { searchExports: true });
// //    ^?
// const MultipleWithOptions = bySourceStrings<ModuleTest>('hello', { searchExports: true, multiple: true });
// //    ^?
// const LazyWithOptions = bySourceStrings<ModuleTest>('hello', { searchExports: true, lazy: true });
// //    ^?
// const MultipleLazyWithOptions = bySourceStrings<ModuleTest>('hello', { searchExports: true, multiple: true, lazy: true });
// //    ^?

export default bySourceStrings;