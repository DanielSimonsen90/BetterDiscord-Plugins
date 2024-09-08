import { Timestamp } from "@discord/types/time";
import { Finder } from "@dium/api"

export type MessageTimestamp = React.FunctionComponent<{
    node: {
        format: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R',
        formatted: string,
        full: string,
        parsed: Timestamp,
        timestamp: number | string,
        type: "timestamp"
    }
}>
export const MessageTimestamp: MessageTimestamp = Finder.byName("MessageTimestamp");
export default MessageTimestamp;