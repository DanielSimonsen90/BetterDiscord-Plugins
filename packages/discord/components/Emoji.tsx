import { Snowflake } from "@discord/types/base";
import { React } from '@dium/modules';
import { Finder } from "@dium/api";
import { If } from "@danho-lib/Utils/types";

type EmojiNode = {
    name: string,
    emojiId: Snowflake,
    animated: boolean,
    isInteracting: boolean,
}

type Props<Node extends Pick<EmojiNode, 'name'> = Pick<EmojiNode, 'name'>> = {
    node: Node,
    tooltipPosition: "top" | "bottom" | "left" | "right",
    isInteracting: boolean,
}

export type MessageStandardEmoji = React.FunctionComponent<Props>;
export const MessageStandardEmoji: MessageStandardEmoji = Finder.byName("MessageCustomEmoji");

export type MessageCustomEmoji = React.FunctionComponent<Props<EmojiNode>>;
export const MessageCustomEmoji: MessageCustomEmoji = Finder.byName("MessageCustomEmoji");

type MessageEmojiProps<IsCustom extends boolean> = { isCustom: IsCustom } & If<IsCustom, Props<EmojiNode>, Props>;
export function MessageEmoji<IsCustom extends boolean = false>(props: MessageEmojiProps<IsCustom>) {
    return props.isCustom ? <MessageCustomEmoji {...props as Props<EmojiNode>} /> : <MessageStandardEmoji {...props as Props} />;
}
export default MessageEmoji;