import { Patcher } from "@dium/api";

// export const createPatcherCallback = <TModule extends Record<string, any>, TKey extends keyof TModule>(
//  callback: (data: Patcher.PatchData<TModule[TKey]>) => any
// ) => callback;

export const createPatcherCallback = <Data>(
  callback: (data: Patcher.PatchData<Data>) => any
) => callback;
export const createPatcherAfterCallback = <Data>(
  callback: (data: Patcher.PatchDataWithResult<Data>) => any
) => callback;
export default createPatcherCallback;