import { EmojiStore, getEmojiUrl } from "@danho-lib/Stores";
import { React } from "@dium/modules";

type BannedEmojiTagProps = {
  store: EmojiStore;
  emojiId: string;
  onClick?: () => void;
};

export default function BannedEmojiTag({ store, emojiId, onClick }: BannedEmojiTagProps) {
  const emoji = store.getDisambiguatedEmojiContext().getById(emojiId);
  return (
    <li id={`banned-emoji__${emoji.id}`} className="banned-emoji-tag" onClick={onClick}>
      <img className="emoji jumboable" src={getEmojiUrl(emoji)} alt={emoji.name} />
    </li>
  );
}