import { Patcher } from "@dium/api";

// export const createPatcherCallback = <TModule extends Record<string, any>, TKey extends keyof TModule>(
//  callback: (data: Patcher.PatchData<TModule[TKey]>) => any
// ) => callback;

export const createPatcherCallback = <TData, TResult = any>(
  callback: (data: Patcher.PatchData<TData>) => TResult
) => callback;
export const createPatcherAfterCallback = <TData, TResult = void>(
  callback: (data: Patcher.PatchDataWithResult<TData>) => TResult
) => callback;
export default createPatcherCallback;