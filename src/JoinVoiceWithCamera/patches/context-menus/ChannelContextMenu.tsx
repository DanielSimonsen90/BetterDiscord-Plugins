import { buildTextItemElement, PatchChannelContextMenu } from "@danho-lib/ContextMenus";
import joinWithCamera from "../../utils/joinWithCamera";

export default function patchChannelContextMenu() {
  PatchChannelContextMenu((menu, props) => {
    const options = menu.props.children;
    const voiceOptions = options.find(option => (
      option.key
      && option.key.toLowerCase().includes('voice')
      && option.key.toLowerCase().includes('actions')
    ));
    if (!voiceOptions) return;

    (voiceOptions.props.children as any[]).unshift(
      buildTextItemElement(
        "join-with-camera",
        "Join with Camera",
        () => joinWithCamera(props.channel.id)
      )
    );
  })
}