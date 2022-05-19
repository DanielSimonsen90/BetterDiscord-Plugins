import { Arrayable } from "danholibraryjs";
import { Module } from "./ZLibrary";

type Patch = {
    children?: Arrayable<{
        type: 'before' | 'instead' | 'after',
        callback: Function
    }>,
    returnValue: any,
    originalFunction: Function,
};
type Patches = Array<Patch>
type PatchOptions = {
    type?: 'before' | 'instead' | 'after',
    forcePatch?: boolean,
    displayName?: string,
}

export type PatchCallback<Props = any, Fiber = any> = (thisObj: undefined, args: [props: Props, idk: undefined], returnValue: Fiber) => void
export type Patcher = {
    patches(): Patches;
    getPatchesByCaller(name: string): Patches;
    unpatchAll(patches: Patches): void;
    resolveModule(module: Module): Module;
    makeOverride(patch: Patch): () => Patch["returnValue"];
    rePatch(patch: Patch): void;
    makePatch<M extends Module>(module: M, functionName: keyof M, name: string): Patch;

    before<Props extends any, Fiber extends any, M extends Module>(caller: string, moduleToPatch: M, functionName: keyof M, callback: PatchCallback<Props, Fiber>, options?: PatchOptions): ReturnType<Patcher['pushChildPatch']>;
    after<Props extends any, Fiber extends any, M extends Module>(caller: string, moduleToPatch: M, functionName: keyof M, callback: PatchCallback<Props, Fiber>, options?: PatchOptions): ReturnType<Patcher['pushChildPatch']>;
    instead<Props extends any, Fiber extends any, M extends Module>(caller: string, moduleToPatch: M, functionName: keyof M, callback: PatchCallback<Props, Fiber>, options?: PatchOptions): ReturnType<Patcher['pushChildPatch']>;

    pushChildPatch<Props extends any, Fiber extends any, M extends Module>(caller: string, moduleToPatch: M, functionName: keyof M, callback: PatchCallback<Props, Fiber>, options?: PatchOptions): () => void;
}
export default Patcher;