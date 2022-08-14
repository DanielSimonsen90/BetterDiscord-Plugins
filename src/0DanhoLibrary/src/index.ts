import { DiscordModules } from './Modules';
import { Libraries } from './Libraries';
import { CreatePluginUtils } from './PluginUtils';
import { Utils, UserUtils, GuildUtils } from './Utils';
// import { Utils } from './Utils';

import { DanhoPlugin } from 'danho-discordium';
import Settings from '../Settings';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Actions from '@actions';

export default class DanhoLibrary extends DanhoPlugin<Settings> {
    public Modules = DiscordModules
    public Libraries = Libraries
    public PluginUtils = CreatePluginUtils(this.logger);
    
    public Utils = Utils

    public Users = UserUtils;
    public Guilds = GuildUtils;

    public Stores = Stores;
    public Actions = Actions;
    public Components = Components;

    public GetPlugin<Settings>() {
        return DanhoPlugin;
    }

    
    /*
    TODO: Update Library:
    --- Modules from BDFDB & ZLibrary.DiscordModules
    + Users = UserUtils, UserStore, PresenceStore, RelationshipStore, UserActivityStore, UserNoteStore, UserNoteActions, UserTypingStore, MentionStore, NitroUtils?
    + Guilds = GuildUtils, GuildStore, MemberStore, FolderStore, ChannelStore/GuildChannelStore, GuildEmojiStore, SelectedGuildStore, VoiceInfo
    + Media = MediaComponentUtils, IconUtils, EmojiStateUtils, GuildEmojiStore, MediaDeviceInfo, MediaEngineInfo, MediaInfo
    + Channels = ChannelUtils, UnreadChannelutils, ChannelActions, ChannelSettingsWindow, ChannelStore, SelectedChannelStore, LastChannelStore, PrivateChannelActions
    + Messages = MessageParser, MessageActions, MessageQueue, MessageStore, ReactionStore
    + Strings = Strings, StringUtils, StringFormats, LanguageStore
    + Client = SettingsStore

    + Stores = All store modules
    */
}