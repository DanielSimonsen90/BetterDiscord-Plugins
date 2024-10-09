import { useState, useEffect, DependencyList } from '../React';
import * as Patcher from '@dium/api/patcher';

type PatcherConfig = {
    name: string,
    version: string,
    once?: boolean,
    color?: string,
    repatchDeps?: DependencyList
}
type UsePatcherReturn = [patched: boolean, cancel: () => void];
type Callback<T> = (cancel: () => void, original: T, ...args: any) => any;

export function usePatcher<
    Module extends Record<string, any>, 
    PatchType extends 'before' | 'instead' | 'after',
    Patch extends keyof Module, 
    Cb extends Callback<Module[Patch]>
>(module: Module, type: PatchType, patch: Patch, callback: Cb, config: PatcherConfig): UsePatcherReturn {
    const { once } = config;
    const repatchDeps = config.repatchDeps ?? [];

    const [patched, setPatched] = useState(false);
    const [cancel, setCancel] = useState(() => () => {});

    useEffect(() => {
        setCancel(Patcher[type as any](module, patch, callback, { once }));
        setPatched(true);

        return cancel;
    }, repatchDeps);

    return [patched, cancel];
}