import * as DiumPatcher from '@dium/api/patcher';

interface PatchOptions extends DiumPatcher.Options {

}

class DanhoPatcher {
  public after<TModule, TKey extends keyof TModule>(
    module: TModule,
    key: TKey,
    callback: (data: DiumPatcher.PatchDataWithResult<TModule[TKey], TModule>) => unknown,
    options: PatchOptions = {}
  ) {
    return DiumPatcher.after(module, key, callback, options);
  }

  public instead<TModule, TKey extends keyof TModule>(
    module: TModule,
    key: TKey,
    callback: (data: DiumPatcher.PatchData<TModule[TKey], TModule>) => TModule[TKey] extends (...args: any) => infer Result ? Result : TModule[TKey],
    options: PatchOptions = {}
  ) {
    return DiumPatcher.instead(module, key, callback, options);
  }

  public before<TModule, TKey extends keyof TModule>(
    module: TModule,
    key: TKey,
    callback: (data: DiumPatcher.PatchData<TModule[TKey], TModule>) => unknown,
    options: PatchOptions = {}
  ) {
    return DiumPatcher.before(module, key, callback, options);
  }
}

export const Patcher = Object.assign(
  {},
  DiumPatcher,
  new DanhoPatcher(),
);

export default Patcher;