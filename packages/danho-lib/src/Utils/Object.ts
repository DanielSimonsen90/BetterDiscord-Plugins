export function pick<From, Properties extends keyof From>(from: From, ...properties: Properties[]): Pick<From, Properties> {
  if (!from) throw new Error("Cannot pick from undefined!");

  return properties.reduce((acc, prop) => {
    // if (!from.hasOwnProperty(prop)) throw new Error(`Cannot pick property ${prop} from ${from}!`);

    acc[prop] = from[prop];
    return acc;
  }, {} as Pick<From, Properties>);
}

export function exclude<From, Properties extends keyof From>(from: From, ...properties: Properties[]): Omit<From, Properties> {
  if (!from) throw new Error("Cannot exclude from undefined!");

  return Object.keys(from).reduce((acc, key) => {
    if (!properties.includes(key as Properties)) (acc as any)[key] = from[key];
    return acc;
  }, {} as Omit<From, Properties>);
}

export function difference<T extends object>(source: T, target: T, exclude?: Array<keyof T>): Partial<T> {
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

export function combine<T extends Record<string, any | undefined>>(...objects: Array<Combinable<T> | undefined>): T {
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

export const ObjectUtils = {
  pick, exclude,
  difference, combine,
}

export default ObjectUtils;