export type If<Condition, Then, Else> = Condition extends true ? Then : Else;
export type PartialRecord<Keys extends string, Values> = Partial<Record<Keys, Values>>;

export const delay = <T>(callback: (...args: any[]) => any, time: number) => new Promise<T>((resolve, reject) => {
    try { setTimeout(() => resolve(callback()), time); } 
    catch (err) { reject(err); }
})

// Make a typescript type that takes in a function as a generic and the function's new return type
export type NewReturnType<
    Function extends (...args: any[]) => any,
    NewReturnType extends any
> = (...args: Parameters<Function>) => NewReturnType;
export type PromisedReturn<
    Function extends (...args: any[]) => any,
> = NewReturnType<Function, Promise<ReturnType<Function>>>;

export function NoPlugin(pluginName: string) {
    return class NoLibraryPlugin {
        start() {
            BdApi.alert(`${pluginName} - Library not found`, `The library DanhoLibrary was not found. Please install it to use this plugin.`);
        }
        stop() {}
    };
}