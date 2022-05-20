import { Channel, Message } from "@discord";

export type MessageReturns = [props: MessageProps]
export default MessageReturns;

export type MessageProps = {
    channel: Channel,
    compact: boolean,
    forceAddreactions: undefined,
    hasSpoilerEmbeds: boolean,
    isInteracting: boolean,
    message: Message,
    onAttachmentContextMenu: (e: Event, t: any) => any,
    renderComponentAccessory: undefined,
    renderSuppressEmbeds: undefined,
    renderThreadAccessory: undefined
}