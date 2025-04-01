import { 
  ChannelListStore, ChannelStore, SelectedChannelStore,
  DanhoStores, DiumStore, 
  GuildChannelStore, ReadStateStore, VoiceStore 
} from "@stores";
import { Snowflake, ChannelTypes } from "@discord/types";
import { ActionsEmitter, createActionCallback } from "@actions";
import { GuildUtils } from "@danho-lib/Utils";
import { Logger } from "@danho-lib/dium/api/logger";

import { Settings } from "src/0DanhoLibrary/Settings";

type ChannelState = {
  hidden: boolean;
  hadActivity?: boolean;
  stayVisibleTimeout?: NodeJS.Timeout;
}
type GuildState = {
  showHiddenChannels: boolean;
}

type HiddenChannelState = {
  channels: {
    [channelId: Snowflake]: ChannelState;
  },
  guilds: {
    [guildId: Snowflake]: GuildState
  };
};

const DEFAULT_STATE: HiddenChannelState = {
  channels: {},
  guilds: {},
};

const HiddenChannelStore = new class HiddenChannelStore extends DiumStore<HiddenChannelState> {
  constructor() {
    super(DEFAULT_STATE, 'HiddenChannelStore', () => {
      ActionsEmitter.on('CHANNEL_SELECT', this.onChannelSelect.bind(this));
    });
  }

  // #region State Management
  protected updateChannelState(channelId: Snowflake, state: Partial<ChannelState> | undefined): void {
    const channelState: ChannelState = this.current.channels[channelId] || {} as ChannelState;
    const updatedState: ChannelState = {
      ...channelState,
      ...state,
    };
    this.update(current => ({ 
      ...current,
      channels: {
        ...current.channels, 
        [channelId]: state ? updatedState : state as undefined 
      } 
    }));
  }
  protected updateGuildState(guildId: Snowflake, state: Partial<GuildState>): void {
    const guildState: GuildState = this.current.guilds[guildId] || {} as GuildState;
    const updatedState: GuildState = {
      ...guildState,
      ...state,
    };
    this.update(current => ({ 
      ...current,
      guilds: {
        ...current.guilds, 
        [guildId]: state ? updatedState : state as undefined 
      } 
    }));
  }
  // #endregion

  // #region Event Handlers
  protected onChannelSelect = createActionCallback('CHANNEL_SELECT', ({ channelId }) => {
    const previousChannelId = SelectedChannelStore.getLastSelectedChannelId();
    const isHidden = this.isHidden(previousChannelId);
    if (!isHidden) return;

    if (this.hasActiveTimer(previousChannelId)) {
      this.restartVisibilityTimer(previousChannelId);
    }
    if (this.hasActiveTimer(channelId)) {
      this.clearVisibilityTimer(channelId);
    }
  })
  // #endregion

  // #region Hide/Show toggles
  public isHidden(channelId: Snowflake): boolean {
    return this.current.channels[channelId]?.hidden || false;
  }

  public hideChannel(channelId: Snowflake): void {
    const hiddenChannel = this.current.channels[channelId];
    if (hiddenChannel?.stayVisibleTimeout) clearTimeout(hiddenChannel.stayVisibleTimeout);

    this.updateChannelState(channelId, {
      hidden: true,
    });
  }
  public showChannel(channelId: Snowflake): void {
    this.updateChannelState(channelId, undefined);
  }

  public showsHiddenChannels(guildId: Snowflake): boolean {
    return this.current.guilds[guildId]?.showHiddenChannels;
  }
  public showHiddenChannels(guildId: Snowflake): void {
    this.updateGuildState(guildId, {
      showHiddenChannels: true,
    });
  }
  public hideHiddenChannels(guildId: Snowflake): void {
    this.updateGuildState(guildId, {
      showHiddenChannels: false,
    });
  }
  // #endregion

  // #region Should Render Channel
  public shouldRenderChannel(channelId: Snowflake): boolean {
    if (this.showsHiddenChannels(GuildUtils.currentId)) return true;
    if (this.isCategoryChannel(channelId)) return this.shouldRenderCategory(channelId);
    
    const { guildChannels } = ChannelListStore.getGuild(GuildUtils.currentId) ?? {};
    const channel = ChannelStore.getChannel(channelId);

    const isHidden = this.isHidden(channelId);
    const isUnread = ReadStateStore.hasUnread(channelId);
    const hasVoiceActivity = !!VoiceStore.getVoiceStateForChannel(channelId);

    const optInEnabled = guildChannels?.optInEnabled ?? false;
    const isOptedIn = optInEnabled 
      && (
        (guildChannels?.optedInChannels.has(channelId) ?? false) 
        || (guildChannels?.optedInChannels.has(channel.parent_id) ?? false)
      );
    const isMutedAndHidden = (
      guildChannels.mutedChannelIds.has(channelId)
      && guildChannels.hideMutedChannels
    );
    // const isResourceAndHidden = (
    //   guildChannels.resourceChannelIds.has(channel.id)
    //   && guildChannels.hideResourceChannels
    // );

    this.stayVisisbleTimeout(channelId, isUnread);

    const shouldRender = isHidden 
      ? isUnread || hasVoiceActivity 
      : optInEnabled 
        ? isOptedIn && !isMutedAndHidden 
        : !isMutedAndHidden;
    // if (shouldRender) Logger.log(`Channel ${ChannelStore.getChannel(channelId)?.name} renders`, {
    //   isHidden: isHidden ? isUnread || hasVoiceActivity : false,
    //   isShown: optInEnabled ? isOptedIn && !isMutedAndHidden : !isMutedAndHidden,
    //   props: {
    //     isHidden,
    //     isUnread,
    //     hasVoiceActivity,
    //     isOptedIn,
    //     isMutedAndHidden,
    //   }
    // });
    // else Logger.log(`Channel ${ChannelStore.getChannel(channelId)?.name} does not render`);

    return shouldRender;
  }

  protected isCategoryChannel(channelId: Snowflake) {
    return ChannelStore.getChannel(channelId)?.type === ChannelTypes.GuildCategory;
  }
  protected shouldRenderCategory(channelId: Snowflake): boolean {
    const categoryChannels = ChannelListStore.getGuild(GuildUtils.currentId)?.guildChannels.categories[channelId]?.channels ?? {};

    for (const channelId of Object.keys(categoryChannels)) {
      const shouldRender = this.shouldRenderChannel(channelId);
      if (shouldRender) {
        // Logger.log(`Category ${category.name} renders due to ${channel.name}`, { 
        //   category, 
        //   channel: this.current[channelId],
        //   channels: ChannelListStore.getGuild(GuildUtils.currentId)?.guildChannels
        // });
        return true;
      }
    }

    console.log('Category does not render');
    return false;
  }
  // #endregion

  // #region Get Hidden Channels
  public getAllHiddenChannels(): HiddenChannelState['channels'] {
    return Object.keys(this.current.channels).reduce((acc, channelId) => {
      const channel = ChannelStore.getChannel(channelId);
      if (!channel) return acc;

      acc[channelId] = channel;
      return acc;
    }, {});
  }
  public getHiddenChannels(guildId: Snowflake): HiddenChannelState {
    const channels = GuildChannelStore
      .getChannels(guildId)
      .SELECTABLE
      .map(stored => stored.channel);

    return {
      channels: channels
        .filter(channel => this.isHidden(channel.id))
        .reduce((acc, channel) => {
          acc[channel.id] = channel;
          return acc;
        }, {}),
      guilds: {
        [guildId]: this.current.guilds[guildId]
      }
    };
  }
  public getHiddenChannelsArray(guildId: Snowflake) {
    return Object
      .keys(this.getHiddenChannels(guildId).channels)
      .map(channelId => ChannelStore.getChannel(channelId)?.name)
      .sort();
  }
  // #endregion

  // #region Visibility Timer
  public restartVisibilityTimer(channelId: Snowflake): void {
    const hiddenChannel = this.current.channels[channelId];
    if (!hiddenChannel) return;

    if (hiddenChannel.stayVisibleTimeout) clearTimeout(hiddenChannel.stayVisibleTimeout);
    hiddenChannel.stayVisibleTimeout = setTimeout(() => {
      // Logger.log('Hiding channel again', channelId);
      this.update({
        [channelId]: {
          hidden: true,
          hadActivity: false,
        }
      });
    }, Settings.current.keepChannelVisibleAfterActivityTimeoutMin * 60 * 1000);
  }
  public hasActiveTimer(channelId: Snowflake): boolean {
    const hiddenChannel = this.current.channels[channelId];
    return !!(hiddenChannel?.stayVisibleTimeout || hiddenChannel?.hadActivity);
  }
  public clearVisibilityTimer(channelId: Snowflake): void {
    const hiddenChannel = this.current[channelId];
    if (!hiddenChannel) return;
    if (hiddenChannel.stayVisibleTimeout) clearTimeout(hiddenChannel.stayVisibleTimeout);

    this.updateChannelState(channelId, {
      stayVisibleTimeout: undefined,
      hadActivity: false,
    });
  }

  protected stayVisisbleTimeout(channelId: Snowflake, isUnread: boolean): void {
    const hiddenChannel = this.current[channelId];
    if (!hiddenChannel) return;

    const { hidden, hadActivity, stayVisibleTimeout } = hiddenChannel;
    if (isUnread && hidden) {
      clearTimeout(stayVisibleTimeout);
      this.updateChannelState(channelId, {
        hadActivity: true,
        hidden: false,
      });
    } else if (!isUnread && hadActivity) {
      this.restartVisibilityTimer(channelId);
    }
  }
  // #endregion
};

DanhoStores.register(HiddenChannelStore);

export default HiddenChannelStore;