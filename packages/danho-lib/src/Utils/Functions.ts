export const wait = <T>(callback: (...args: any[]) => any, time: number) => new Promise<T>((resolve, reject) => {
  try { setTimeout(() => resolve(callback()), time); }
  catch (err) { reject(err); }
});

type PropertyOptions<T> = {
  defaultValue: T;
  beforeGet?: (value: T) => T;
  beforeSet?: (value: T, wasReset: boolean) => T;
  afterSet?: (value: T, wasReset: boolean) => void;
};
export function createProperty<T>(options: PropertyOptions<T> | T) {
  const optionsCompiled = typeof options === 'object' ? options as PropertyOptions<T> : { defaultValue: options };
  const { defaultValue, beforeGet, beforeSet, afterSet } = optionsCompiled;
  let value = defaultValue;

  function get() {
    return beforeGet?.(value) ?? value;
  }

  function set(newValue: T) {
    value = beforeSet?.(newValue, false) ?? newValue;
    afterSet?.(value, false);
  }
  function nullableSet(newValue: T) {
    if (value === null || value === undefined) return set(newValue);
  }
  function reset() {
    value = defaultValue;
    afterSet?.(defaultValue, true);
  }

  function hasNoValue() {
    return value === null && value === undefined;
  }

  return { get, set, reset, nullableSet, hasNoValue };
}