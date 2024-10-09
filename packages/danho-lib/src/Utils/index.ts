import { Finder } from "@dium/api";
import { GuildStore, GuildMemberStore } from '@dium/modules/guild';
import { SelectedChannelStore, ChannelStore } from '@dium/modules/channel';
import { SelectedGuildStore } from '@danho-lib/Stores/GuildStores/SelectedGuildStore';
import { Arrayable } from "./types";

export * from './Functions';

export function findNodeByIncludingClassName<NodeType = Element>(className: string, node = document.body): NodeType | null {
  return node.querySelector(`[class*="${className}"]`) as any;
}

export function findModule(args: Arrayable<string>, returnDisplayNamesOnly = false) {
  const module: Arrayable<any> = typeof args === 'string' ? Finder.query({ name: args }) : Finder.query({ keys: args });
  if (!module) return module;

  return returnDisplayNamesOnly ?
    Array.isArray(module) ?
      module.map(m => m.default?.displayName || m.displayName) :
      module.default?.displayName || module.displayName
    : module;
}
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
    : result.map(store => Finder.byName(store.name) ?? new class InvalidStore { node = store; })[0];
}

export function currentGuild() {
  const guildId = SelectedGuildStore.getGuildId();
  return guildId ? GuildStore.getGuild(guildId) : null;
}
export function currentChannel() {
  const channelId = SelectedChannelStore.getChannelId();
  return channelId ? ChannelStore.getChannel(channelId) : null;
}
export function currentGuildMembers() {
  const guildId = currentGuild()?.id;
  return guildId ? GuildMemberStore.getMembers(guildId) : null;
}

export const Utils = {
  findNodeByIncludingClassName,
  findModule,
  findStore,

  // get currentUser() { return currentUser() },
  get currentGuild() { return currentGuild(); },
  get currentChannel() { return currentChannel(); },
  get currentGuildMembers() { return currentGuildMembers(); },
};

export * from './Users';
export * from './Guilds';
export * from './Channels';