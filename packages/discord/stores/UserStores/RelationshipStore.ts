import { Snowflake } from "@discord/types";
import { Store } from "@dium/modules/flux";
import { Finder } from "@injections";

export const enum RelationshipTypes {
    NONE = 0,
    FRIEND = 1,
    BLOCKED = 2,
    PENDING_INCOMING = 3,
    PENDING_OUTGOING = 4,
    IMPLICIT = 5
}

export interface RelationshipStore extends Store {
    getFriendIDs(): Snowflake[];
    getNickname(arg: any): any;
    getPendingCount(): number;
    getRelationshipCount(): number;
    getRelationshipType(user: Snowflake): RelationshipTypes;
    getRelationships(): Record<Snowflake, RelationshipTypes>;
    isBlocked(user: Snowflake): boolean;
    isFriend(user: Snowflake): boolean;
    __getLocalVars();
}

export const RelationshipStore = Finder.byName<RelationshipStore>("RelationshipStore");