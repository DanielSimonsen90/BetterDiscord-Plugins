import { Store } from '@dium/modules/flux';

export * from './AppStores';
export * from './ChannelStores';
export * from './GuildStores';
export * from './MessageStores';
export * from './UserStores';
export * from './VoiceAndMediaStores';

export const DiscordStores = (() => (
  Array.from(BdApi.Webpack
    .getModules<Store>(m => m?._dispatchToken && m?.getName)
    .reduce<Map<string, Store>>((acc, store) => {
      const storeName = (store.constructor as any).displayName
        ?? (store.constructor as any).persistKey
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