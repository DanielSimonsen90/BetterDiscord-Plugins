import { React } from '../React';
import { SimpleMarkdown } from "@dium/modules";
import { Timestamp, Text } from "@discord/components";
import { Message } from "@discord/types/message";

type Props = {
  message: Message;
};

export function Message({ message }: Props) {
  const authorName = message.author.globalName ?? message.author.username;

  return (
    <div className="custom-message">
      <aside className="custom-message__aside">
        <img className="custom-message__avatar" src={message.author.getAvatarURL()} alt={authorName} />
      </aside>
      <section className="custom-message__main">
        <header>
          <Text variant="text-md/medium" className="custom-message__username">
            {authorName}
          </Text>
          <Text variant="text-sm/normal" className="custom-message__timestamp">
            <Timestamp unix={new Date(message.timestamp).getTime() / 1000} format="R" />
          </Text>
        </header>
        <section className="custom-message__content">
          <Text variant="text-md/normal" className="custom-message__content-text">
            <SimpleMarkdown.ReactMarkdown source={message.content} />
          </Text>
        </section>
      </section>
    </div>
  );
}