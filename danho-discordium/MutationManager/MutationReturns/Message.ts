import { Channel, Message } from "danho-bd/discord";

export type MessageReturns = [props: {
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
}]
export default MessageReturns;