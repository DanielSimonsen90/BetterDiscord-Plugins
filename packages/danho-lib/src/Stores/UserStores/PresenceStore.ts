import { Snowflake, Activity, ActivityTypes, TimestampString, UserStatus } from "@discord/types";
import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface PresenceStore extends Store {
  findActivity(userId: Snowflake, callback: (activity: Activity) => boolean, n?: UntypedT): ActivityTypes[number] | undefined;
  getActivities(userId: Snowflake, t?: UntypedT): ActivityTypes[number][];
  getActivityMetadata(e: any): any;
  getAllApplicationActivities(activityId: Snowflake): Array<{ userId: Snowflake, activity: Activity }>;
  getApplicationActivity(activityId: Snowflake, applicationId: Snowflake, n?: any): ReturnType<typeof PresenceStore["findActivity"]>;
  getPrimaryActivity(userId: Snowflake, t?: any): ActivityTypes[number];
  getState(): PresenceStoreState;
  getStatus(userId: Snowflake, t?: any, n?: UserStatus): UserStatus;
  getUserIds(): Snowflake[];
  isMobileOnline(user: Snowflake): boolean;
  setCurrentUserOnConnectionOpen(e: any, t: any): void;
}

export const PresenceStore: PresenceStore = /* @__PURE__ */ Finder.byName("PresenceStore");
export default PresenceStore;

export type ClientStatus = Partial<Record<"desktop" | "mobile" | "web", UserStatus>>;
export type Presence = {
  activities: Array<Activity>;
  clientStatus: ClientStatus;
  status: UserStatus;
  timestamp: TimestampString;
};

export interface PresenceStoreState {
  statuses: Record<Snowflake, UserStatus>;
  clientStatuses: Record<Snowflake, ClientStatus>;
  activities: Record<Snowflake, Activity[]>;
  activityMetadata: Record<any, any>;

  presenceForguilds: {
    [userId: Snowflake]: {
      [guildId: Snowflake]: Presence;
    };
  };
}

type UntypedT = any;