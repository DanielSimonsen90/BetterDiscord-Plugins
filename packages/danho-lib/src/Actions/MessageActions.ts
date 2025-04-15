import { Snowflake, Channel, Message, Attachment, User } from "@discord/types";
import Finder from "../Injections/finder";

type MessageActions = {
  clearChannel(channelId: Snowflake): void;
  crosspostMessage(channelId: Snowflake, messageId: Snowflake): Promise<void>;
  deleteMessage(channelId: Snowflake, messageId: Snowflake, unarchiveThread?: boolean): Promise<void>;
  dismissAutomatedMessage(props: {
    id: Snowflake;
    channel_id: Snowflake;
    loggingName?: string;
    author?: Pick<User, 'username'>
  }): void;
  editMessage(channelId: Snowflake, messageId: Snowflake, edit: Message): Promise<void>;
  /** @deprecated - this feels dangerous to use */
  endEditMessage(channelId: Snowflake, response: Response): void;
  fetchLocalMessages(channelId: Snowflake, stale?: boolean, n?: any, r?: any, i?: any): Promise<void>;
  fetchMessage(props: ChannelAndMessageIds): Promise<Message>;
  fetchMessages(props: Jump & {
    before?: string;
    after?: string;
    limit?: number;
    focus?: boolean;
    truncate?: boolean;
  }): Promise<void>;
  fetchNewLocalMessages(channelId: Snowflake, t: any): Promise<void>;
  focusMessage(props: ChannelAndMessageIds): void;
  getSendMessageOptionsForReply(options: SendOptionsForReply): SendOptions;
  jumpToMessage(props: JumpToMessageProps): void;
  jumpToPresent(e: any, limit?: number): void;
  patchmessageAttachments(channelId: Snowflake, messageId: Snowflake, attachments: Attachment[]): Promise<void>;
  // TODO: Test using ActionsEmitter.on('MESSAGE_CREATE')
  recieveMessage(channelId: Snowflake, message: Message, optimistic?: boolean, sendMessageOptions?: any): void;
  revealMessage(channelId: Snowflake, messageId: Snowflake): void;
  /** @deprecated - this feels dangerous to use */
  sendActivityBookmark(messageId: Snowflake, content: string, location: any, suggestedInvite?: any): void;
  sendBotMessage(channelId: Snowflake, content: string, useClyde: boolean | null, messageId: Snowflake): void;
  // TODO: Finder.byKeys(["TOO_MANY_THREADS"])
  sendClydeError(channelId: Snowflake, reason: string): void;
  sendExplicitMediaClydeError(channelId: Snowflake, attachments: Attachment[], messageId: Snowflake): void;
  sendGiftingPromptSystemMessage(channelId: Snowflake, giftingPrompt: any): void;
  sendGreetMessage(channelId: Snowflake, stickerId: string, n: { body: Message; }): void;
  sendInvite(messageId: Snowflake, t: any, location: any, suggestedInvite?: any): void;
  sendMessage(e: any, t?: { reaction?: boolean }, r?: any, i?: any): void;
  sendNitroSystemMessage(channelId: Snowflake, content: string, nonce: string): void;
  sendPollMessage(messageId: Snowflake, poll: any, options?: any): void;
  sendStickers(messageId: Snowflake, stickerIds: Array<string>, content?: string, options?: any, tts?: boolean): void;
  // TODO: Test using ActionsEmitter.on('MESSAGE_START_EDIT')
  startEditMessage(channelId: Snowflake, messageId: Snowflake, content: string, source: any): void;
  suppressEmbeds(channelId: Snowflake, messageId: Snowflake): Promise<void>;
  trackInvite(props: InviteTrackingProps): void;
  trackJump(channelId: Snowflake, messageId: Snowflake, context: any, options?: any): void;
  truncateMessages(channelId: Snowflake, bottom: any, top: any): void;
  // TODO: Test using ActionsEmitter.on('MESSAGE_UPDATE_EDIT')
  updateEditMessage(channelId: Snowflake, textValue: string, richValue: any): void;

  _sendMessage(messageId: Snowflake, message: Message, n: any): void;
  _tryFetchMessagesCached(props: FetchingProps): void;
}

export const MessageActions = Finder.byKeys<MessageActions>(["sendMessage"]);

type ChannelAndMessageIds = {
  channelId: Snowflake;
  messageId: Snowflake;
};

type SendOptionsForReply = {
  channel: Channel;
  message: Message;
  shouldMention?: boolean;
}

type SendOptions = {
  messageReference: {
    guild_id: Snowflake;
    channel_id: Snowflake;
    message_id: Snowflake;
  };
  allowedMentions: undefined | {
    parse: Array<any>
    replied_user: boolean
  }
}

type Jump = {
  messageId: Snowflake;
  flash?: boolean;
  offset?: number;
  returnMessageId?: any;
  jumpType?: any;
  present?: boolean;
};

type JumpToMessageProps = Jump & {
  channelId: Snowflake;
  context?: string;
  extraProperties?: any;
  isPreload?: boolean;
  skipLocalFetch?: boolean;
}

type InviteTrackingProps = {
  inviteKey: string;
  messageId: Snowflake;
  channelId: Snowflake;
  location: any;
  suggested?: any;
  overrideProperties?: any;
};

type FetchingProps = {
  channelId: Snowflake;
  before?: string;
  after?: string;
  limit?: number;
  focus?: boolean;
  truncate?: boolean;
};