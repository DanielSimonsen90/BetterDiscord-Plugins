import { DiscordModules } from './Modules';
import { Libraries } from './Libraries';
import { CreatePluginUtils } from './PluginUtils';
import { Utils } from './Utils';

import { DanhoPlugin } from 'danho-discordium';
import Settings from '../Settings';

export default class DanhoLibrary extends DanhoPlugin<Settings> {
    public Modules = DiscordModules
    public Libraries = Libraries
    public PluginUtils = CreatePluginUtils(this.logger);
    public Utils = Utils
    public GetPlugin<Settings>() {
        return DanhoPlugin;
    }

    /*
    TODO: Update Library:
    + Components = * from '@components';
    --- Modules from BDFDB & ZLibrary.DiscordModules
    + Users = UserUtils, UserStore, PresenceStore, RelationshipStore, SettingsStore, ChannelStore, PrivateChannelUtils, UserActivityStore, UserNoteStore, UserNoteActions, UserInfoStore, UserStatusStore, UserTypingStore, MentionStore, NitroUtils?
    + Guilds = GuildUtils, GuildStore, MemberStore, FolderStore, ChannelStore/GuildChannelStore, GuildEmojiStore, SelectedGuildStore, VoiceInfo
    + Media = MediaComponentUtils, IconUtils, EmojiStateUtils, GuildEmojiStore, MediaDeviceInfo, MediaEngineInfo, MediaInfo
    + Channels = ChannelUtils, UnreadChannelutils, ChannelActions, ChannelSettingsWindow, ChannelStore, SelectedChannelStore, LastChannelStore, PrivateChannelActions
    + Messages = MessageParser, MessageActions, MessageQueue, MessageStore, ReactionStore
    + Strings = Strings, StringUtils, StringFormats, LanguageStore

    + Stores = All store modules
    */
}