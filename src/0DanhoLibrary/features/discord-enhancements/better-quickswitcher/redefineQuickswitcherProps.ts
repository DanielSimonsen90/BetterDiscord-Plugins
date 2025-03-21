import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import { SortableArray } from "@danho-lib/Utils/Array";
import { Channel, Guild, User } from "@discord/types";
import { ChannelTypes } from "@discord/types/channel/types";
import { Logger } from "@dium";
import { QuickSwitcherStore, RelationshipStore, SortedGuildStore, QuickSwitcherResult, ChannelStore, GuildStore, UserStore } from "@stores";

const originalFix = createPatcherAfterCallback<QuickSwitcherStore['getProps']>(({ result }) => {
  const sorted = new SortableArray(...result.results)
    .orderBy(
      function compareByName(a, b) {
        function sortByName() {
          return 'name' in a.record && 'name' in b.record
            ? a.record.name.localeCompare(b.record.name)
            : 0;
        }
        function sortByUsername() {
          return 'username' in a.record && 'username' in b.record
            ? a.record.username.localeCompare(b.record.username)
            : 0;
        }

        return sortByName() || sortByUsername();
      },
      function compareByType(a, b) {
        return a.type.localeCompare(b.type);
      },
      function customCompare(a, b) {
        function sortByUser() {
          return a.type === 'USER' && b.type === 'USER'
            ? RelationshipStore.isFriend(a.record.id) && !RelationshipStore.isFriend(b.record.id)
              ? -1
              : RelationshipStore.isFriend(b.record.id) && !RelationshipStore.isFriend(a.record.id)
                ? 1
                : 0
            : 0;
        }
        function sortByGuild() {
          return a.type === 'GUILD' && b.type === 'GUILD'
            ? SortedGuildStore.guildIds.indexOf(a.record.id) - SortedGuildStore.guildIds.indexOf(b.record.id)
            // if Channel, favor sorted guild
            : 0;
        }
        function sortByChannel() {
          return (a.type === 'TEXT_CHANNEL' && b.type === 'TEXT_CHANNEL') || (a.type === 'VOICE_CHANNEL' && b.type === 'VOICE_CHANNEL')
            ? SortedGuildStore.guildIds.indexOf(a.record.guild_id) - SortedGuildStore.guildIds.indexOf(b.record.guild_id)
            : 0;
        }

        return sortByUser() || sortByGuild() || sortByChannel();
      },
    ).take(10);

  Logger.log('BetterQuickSwitcher', sorted);
  result.results = sorted;
});

export default createPatcherAfterCallback<QuickSwitcherStore['getProps']>(({ result, ...props }) => {
  const { query } = result;

  const log = (...data: any[]) => Logger.log('[CustomizedQuickSwitcher]', ...data);

  let { channels, guilds, users } = {
    guilds: SortedGuildStore.guildIds.map(GuildStore.getGuild),
    users: RelationshipStore.getFriendIDs().map(UserStore.getUser),
    channels: SortedGuildStore.guildIds
      .flatMap(ChannelStore.getChannelIds)
      .map(ChannelStore.getChannel)
      .filter(channel => [ChannelTypes.GuildVoice, ChannelTypes.GuildText].includes(channel.type))
  };

  log('Initial data', { channels, guilds, users });

  guilds = guilds.filter(guild => guild.name.toLowerCase().includes(query.toLowerCase()));
  users = new SortableArray(...users
    .filter(user => [user.globalName, user.username]
      .filter(Boolean)
      .some(name => name.toLowerCase().includes(query.toLowerCase()))
    )
  ).orderBy(
    (a, b) => (
      RelationshipStore.isFriend(a.id) && !RelationshipStore.isFriend(b.id)
        ? -1
        : RelationshipStore.isFriend(b.id) && !RelationshipStore.isFriend(a.id)
          ? 1
          : 0
    ),
    (a, b) => a.globalName?.localeCompare(b.globalName) || a.username.localeCompare(b.username),
  ).take(10);

  const allChannels = channels
    .filter(channel => channel.name.toLowerCase().includes(query.toLowerCase()));
  channels = new SortableArray(...allChannels)
    .orderBy(
      (a, b) => a.name.localeCompare(b.name),
      (a, b) => guilds.indexOf(GuildStore.getGuild(a.guild_id)) - guilds.indexOf(GuildStore.getGuild(b.guild_id)),
    ).take(10);

  log('Filtered data', { channels, guilds, users });

  const isUserRequest = query.startsWith('@');
  const isTextChannelRequest = query.startsWith('#');
  const isVoiceChannelRequest = query.startsWith('!');
  const isGuildRequest = query.startsWith('*');

  // if (!isUserRequest && !isTextChannelRequest && !isVoiceChannelRequest && !isGuildRequest) return;
  if (isUserRequest) {
    result.results = users.map((user, index) => ({
      type: 'USER',
      record: user,
      comparator: user.username,
      score: index + 1000
    } as QuickSwitcherResult));
    return;
  }
  else if (isTextChannelRequest) {
    result.results = Object.values(channels).filter(channel => channel.type === ChannelTypes.GuildText).map((channel, index) => ({
      type: 'TEXT_CHANNEL',
      record: channel,
      comparator: channel.name,
      score: index + 1000
    } as QuickSwitcherResult));
    return;
  }
  else if (isVoiceChannelRequest) {
    result.results = Object.values(channels).filter(channel => channel.type === ChannelTypes.GuildVoice).map((channel, index) => ({
      type: 'VOICE_CHANNEL',
      record: channel,
      comparator: channel.name,
      score: index + 1000
    } as QuickSwitcherResult));
    return;
  }
  else if (isGuildRequest) {
    result.results = Object.values(guilds).map((guild, index) => ({
      type: 'GUILD',
      record: guild,
      comparator: guild.name,
      score: index + 1000
    } as QuickSwitcherResult));
    return;
  }

  const combined = [
    ...users.map<QuickSwitcherResult>((user, index) => ({
      type: 'USER',
      record: user,
      comparator: user.username,
      score: index + 1000,
      index
    })),
    ...channels.map<QuickSwitcherResult>((channel, index) => ({
      type: channel.type === ChannelTypes.GuildText ? 'TEXT_CHANNEL' : 'VOICE_CHANNEL',
      record: channel,
      comparator: channel.name,
      score: index + 1000,
      sortable: channel.name,
      guildName: GuildStore.getGuild(channel.guild_id).name,
      index
    })),
    ...guilds.map<QuickSwitcherResult>((guild, index) => ({
      type: 'GUILD',
      record: guild,
      comparator: guild.name,
      score: index + 1000,
      sortable: guild.name,
      index
    }))
  ].sort((a, b) => a.score - b.score);

  Logger.log('CustomizedQuickSwitcher', {
    query,
    users,
    channels,
    guilds,
    combined,
  });

  result.results = combined;
});