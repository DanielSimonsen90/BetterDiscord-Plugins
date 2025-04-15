import React from "@react";
import { EmojiStore, getEmojiUrl } from "@discord/stores";

type BannedEmojiTagProps = {
  emojiId: string;
  onClick?: () => void;
};

export function BannedEmojiTag({ emojiId, onClick }: BannedEmojiTagProps) {
  const emoji = EmojiStore.getDisambiguatedEmojiContext().getById(emojiId);
  
  return (
    <li id={`banned-emoji__${emoji.id}`} className="banned-emoji-tag" onClick={onClick}>
      <img className="emoji jumboable" src={getEmojiUrl(emoji)} alt={emoji.name} />
    </li>
  );
}