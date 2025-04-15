import { Finder } from '@injections';
import { Snowflake, User } from "@discord/types";

export type RelationshipActions = {
  acceptFriendRequest(e: RelationshipThing): void;
  addRelationship(e: RelationshipThing, callback?: () => void, n?: any): void;
  cancelFriendRequest(userId: Snowflake, context: 'friends'): void;
  clearPendingRelationships(): Promise<void>;
  clearPendingSpam(): Promise<void>;
  confirmClearPEndingRelationships(e: any): void;
  fetchRelationships(): Promise<void>;
  removeFriend(userId: Snowflake, context: 'friends'): void;
  removeRelationship(userId: Snowflake, context: 'friends', callback?: () => void): Promise<void>;
  sendRequest(user: User): void;
  unblockUser(userId: Snowflake, context: 'friends'): void;
  updateRelatipnship(e: string, nickname: string): Promise<void>;
}

type RelationshipThing = {
  userId: Snowflake;
  context: any;
  type: number;
  friendToken: any;
  fromFriendSuggestion: any;
  captchaPayload: any;
}

export const RelationshipActions = Finder.bySourceStrings<RelationshipActions>("cancelFriendRequest", "addRelationship", "removeRelationship");