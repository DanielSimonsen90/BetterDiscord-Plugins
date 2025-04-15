export * from './ComponentTypes';

export type BetterOmit<Type, Properties extends keyof Type> = Omit<Type, Properties>;

export type If<Condition extends boolean, Then, Else> = Condition extends true ? Then : Else;
export type Arrayable<T> = T | T[];
export type Autocomplete<T> = T | (string & {});

// Make a typescript type that takes in a function as a generic and the function's new return type
export type NewReturnType<
  Function extends (...args: any[]) => any,
  NewReturnType extends any
> = (...args: Parameters<Function>) => NewReturnType;

export type PromisedReturn<
  Function extends (...args: any[]) => any,
> = NewReturnType<Function, Promise<ReturnType<Function>>>;
export type Promiseable<T> = T | Promise<T>;

export type Functionable<T, Parameters extends any[] = any[]> = ((...args: Parameters) => T) | T;

export type PropsFromFC<T extends (props: any) => any> = T extends (props: infer Props) => any ? Props : unknown;