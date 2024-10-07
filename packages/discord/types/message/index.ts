import type { Snowflake } from "../base";
import type { User } from "../user";
import type { MessageFlags } from "./flags";
import type { MessageState } from "./state";
import type { MessageType } from "./type";

export type Message = {
  type: MessageType;
  author: User;
  content: string;

  // timestamp: import("moment").Moment;
  timestamp: string;
  editedTimestamp?: any;
  state: MessageState;

  /** Message ID of parent. */
  nonce?: Snowflake;

  flags: MessageFlags;
  attachments: any[];
  codedLinks: any[];
  components: any[];
  embeds: any[];
  giftCodes: any[];
  mentionChannels: any[];
  mentionEveryone: boolean;
  mentionRoles: any[];
  mentioned: boolean;
  mentions: any[];
  messageReference?: any;
  reactions: any[];
  stickerItems: any[];
  stickers: any[];

  activity?: any;
  application?: any;
  applicationId?: any;
  blocked: boolean;
  bot: boolean;
  call?: any;
  colorString?: any;
  customRenderedContent?: any;
  id: Snowflake;
  interaction?: any;
  interactionData?: any;
  interactionError?: any;
  isSearchHit: boolean;
  loggingName?: any;
  nick?: any;
  pinned: boolean;
  tts: boolean;
  webhookId?: any;

  addReaction(arg1: any, arg2: any): void;
  getChannelId(): Snowflake;
  getReaction(arg: any): any;
  hasFlag(flag: MessageFlags): boolean;
  isCommandType(): boolean;
  isEdited(): boolean;
  isSystemDM(): boolean;
  removeReaction(arg1: any, arg2: any): void;
  removeReactionsForEmoji(arg: any): void;
  toJS(): any;
};