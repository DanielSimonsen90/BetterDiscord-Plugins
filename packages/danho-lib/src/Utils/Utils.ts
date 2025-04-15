import { GuildMemberStore } from '@discord/stores';

import { ChannelUtils } from './Channel';
import { ClassNamesUtils } from "./ClassNames";
import { ContextMenuUtils } from "./ContextMenu";
import { GuildUtils } from './Guilds';
import { NetUtils } from './Net';
import { UserUtils } from './User';
import { StringUtils } from './String';
import { ObjectUtils } from './Object';
import { UrlUtils } from './Url';
import { TimeUtils } from './Time';

export function findNodeByIncludingClassName<NodeType = Element>(className: string, node = document.body): NodeType | null {
  return node.querySelector(`[class*="${className}"]`) as any;
}

export const Utils = {
  findNodeByIncludingClassName,

  get currentGuild() { return GuildUtils.current; },
  get currentChannel() { return ChannelUtils.current; },
  get currentGuildMembers() {
    const guildId = GuildUtils.currentId;
    return guildId ? GuildMemberStore.getMembers(guildId) : null;
  },
  get currentUser() { return UserUtils.me; },

  StringUtils, ObjectUtils, UrlUtils, TimeUtils, NetUtils,
  ClassNamesUtils, ContextMenuUtils,
  ChannelUtils, GuildUtils, UserUtils,
};

export default Utils;