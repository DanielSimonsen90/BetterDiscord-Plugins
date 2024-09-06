// #region Types
export type If<Condition, Then, Else> = Condition extends true ? Then : Else;
export type PartialRecord<Keys extends string, Values> = Partial<Record<Keys, Values>>;

// Make a typescript type that takes in a function as a generic and the function's new return type
export type NewReturnType<
  Function extends (...args: any[]) => any,
  NewReturnType extends any
> = (...args: Parameters<Function>) => NewReturnType;
export type PromisedReturn<
  Function extends (...args: any[]) => any,
> = NewReturnType<Function, Promise<ReturnType<Function>>>;
export type Functionable<T, Parameters extends any[] = any[]> = ((...args: Parameters) => T) | T;

import { Store } from '@dium/modules/flux';

// Pick properties from T if key is not in Store
export type FilterStore<T extends Store> = Pick<T, Exclude<keyof T, keyof Store>>;
// #endregion Types

// #region Functions
export const delay = <T>(callback: (...args: any[]) => any, time: number) => new Promise<T>((resolve, reject) => {
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