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


export const createBDD = () => (window as any).BDD = {
    findNodeByIncludingClassName<NodeType = Element>(className: string, node = document.body): NodeType | null {
        return node.querySelector(`[class*="${className}"]`) as any;
    },
    findModuleByIncludes(displayName: string, returnDisplayNamesOnly = false) {
        const modules = window.ZLibrary.WebpackModules.findAll(match => match?.default?.displayName?.toLowerCase().includes(displayName.toLowerCase()));
        if (!returnDisplayNamesOnly) return modules;
        return modules.map(module => module.default.displayName).sort();
    },
    findClassModuleContainingClass(className: string) {
        const DiscordClassModules = Object.assign({}, window.ZLibrary.DiscordClassModules, window.BDFDB.DiscordClassModules);
        
        return Object.keys(DiscordClassModules).map(key => {
            const property = DiscordClassModules[key];
            if (!property) return null;

            const filtered = Object.keys(property).map(item => {
                const value = property[item];
                return value.toLowerCase().includes(className.toLowerCase()) && [item, value];
            }).filter(v => v);
                
            if (!filtered.length) return null;

            return [key, filtered.reduce((result, [item, value]) => {
                result[item] = value;
                return result;
            }, {} as any)];
        }).filter(v => v).reduce((result, [key, value]) => {
            result[key] = value;
            return result;
        }, {} as any);
    }
}