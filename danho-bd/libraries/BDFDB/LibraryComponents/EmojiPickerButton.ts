import { Emoji } from "@discord";

export type EmojiPickerButton = React.ComponentClass<{
    emoji?: Emoji;
    className?: string;
    allowManagedEmojis?: boolean;
    allowManagedEmojisUsage?: boolean;
    onSelect?: (emoji: Emoji, component: EmojiPickerButton) => void;
}>
export default EmojiPickerButton;