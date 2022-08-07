import { Channel, Guild, GuildMember, User } from "@discord"
const { React, ReactDOM } = window.BDD.Modules;

type DiscordModules = {
    [key: string]: any

    ChannelStore: {
        getChannel(channelId: string): Channel,
        getAllThreadsForParent(parentId: string): Channel[],
        getDMFromUserId(userId: string): Channel,
        getGuildChannelsVersion(guildId: string): number,
        getInitialOverlayState(): Record<string, Guild>,
        getMutableGuildAndPrivateChannels(): {
            [guildId: string]: Channel[],
        }
        getMutableGuildChannels(): {
            [guildId: string]: Channel[],
        }
        getMutableGuildChannelsByGuild(): {
            [guildId: string]: {
                [channelId: string]: Channel,
            },
        }
        getMutablePrivateChannels(): {
            [channelId: string]: Channel,
        }
        getPrivateChannelsVersion(): number,
        getSortedPrivateChannels(): Channel[],

    },
    GuildStore: {
        getGuild(idOrName: string): Guild
    },
    GuildMemberStore: {
        getMember(guildIdOrName: string, userIdOrName: string): GuildMember,
        getMembers(guildIdOrName: string): Array<GuildMember>,
    },
    React: typeof React,
    ReactDOM: typeof ReactDOM,
    SelectedChannelStore: {
        getChannelId(): string,
        getLastChannelFollowingDestionation(): string,
        getLastSelectedChannelid(): string,
        getMostRecentSelectedtextChannelId(): string,
        getVoiceChannelId(): string,
    },
    SelectedGuildStore: {
        getGuildId(): string
    }
    UserStore: {
        findByTag(username: string, tag: string): User,
        getCurrentUser(): User,
        getUser(idOrName: string): User,
        getUsers(): Record<string, User>
    },
}
export default DiscordModules;