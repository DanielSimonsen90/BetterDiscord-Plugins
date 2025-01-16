import { Snowflake, Emoji } from '@discord/types';
import { React } from '../../React';
import { ChannelUtils, GuildUtils } from '@danho-lib/Utils';
import Finder from '@danho-lib/dium/api/finder';
import { EmojiStore } from '@danho-lib/Stores';

type EmojiMentionProps = {
  id: Snowflake;
  messageId: Snowflake;
  name: string;
  onClick?: (event: React.MouseEvent) => void;
}

const InternalEmojiMentions = Finder.findBySourceStrings(
  "node", "enableClick", "jumbo", "emojiName:", "messageId", 
  { defaultExport: false }
) as {
  // Any Custom Emoji mention
  Y: React.FC<{ 
    channelId: Snowflake;
    enableClick?: boolean;
    isInteracting: boolean;
    messageId: Snowflake;
    node: {
      emojiId: Snowflake;
      name: string;
      animated: boolean;
      type: 'customEmoji' | (string & {});
      tooltipPosition: 'top' | 'bottom' & (string & {});
    }
   }>,
  // Default Emoji mention
  c: JSX.BD.FC<{ children: any[]; }>,
};

export default function EmojiMention({ id, name, messageId, onClick }: EmojiMentionProps) {
  const emoji = EmojiStore.getCustomEmojiById(id);

  return (
    <span className="emoji-mention" onClick={onClick}>
      {/* <img className='emoji-mention' src={GuildUtils.getEmojiIcon(id)} alt={name} /> */}
      <InternalEmojiMentions.Y 
        channelId={ChannelUtils.currentChannelId}
        enableClick={!!onClick}
        isInteracting={false}
        messageId={messageId}
        node={{
          ...emoji,
          emojiId: id,
          type: 'customEmoji',
          tooltipPosition: 'top'
        }}
      />
    </span>
  )
}