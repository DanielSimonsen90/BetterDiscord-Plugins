import { DependencyList, useMemo, useEffect, useState } from '@react';
import { Patcher } from 'discordium';

import { createLogger } from '@discordium/api';
import { Callback, createPatcher } from '@discordium/api/patcher';

type PatcherConfig = {
    name: string,
    version: string,
    once?: boolean,
    color?: string,
    repatchDeps?: DependencyList
}
type UsePatcherReturn = [patched: boolean, cancel: () => void];

export function usePatcher<
    Module extends Record<string, any>, 
    PatchType extends Extract<keyof Patcher, 'before' | 'instead' | 'after'>,
    Patch extends keyof Module, 
    Cb extends Callback<Module[Patch]>
>(module: Module, type: PatchType, patch: Patch, callback: Cb, config: PatcherConfig): UsePatcherReturn {
    const { name, version, once } = config;
    const color = config.color ?? "#777";
    const repatchDeps = config.repatchDeps ?? [];

    const patcher = useMemo(() => createPatcher(`${name}-settings`, createLogger(`${name}-settings`, color, version)), [])
    
    const [patched, setPatched] = useState(false);
    const [cancel, setCancel] = useState(() => () => {});

    useEffect(() => {
        setCancel(patcher[type as any](module, patch, callback, { once }));
        setPatched(true);

        return cancel;
    }, repatchDeps);

    return [patched, cancel];
}