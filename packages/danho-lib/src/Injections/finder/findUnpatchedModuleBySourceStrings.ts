import * as Logger from '../logger';
import bySourceStrings from "./findBySourceStrings";

export function findUnpatchedModuleBySourceStrings(...keywords: string[]) {
  const module = bySourceStrings(...keywords);
  if (!module) {
    Logger.log(`[findUnpatchedModuleBySourceStrings] Module not found for keywords: [${keywords.join(',')}]`);
    return undefined;
  }

  if (typeof module === 'function') return module['__originalFunction'];

  return module;
}

export default findUnpatchedModuleBySourceStrings;