import { Channel } from "../../../discord"
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
    }
}
export default LibraryModules;