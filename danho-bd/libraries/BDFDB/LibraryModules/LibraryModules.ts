import { Channel, User } from "@discord"
import LanguageStore from "./LanguageStore"

type LibraryModules = {
    ChannelStore: {
        getChannel(channelId: string): Channel,
    },
    CurrentVoiceUtils: {
        getChannelId(): string
    }
    LanguageStore: LanguageStore,
    LastChannelStore: {
        getChannelId(guildId: string): string;
    },
    UserStore: {
        getUser(userId: string): User,
        findByTag(username: string, discriminator: string): User,
    }
}
export default LibraryModules;