import { Finder } from "@dium/api";
import { SelectedGuildStore, SelectedChannelStore, ChannelStore, GuildStore, GuildMemberStore, UserStore } from '@stores';
import { Arrayable } from "./types";

export * from './Functions';
export * from './Net';

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
export function currentUser() {
  return UserStore.getCurrentUser()
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

  get currentGuild() { return currentGuild(); },
  get currentChannel() { return currentChannel(); },
  get currentGuildMembers() { return currentGuildMembers(); },
  get currentUser() { return currentUser(); }
};

export * from './Users';
export * from './Guilds';
export * from './Channels';