import Finder from '@danho-lib/dium/api/finder';
import { Store } from '@dium/modules/flux';
import { DiumStore } from './DiumStore';

export * from './AppStores';
export * from './ChannelStores';
export * from './GuildStores';
export * from './MessageStores';
export * from './UserStores';
export * from './VoiceAndMediaStores';

export * from './DiumStore';

export const DiscordStores = (() => (
  Array.from(BdApi.Webpack
    .getModules(m => m?._dispatchToken && m?.getName)
    .reduce<Map<string, Store>>((acc, store) => {
      const storeName = store.constructor.displayName
        ?? store.constructor.persistKey
        ?? store.constructor.name
        ?? store.getName();

      if (storeName.length !== 1) acc.set(storeName, store);
      return acc;
    }, new Map())
  ).sort(([aStoreName], [bStoreName]) => aStoreName.localeCompare(bStoreName))
    .reduce((acc, [storeName, store]) => {
      acc[storeName] = store;
      return acc;
    }, {})
))();

export function findStore(storeName: string, allowMultiple = false) {
  const result = Object.values<{
    name: string,
    band: number,
    actionHandler: Record<string, any>,
    storeDidChange: (e: any) => void;
  }>(
    Finder.byName("UserSettingsAccountStore")
      ._dispatcher._actionHandlers._dependencyGraph.nodes
  ).sort((a, b) => a.name.localeCompare(b.name))
    .filter(s => s.name.toLowerCase().includes(storeName.toLowerCase()));

  return allowMultiple
    ? result.map(store => [store.name, Finder.byName(store.name) ?? new class InvalidStore { node = store; }])
    : result.map(store =>
      Finder.byName(store.name) as { getName(): string; }
      ?? new class InvalidStore { node = store; getName() { return store.name; } }
    )[0];
}

export const DanhoStores = new class DanhoStores {
  public register(store: DiumStore<any>) {
    this[store.dataKey] = store;
  }
}