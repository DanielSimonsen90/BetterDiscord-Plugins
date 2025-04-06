import { DiscordTimeFormat, Snowflake } from '@discord/types';
import { React, useEffect, useState } from '../../React';
import RoleMention from './RoleMention';
import { Timestamp } from '@discord/components';

import ChannelMention from './ChannelMention';
import EmojiMention from './EmojiMention';
import UserMention from './UserMention';

type DiscordMarkdownProps = {
  content: string;
};

export default function DiscordMarkdown({ content }: DiscordMarkdownProps) {
  const [elements, setElements] = useState([{ type: 'text', content: 'Parsing content...' }] as { type: string, content: string; }[]);

  useEffect(() => {
    const parsed = content
      .replace(/(?:\r\n|\r|\n)/g, '${br}')
      .replace(/(?:\*\*|__)(.*?)(?:\*\*|__)/g, '${strong=$1}')
      .replace(/(?:\*|_)(.*?)(?:\*|_)/g, '${em=$1}')
      .replace(/(?:\|\|)(.*?)(?:\|\|)/g, '${s=$1}')
      .replace(/(?:```)(.*?)(?:```)/g, '${code=$1}')
      .replace(/(?:`)(.*?)(?:`)/g, '${code=$1}')

      // replace <@<snowflake>> & <@!<snowflake>> with ${UserMention=<snowflake>}
      .replace(/<@!?(\d+)>/g, '${UserMention=$1}')
      // replace <#<snowflake>> with ${ChannelMention=<snowflake>}
      .replace(/<#(\d+)>/g, '${ChannelMention=$1}')
      // replace <@&<snowflake>> with ${RoleMention=<snowflake>}
      .replace(/<@&(\d+)>/g, '${RoleMention=$1}')
      // replace <:<name>:<snowflake>> with ${EmojiMention=<name>,<snowflake>}
      .replace(/<:(.*?):(\d+)>/g, '${EmojiMention=$1,$2}')
      // replace <a:<name>:<snowflake>> with ${EmojiMention=<name>,<snowflake>}
      .replace(/<a:(.*?):(\d+)>/g, '${EmojiMention=$1,$2}')
      // replace <t:<unix>:<format>> with ${TimestampMention=<unix>,<format>}
      .replace(/<t:(\d+):(\w+)>/g, '${TimestampMention=$1,$2}');

    const chars = parsed.split('');
    const elements = [];

    let current = '';
    let inTag = false;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (char === '$') {
        current += char;
        inTag = true;
      } else if (char === '{' && inTag) {
        current += char;
      } else if (char === '}' && inTag) {
        current += char;
        inTag = false;
        const [type, content] = current.slice(2, -1).split('=');
        elements.push({ type, content });
        current = '';
      } else if (inTag) {
        current += char;
      } else {
        elements.push({ type: 'text', content: char });
      }
    }

    setElements(elements);
  }, [content]);

  return (
    <span>
      {elements.map((element, i) => {
        switch (element.type) {
          case 'text': return <span key={i}>{element.content}</span>;
          case 'strong': return <strong key={i}>{element.content}</strong>;
          case 'em': return <em key={i}>{element.content}</em>;
          case 's': return <s key={i}>{element.content}</s>;
          case 'code': return <code key={i}>{element.content}</code>;

          case 'UserMention': return <UserMention key={i} id={element.content as Snowflake} />;
          case 'ChannelMention': return <ChannelMention key={i} id={element.content as Snowflake} />;
          case 'RoleMention': return <RoleMention key={i} id={element.content as Snowflake} />;
          case 'EmojiMention':
            const [name, id] = element.content.split(',');
            return <EmojiMention key={i} name={name} id={id as Snowflake} messageId='<unknown>' />;
          case 'TimestampMention':
            const [unix, format] = element.content.split(',');
            return <Timestamp key={i} unix={parseInt(unix)} format={format as DiscordTimeFormat} />;
          default: return null;
        }
      })}
    </span>
  );
}