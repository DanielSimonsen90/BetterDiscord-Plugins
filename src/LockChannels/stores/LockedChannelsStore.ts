import { Snowflake } from "@discord/types";
import { ChannelStore } from "@discord/stores";

import { ActionsEmitter } from "@actions";
import { DanhoStores, DiumStore } from "@stores";
import { GuildUtils } from "@utils";

import { Settings } from "../settings/Settings";

export type LockedChannelState = Settings & {
  password: string;
  once?: Omit<LockedChannelState, 'once'>;
};

export type EditLockedChannelState = Omit<LockedChannelState, 'locked' | 'once'>;

type LockedChannelsState = {
  channels: {
    [channelId: Snowflake]: LockedChannelState | undefined;
  };
  timeouts: {
    [channelId: Snowflake]: NodeJS.Timeout | undefined;
  };
};

export type LockedChannelInfo = {
  stored: typeof LockedChannelsStore.current.channels[Snowflake];
  timeout: typeof LockedChannelsStore.current.timeouts[Snowflake];
  channel: ReturnType<typeof ChannelStore.getChannel>;
};

const LockedChannelsStore = new class LockedChannelsStore extends DiumStore<LockedChannelsState> {
  constructor() {
    super({
      channels: {},
      timeouts: {}
    }, 'LockedChannelsStore');
  }

  public getChannelState(channelId: Snowflake): LockedChannelState | undefined {
    return this.current.channels[channelId];
  }
  public getChannelTimeout(channelId: Snowflake): NodeJS.Timeout | undefined {
    return this.current.timeouts[channelId];
  }

  public isLocked(channelId: Snowflake): boolean {
    const stored = this.getChannelState(channelId);
    if (!stored) return false;

    const timeout = this.getChannelTimeout(channelId);
    // Determine "locked" by initialLockState and timeout state
    // if initialLockState for this channel is true (meaning it should be locked by default), check if there is no timeout (meaning it is unlocked until undefined)
    // if initialLockState is false (meaning it should be unlocked by default), check if there is a timeout (meaning it is locked until the timeout expires)
    return stored.initialLockState ? !timeout : !!timeout;
  }
  public isUnlocked(channelId: Snowflake): boolean {
    return !this.isLocked(channelId);
  }
  public hasLock(channelId: Snowflake): boolean {
    return !!this.getChannelState(channelId);
  }

  public lock(channelId: Snowflake) {
    this.updateLockTimeout(channelId, undefined);
    ActionsEmitter.emit('LOCK_CHANNEL', { channelId });

    const stored = this.getChannelState(channelId);

    // If initialLockState is false (meaning it should be unlocked by default), set the timeout to unlock again
    if (stored && !stored.initialLockState) {
      this.startLockTimeout(channelId, stored.unlockedForMinutes);
    }
  }
  public login(channelId: Snowflake, password: string) {
    const stored = this.getChannelState(channelId);

    let success = stored
      ? stored.once
        ? stored.once.password === password
        : stored.password === password
      : true;

    if (success) {
      this.unlock(channelId);
      if (stored.once) this.updateLockState(channelId, { once: undefined });
    }
    return success;
  }

  public setLockState(channelId: Snowflake, state: LockedChannelState, once = false) {
    return this.updateLockState(channelId, state, false, once);
  }
  public deleteLock(channelId: Snowflake) {
    this.unlock(channelId);
    this.updateLockState(channelId, undefined, true);
    this.updateLockTimeout(channelId, undefined);
  }

  private unlock(channelId: Snowflake) {
    const stored = this.getChannelState(channelId);

    if (stored.initialLockState) {
      const timeout = this.getChannelTimeout(channelId);
      if (timeout) clearTimeout(timeout);
      this.startLockTimeout(channelId, stored.unlockedForMinutes);
    }
  }
  private updateLockState(channelId: Snowflake, state: Partial<LockedChannelState>, replace?: boolean, once?: boolean) {
    const stored = (replace ? undefined : this.getChannelState(channelId)) ?? {} as LockedChannelState;
    const update = { ...stored, ...state } as LockedChannelState;

    this.update(current => {
      if (!once && replace && !state) {
        const { [channelId]: _, ...channels } = current.channels;
        return { channels };
      }

      return {
        channels: {
          ...current.channels,
          [channelId]: once ? { ...stored, once: update } : update
        }
      };
    })

    return update;
  }
  private updateLockTimeout(channelId: Snowflake, timeout: NodeJS.Timeout) {
    this.update(current => {
      if (current.timeouts[channelId]) clearTimeout(current.timeouts[channelId]);

      if (timeout) return {
        timeouts: {
          ...current.timeouts,
          [channelId]: timeout
        }
      };

      const timeouts = { ...current.timeouts };
      delete timeouts[channelId];
      return { timeouts };
    });
  }
  private startLockTimeout(channelId: Snowflake, unlockedForMinutes: number) {
    this.updateLockTimeout(channelId, setTimeout(() => this.updateLockTimeout(channelId, undefined), unlockedForMinutes * 60 * 1000));
  }

  public useSettings() {
    const lockedChannels = this.useSelector(state => Object.keys(state.channels).reduce((acc, lockedChannelId) => {
      const stored = state.channels[lockedChannelId];
      const timeout = state.timeouts[lockedChannelId];
      const channel = ChannelStore.getChannel(lockedChannelId);

      return {
        ...acc,
        [lockedChannelId]: {
          stored,
          timeout,
          channel
        }
      };
    }, {} as Record<string, LockedChannelInfo>));

    const guildsSet = Object.values(lockedChannels).reduce((acc, { channel }) => {
      if (channel.guild_id) acc.add(channel.guild_id);
      return acc;
    }, new Set<Snowflake>());
    const sortedGuilds = Object.entries(GuildUtils.getSortedGuilds())
      .filter(([guildId]) => guildsSet.has(guildId))
      .map(([guildId, guild]) => ({
        guildId,
        guildName: guild.name,
        channels: Object
          .values(lockedChannels)
          .filter(({ channel }) => channel.guild_id === guildId)
      }));

    return sortedGuilds;
  }
};

DanhoStores.register(LockedChannelsStore);

export { LockedChannelsStore };
export default LockedChannelsStore;