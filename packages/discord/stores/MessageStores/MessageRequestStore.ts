import type { Snowflake } from "@discord/types";
import { Finder } from "@injections";
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

export const MessageRequestStore = Finder.byName<MessageRequestStore>("MessageRequestStore");
export default MessageRequestStore;