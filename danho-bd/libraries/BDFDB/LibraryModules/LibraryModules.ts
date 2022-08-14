import { Channel, ChannelStore, User, UserStore } from "@discord"
import LanguageStore from "./LanguageStore"
import NitroUtils from "./NitroUtils";
import FolderStore from './FolderStore';

export type LibraryModules = {
    ChannelStore: ChannelStore,
    CurrentVoiceUtils: {
        getChannelId(): string
    }
    FolderStore: FolderStore
    LanguageStore: LanguageStore,
    LastChannelStore: {
        getChannelId(guildId: string): string;
    },
    NitroUtils: NitroUtils
    UserStore: UserStore
}
export default LibraryModules;