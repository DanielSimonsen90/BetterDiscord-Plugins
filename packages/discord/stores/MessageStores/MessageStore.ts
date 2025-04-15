import type { Snowflake, Message } from "@discord/types";
import { Finder } from "@injections";
import { Store } from "@dium/modules/flux";

type MessagesList = Array<Message> & {
  // too much to type
}

export interface MessageStore extends Store {
  getMessages(channelId: Snowflake): MessagesList;
  getMessage(channelId: Snowflake, messageId: Snowflake): Message;
  getLastEditableMessage(channelId: Snowflake): Message;
  getLastCommandMessage(channelId: Snowflake): Message;
  getLastMessage(channelId: Snowflake): Message;
  getLastNonCurrentUserMessage(channelId: Snowflake): Message;
  jumpedMessageId(channelId: Snowflake): Snowflake;
  focusedMessageId(channelId: Snowflake): Snowflake;
  hasPresent(channelId: Snowflake): boolean;
  isReady(channelId: Snowflake): boolean;
  whenReady(channelId: Snowflake, t: () => void): void;
  isLoadingMessages(channelId: Snowflake): boolean;
  hasCurrentUserSentMessages(channelId: Snowflake): boolean;
  hasCurrentUserSentMessageSinceAppStart(): boolean;
}

export const MessageStore = Finder.byName<MessageStore>("MessageStore");
export default MessageStore;