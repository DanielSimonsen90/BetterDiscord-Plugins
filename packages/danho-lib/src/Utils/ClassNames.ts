import { Logger } from "@dium";
import { Finder } from '../dium/api/finder';
import { combine } from "./Object";

type CombinedClassNamesModule<TKeys extends string> = Record<TKeys, string> & {
  getDuplicateKeys(): string[];
  containsClassName(className: string): boolean;
  getClassNameKey(className: string): string | undefined;
}

const indexDuplicate = (key: string, index: number) => `${key}--${index}` as const;

export function combineModuleByKeys<TKeys extends string>(...modules: Array<Array<string>>): CombinedClassNamesModule<TKeys> {
  return modules.reduce((combined, sourceStrings) => {
    const module = Finder.byKeys(sourceStrings);
    return combineModules(combined, module);
  }, {}) as CombinedClassNamesModule<TKeys>;
}

export function combineModules<TKeys extends string>(...modules: Array<Record<string, string>>): CombinedClassNamesModule<TKeys> {
  const record = modules.reduce((combined, module, index) => {
    if (!module) {
      Logger.warn(`[ObjectUtils.combineModules] Module not found for index: ${index}`, modules);
      return combined;
    }

    for (const key in module) {
      let prop = key;
      if (key in combined) {
        const duplicateIndex = Object.keys(combined).filter(k => k.startsWith(`${key}--`)).length;
        prop = indexDuplicate(key, duplicateIndex);
      }
      
      const element = module[key];
      if (typeof element === 'object' && !Array.isArray(element)) {
        combined[prop] = combine(combined[prop], element) as any;
      } else if (element !== undefined && element !== null && element !== '') {
        combined[prop] = element;
      }
    }

    return combined;
  }, {} as Record<TKeys, string>);
  
  const combined = Object.assign({
    getDuplicateKeys: function () {
      return Object.keys(this).filter(key => key.includes('--')).map(key => key.split('--')[0]);
    },
    containsClassName: function (className: string) {
      return containsClassInModule(className, this);
    },
    getClassNameKey: function (className: string) {
      return Object.entries(this).find(([key, value]) => value === className)?.[0];
    }
  }, record) as CombinedClassNamesModule<TKeys>;

  return combined;
}

export function containsClassInModule(className: string, module: CombinedClassNamesModule<string>) {
  return Object.values(module).some((value) => value === className);
}

/**
 * Finds the module containing the given className and determines the minimal set of keys
 * required to uniquely identify the module.
 *
 * @param className - The class name to search for (e.g., "disabled__07f91").
 * @returns The module object and the minimal array of keys to identify it.
 */
export function findModuleWithMinimalKeys(className: string): { module: Record<string, string>; keys: string[] } | null {
  // Step 1: Find the module using the className
  const module = Finder.findBySourceStrings<Record<string, string>>(className, { defaultExport: false });
  if (!module) {
    Logger.warn(`Module not found for className: ${className}`);
    return null;
  }

  // Step 2: Extract all keys from the module
  const keys = Object.keys(module);
  if (keys.length === 0) {
    Logger.warn(`No keys found in the module for className: ${className}`);
    return null;
  }

  // Step 3: Attempt if className's key is unique enough alone to identify the module
  const classNameKey = Object.keys(module).find(key => module[key] === className);
  const byClassNameKey = Finder.byKeys([classNameKey]);
  
  // If the module is found by the className key, return it as the only key
  if (byClassNameKey === module) return { module, keys: [classNameKey] };
  
  // Step 4: Start with all keys and iteratively reduce them
  let minimalKeys = [...keys]; // Start with all keys
  for (const key of keys) {
    // Test if removing the current key still retrieves the same module
    const testKeys = minimalKeys.filter(k => k !== key);
    const foundModule = Finder.byKeys(testKeys);

    if (foundModule === module) {
      // If the module is still uniquely identified, update the minimal keys
      minimalKeys = testKeys;
    }
  }

  return { module, keys: minimalKeys };
}

export const ColorClassNames: Record<(
  `color${'Brand' | 'Danger' | 'Default' | 'Premium' | 'PremiumGradient' | 'Success'}`
), string> = Finder.byKeys(["colorDefault", "radioIcon"])

export const ClassNamesUtils = {
  combineModuleByKeys,
  combineModules,
  containsClassInModule,
  indexDuplicate,
  findModuleWithMinimalKeys,
  ColorClassNames,
};