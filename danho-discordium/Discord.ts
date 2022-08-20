export * from 'danho-bd/discord';
export * from '@discordium/modules';

import { Finder } from '@discordium/api';
import { Channel, User, Snowflake } from '@discordium/modules';
import { Timestamp, Message } from 'danho-bd/discord';

export const ChannelClass: { new(id: Snowflake): Channel; } = Finder.byProtos("isOwner", "isCategory");
export const UserClass: { new(id: Snowflake): User } = Finder.byProtos("tag");
export const TimestampClass: { new(timestamp: number): Timestamp } = Finder.byProtos("toDate", "month");
export const MessageClass: { new(options: {
    id: Snowflake;
    channel_id: Snowflake
}): Message } = Finder.byProtos("getReaction", "isSystemDM");