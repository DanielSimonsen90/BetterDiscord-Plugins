import { Snowflake } from '@discord/types';
import { React } from '../../React';
import { GuildUtils } from '@danho-lib/Utils';

type EmojiMentionProps = {
  id: Snowflake;
  name: string;
  onClick?: (event: React.MouseEvent) => void;
}

export default function EmojiMention({ id, name, onClick }: EmojiMentionProps) {
  return (
    <span className="emoji-mention" onClick={onClick}>
      <img className='emoji-mention' src={GuildUtils.getEmojiIcon(id)} alt={name} />
    </span>
  )

}