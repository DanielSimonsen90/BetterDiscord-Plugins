import { Finder } from '@dium/api'; // This finder because of circular dependencies
import { createLogger } from '../Injections/logger'

function pick<From, Properties extends keyof From>(from: From, ...properties: Properties[]): Pick<From, Properties> {
  if (!from) throw new Error("Cannot pick from undefined!");

  return properties.reduce((acc, prop) => {
    // if (!from.hasOwnProperty(prop)) throw new Error(`Cannot pick property ${prop} from ${from}!`);

    acc[prop] = from[prop];
    if (acc[prop] === undefined) delete acc[prop];
    return acc;
  }, {} as Pick<From, Properties>);
}

function exclude<From, Properties extends keyof From>(from: From, ...properties: Properties[]): Omit<From, Properties> {
  if (!from) return from;

  return Object.keys(from).reduce((acc, key) => {
    if (!properties.includes(key as Properties)) (acc as any)[key] = from[key];
    return acc;
  }, {} as Omit<From, Properties>);
}

function difference<T extends object>(source: T, target: T, exclude?: Array<keyof T>): Partial<T> {
  const diffKeys = new Set([...Object.keys(source), ...Object.keys(target)]);
  exclude?.forEach(key => diffKeys.delete(key as any));

  return [...diffKeys.values()].reduce((acc, key, i, arr) => {
    const sourceValue = JSON.stringify(source[key]);
    const targetValue = JSON.stringify(target[key]);
    if (sourceValue !== targetValue) acc[key] = target[key];
    return acc;
  }, {} as T);
}

type Combinable<T extends Record<string, any>> = {
  [key in keyof T]?: T[key] extends Record<string, any> ? Combinable<T[key]> : T[key];
};

function combine<T extends Record<string, any | undefined>>(...objects: Array<Combinable<T> | undefined>): T {
  return objects.reduce((acc: T, obj) => {
    if (!obj) return acc;

    for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        acc[key] = combine(acc[key] as T, obj[key] as T) as any;
      } else if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        (acc[key] as Combinable<T>) = obj[key];
      }
    }
    return acc;
  }, {} as T) as T;
}

function combineModules<T extends Record<string, any | undefined>>(...modules: Array<Array<string>>): T {
  const Logger = createLogger('ObjectUtils.combineModules');
  return modules.reduce((combined, sourceStrings) => {
    const module = Finder.byKeys(sourceStrings);
    if (!module) {
      Logger.warn(`Module not found for source strings: ${sourceStrings.join(', ')}`);
      return combined;
    }

    if (typeof module !== 'object') throw new Error(`Module is not an object: ${module}`);
    
    for (const key in module) {
      let prop = key;
      if (key in combined) {
        const duplicateIndex = Object.keys(combined).filter(k => k.startsWith(`${key}--`)).length;
        prop = `${key}--${duplicateIndex}`;
      }
      
      const element = module[key];
      if (typeof element === 'object' && !Array.isArray(element)) {
        combined[prop] = combine(combined[prop], element) as any;
      } else if (element !== undefined && element !== null && element !== '') {
        combined[prop] = element;
      }
    }

    return combined;
  }, {}) as T;
}

function isEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const ObjectUtils = {
  pick, exclude, isEqual,
  difference, combine, combineModules,
}

export default ObjectUtils;