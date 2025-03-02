import { Store } from '@dium/modules/flux';

export * from './ComponentTypes';

export type BetterOmit<Type, Properties extends keyof Type> = Omit<Type, Properties>;

export type If<Condition extends boolean, Then, Else> = Condition extends true ? Then : Else;
export type Arrayable<T> = T | T[];
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

// Pick properties from T if key is not in Store
export type FilterStore<T extends Store> = Pick<T, Exclude<keyof T, keyof Store>>;

export type PropsFromFC<T extends (props: any) => any> = T extends (props: infer Props) => any ? Props : unknown;