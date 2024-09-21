import { Snowflake } from "@discord/types/base";
import { ActivityTypes } from "@discord/types/user/activity";
import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface PresenceStoreState {
  statuses: Record<Snowflake, StatusTypes>;
  clientStatuses: Record<Snowflake, { desktop?: StatusTypes; mobile?: StatusTypes; }>;
  activities: Record<Snowflake, any[]>;
  activityMetadata: Record<any, any>;

  /** Maps users to guilds to presences. */
  presencesForGuilds: Record<Snowflake, Record<Snowflake, any>>;
}

export const enum StatusTypes {
  DND = "dnd",
  IDLE = "idle",
  INVISIBLE = "invisible",
  OFFLINE = "offline",
  ONLINE = "online",
  STREAMING = "streaming",
  UNKNOWN = "unknown"
}

export interface PresenceStore extends Store {
  findActivity(e: any, t: any, n: any): ActivityTypes[number] | undefined;
  getActivities(e: any, t?: any): ActivityTypes[number][];
  getActivityMetadata(e: any);
  getAllApplicationActivities(e: any);
  getApplicationActivity(e: any, t: any, n: any);
  getPrimaryActivity(userId: Snowflake, t?: any): ActivityTypes[number];
  getState(): PresenceStoreState;
  getStatus(user: Snowflake, t?: any, n?: any): StatusTypes;
  getUserIds(): Snowflake[];
  isMobileOnline(user: Snowflake): boolean;
  setCurrentUserOnConnectionOpen(e: any, t: any);
  __getLocalVars();
}

export const PresenceStore: PresenceStore = /* @__PURE__ */ Finder.byName("PresenceStore");