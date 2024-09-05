import type { Emoji } from "../guild/emoji";

export type MessageReaction = {
  count: number,
  emoji: Emoji,
  me: boolean,
};