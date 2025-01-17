import { Snowflake, Channel } from "@discord/types";

export function hasPermission(channel: Channel, userId: Snowflake, accessPermissions: bigint) {
  if (!accessPermissions) return false;
  const userPermissions = channel.permissionOverwrites[userId]?.allow ?? 0n;
  return BigInt(userPermissions & accessPermissions) === accessPermissions;
};