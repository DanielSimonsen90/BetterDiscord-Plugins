// import { Guild } from "@dium/modules";

export * from './emoji';
export * from './features';
export * from './folder';
export * from './member';
export * from './permissionOverwrite';
export * from './permissions';
export * from './role';

import { Features } from "./features";
import type { Snowflake } from "../base";
import { Role } from "./role";

export interface Guild {
  id: Snowflake;
  name: string;
  icon: string;
  ownerId: Snowflake;
  description?: string;

  banner?: any;
  splash?: any;

  maxMembers: number;
  maxVideoChannelUsers: number;
  defaultMessageNotifications: number;
  region: string;
  preferredLocale: string;

  verificationLevel: number;
  explicitContentFilter: number;
  mfaLevel: number;
  nsfwLevel: number;
  premiumTier: number;
  premiumSubscriberCount: number;
  premiumProgressBarEnabled: boolean;

  features: Set<Features>;

  joinedAt: Date;

  roles: Record<Snowflake, Role>;

  rulesChannelId?: Snowflake;
  publicUpdatesChannelId?: Snowflake;

  afkChannelId?: Snowflake;
  afkTimeout?: number;

  systemChannelId?: Snowflake;
  systemChannelFlags?: number;

  get acronym(): string;

  getApplicationId(): any;
  getIconSource(arg1: any, arg2: any): any;
  getIconURL(arg1: any, arg2: any): any;
  getMaxEmojiSlot(): number;
  getRole(roleId: Snowflake): Role;

  hasFeature(feature: Features): boolean;
  isLurker(): boolean;
  isNew(memberId: Snowflake): boolean;
  isOwner(memberId: Snowflake): boolean;
  isOwnerWithRequiredMfaLevel(memberId: Snowflake): boolean;

  toString(): string;
}