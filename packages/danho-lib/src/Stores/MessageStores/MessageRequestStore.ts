import type { Snowflake, Message } from "@discord/types";
import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface MessageRequestStore extends Store {
  getMessageRequestChannelIds(): Snowflake[];
  getMessageRequestsCount(): number;
  getUserCountryCode(): {
    name: string; // Denmark
    code: string; // +45
    alpha2: string; // DK
  }
  isAcceptedOptimistic(e: any): boolean;
  isReady(): boolean;
  loadCache(): void;
}

export const MessageRequestStore: MessageRequestStore = Finder.byName("MessageRequestStore");
export default MessageRequestStore;