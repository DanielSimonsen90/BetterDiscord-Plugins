import type { Patcher } from "@dium/api";

export const createPatcherCallback = <TData, TResult = any>(callback: (data: Patcher.PatchData<TData>) => TResult) => callback;
export const createPatcherAfterCallback = <TData, TResult = void>(callback: (data: Patcher.PatchDataWithResult<TData>) => TResult) => callback;