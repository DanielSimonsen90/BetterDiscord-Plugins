import { Channel, Guild, User } from "../../discord"
import ReactModule, { ReactDOMModule } from "../React"

type DiscordModules = {
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
        getGuild(idOrName: string): {
            discordObject: Guild
        }
    },
    React: ReactModule,
    ReactDOM: ReactDOMModule,
    SelectedChannelStore: {
        getChannelId(): string,
        getLastChannelFollowingDestionation(): string,
        getLastSelectedChannelid(): string,
        getMostRecentSelectedtextChannelId(): string,
        getVoiceChannelId(): string,
    }
    UserStore: {
        getUser(idOrName: string): {
            discordObject: User
        }
    },
}
export default DiscordModules;