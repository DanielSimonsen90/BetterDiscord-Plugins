import * as DiumFinder from '@dium/api/finder';

import bySourceStrings from './findBySourceStrings';
import findComponentBySourceStrings from './findComponentBySourceStrings';
import findModuleById from './findModuleById';
import findUnpatchedModuleBySourceStrings from './findUnpatchedModuleBySourceStrings';

export const Finder = {
  ...DiumFinder,
  bySourceStrings: bySourceStrings,
  byId: findModuleById,

  findComponentBySourceStrings,
  findUnpatchedModuleBySourceStrings,

  byName: <TResult>(name: string, options?: DiumFinder.FindOptions) => DiumFinder.byName(name, options) as TResult,
  byKeys: <TResult>(keys: string[], options?: DiumFinder.FindOptions) => DiumFinder.byKeys(keys, options) as TResult
};
export default Finder;