import { DiscordModules } from './Modules';
import { Utils, UserUtils, GuildUtils } from './Utils';

import * as Components from '@danho-lib/React/components';
import * as Stores from '@danho-lib/Stores';
import * as Actions from '@danho-lib/Actions';
import { createPlugin, Plugin } from '@dium/index';

type Settings = {}

const LibraryPlugin = new class DanhoLibrary implements Plugin<Settings> {
    public Modules = DiscordModules
    
    public Utils = Utils

    public Users = UserUtils;
    public Guilds = GuildUtils;

    public Stores = Stores;
    public Actions = Actions;
    public Components = Components;

    start() {}
    
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
};

export default createPlugin(LibraryPlugin);