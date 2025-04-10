import { Finder } from "@dium/api";
import { Snowflake } from "@dium/modules";
import { Store } from "@dium/modules/flux";

export type MemberSafetyStore = Store & {
  getCurrentMemberSearchResultsByGuildId(guildId: Snowflake): unknown;
  getElasticSearchPaginationByGuildId(guildId: Snowflake): unknown;
  getEnhancedMember(guildId: Snowflake, memberId: Snowflake): unknown;
  getEstimatedMemberSearchCountByGuildId(guildId: Snowflake): number;
  getKnownMemberSeachCountByGuildId(guildId: Snowflake): number;
  getLastCursorTimestamp(guildId: Snowflake): number;
  getLastRefreshTimestamp(guildId: Snowflake): number;
  getMembersByGuildId(guildId: Snowflake, t: any): unknown;
  getMembersCountByGuildId(guildId: Snowflake, t: any): number;
  getNewMemberTimestamp(memberId: Snowflake): number;
  getPagedMembersByGuildId(guildId: Snowflake): unknown;
  getPaginationStateByGuildId(guildId: Snowflake): unknown;
  getSearchStateByGuildId(guildId: Snowflake): unknown;
  hasDefaultSearchStateByGuildId(guildId: Snowflake): boolean;
}
export const MemberSafetyStore: MemberSafetyStore = Finder.byName("MemberSafetyStore");
export default MemberSafetyStore;