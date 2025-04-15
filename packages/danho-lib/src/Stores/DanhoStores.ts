import DiumStore from "./DiumStore";

export const DanhoStores = new class DanhoStores {
  public register(store: DiumStore<any>) {
    this[store.dataKey] = store;

    if (window.DL?.Stores.DanhoStores) {
      const instance = window.DL.Stores.DanhoStores;
      if (store.dataKey in instance) return;
      instance.register(store);
    }
  }
}

export function loadData(store: DiumStore<any>) {
  const data = BdApi.Data.load('0DanhoLibrary', store.dataKey);
  store.update(data, true);
}