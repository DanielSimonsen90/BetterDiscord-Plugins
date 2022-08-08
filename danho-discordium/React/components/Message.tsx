import { Embed, ComponentTypes } from '@discord';
import { classNames } from '@discordium/modules';
import $ from 'danho-discordium/dquery';
import { Checkmark, CloseButton, EphemeralEye } from './Discord/Icons';
import ActionRow from './MessageComponents/ActionRow';
import { React } from '@discordium/modules';
const { useMemo, useState, createRef } = React;

type MessageAuthor = {
    displayName: string;
    avatarURL: string;
    id?: string;
    isBot?: boolean;
    isVerifiedBot?: boolean;
}
const defaultMessageAuthor: Required<MessageAuthor> = {
    displayName: "Danho Better Chat",
    id: window.BDFDB.UserUtils.me.id,
    avatarURL: window.BDFDB.UserUtils.me.getAvatarURL(),
    isBot: false,
    isVerifiedBot: true,
}

type MessageProps = React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> & {
    content?: string;
    children?: React.ReactNode;
    author?: MessageAuthor,
    suppressPing?: boolean;
    replyTo?: string;
    embeds?: Array<Embed>,
    components?: Array<ComponentTypes[number]>,
    hideEphemeralMessage?: boolean,
}

function useGenerateMessageId(el: any, snowflake: string) {
    const result = el.attr("id").split('-').reverse();
    result[0] = snowflake;
    return result.reverse().join('-');
}

export default function Message(props: MessageProps) {
    const { author, content } = props;
    const {
        suppressPing = false, hideEphemeralMessage = false,
        replyTo,
        embeds = [], components = []
    } = props;
    let { className: _className, id, children } = props;

    const msgEl = useMemo(() => $(s => s.tagName('ol').and.data("list-id", "chat-messages").tagName('li')), []);
    const messageAuthor = useMemo(() => ({ ...defaultMessageAuthor, ...author }), [author]);
    const createdAt = useMemo(() => new Date(), []);
    const className = useMemo(() => classNames(msgEl.classes, "danho-better-chat-message", _className), []);
    const snowflake = useMemo(() => Date.now().toString(), []);
    const DiscordClassModules = useMemo(() => window.BDFDB?.DiscordClassModules, []);
    const messageRepliedTo = useMemo(() => {
        if (!replyTo) return null;

        const message = $(`li#chat-messages-${replyTo}`);
        if (!message) return null;

        return {
            avatar: message.children("img", true).attr("src"),
            displayName: message.children(s => s.tagName("h2").className("username"), true).value.toString(),
            content: message.children(s => s.id(`message-content-${replyTo}`), true).element.innerHTML,
            element: message.element,
        }
    }, [replyTo]);

    const [showEmbeds, setShowEmbeds] = useState(embeds.length > 0);
    const ref = createRef<HTMLLIElement>();

    id ??= useGenerateMessageId(msgEl, snowflake);

    if (!content && !children) return null;

    return (
        <li ref={ref} id={id} className={className} aria-setsize={-1} {...props}>
            <div className={classNames(
                DiscordClassModules.Message.message,
                DiscordClassModules.Message.cozyMessage,
                !suppressPing && DiscordClassModules.Message.mentioned,
                DiscordClassModules.MessageBody.wrapper,
                DiscordClassModules.MessageBody.cozy,
                DiscordClassModules.MessageBody.zalgo,
            )} role="article" data-list-id={`chat-messages___${id}`}
                tabIndex={-1} aria-setsize={-1} aria-roledescription="Message"
                aria-labelledby={`message-username-${snowflake} uid_1 message-content-${snowflake} uid_2 message-timestamp-${snowflake}`}
                data-author-id={messageAuthor.id}
            >
                {replyTo && messageRepliedTo && (
                    <div id={`message-reply-context-${snowflake}`} className={DiscordClassModules.MessageBody.repliedMessage}
                        aria-hidden={true} aria-label={`Replying to ${messageRepliedTo.displayName}`}
                    >
                        <img className={DiscordClassModules.MessageBody.replyAvatar} alt=" " src={messageRepliedTo?.avatar} />
                        <span className={msgEl
                            .children(s => s.id("message-username-"), true)
                            .firstChild.classes
                            .split(" ").filter(name => !name.includes("clickable")).join(' ')
                        }>{messageRepliedTo.displayName}</span>
                        <div className={DiscordClassModules.MessageBody.repliedTextPreview} role="button" tabIndex={0}
                            onClick={() => messageRepliedTo.element.scrollTo({ behavior: 'smooth' })}
                        >
                            <div id={`message-content-${replyTo}`} className={classNames(
                                DiscordClassModules.MessageBody.repliedTextContent,
                                DiscordClassModules.MessageMarkup.markup,
                                DiscordClassModules.MessageBody.messageContent
                            )} dangerouslySetInnerHTML={{ __html: messageRepliedTo.content || '<span style="color: var(--status-danger)">Unable to load message!</span>' }}></div>
                        </div>
                    </div>
                )}
                <div className={msgEl.firstChild.firstChild.classes}>
                    <img src={messageAuthor.avatarURL} aria-hidden={true} className={msgEl.firstChild.firstChild.firstChild.classes} alt="" />
                    <h2 className={msgEl.firstChild.firstChild.firstChild.nextSibling.classes} aria-labelledby={`message-username-${snowflake} message-timestamp-${snowflake}`}>
                        <span id={`message-username-${snowflake}`} className={msgEl.children(s => s.id("message-username-"), true).classes}>
                            <span className={msgEl
                                .children(s => s.id("message-username-"), true)
                                .firstChild.classes
                                .split(" ").filter(name => !name.includes("clickable")).join(' ')
                            }>{messageAuthor.displayName}</span>
                            {(messageAuthor.isBot || messageAuthor.isVerifiedBot) && (
                                <span className={classNames(
                                    DiscordClassModules.MessageBody.botTagCozy,
                                    DiscordClassModules.BotTag.botTagRegular,
                                    DiscordClassModules.BotTag.rem
                                )}>
                                    {messageAuthor.isVerifiedBot && (
                                        <Checkmark tooltip='Verified Bot' />
                                    )}
                                    <span className={DiscordClassModules.BotTag.botText}>DBC Bot</span>
                                </span>
                            )}
                        </span>
                        <span className={msgEl.children(s => s.id("message-username-"), true).nextSibling.classes}>
                            <time aria-label={createdAt.toLocaleString()} id={`message-timestamp-${snowflake}`} dateTime={createdAt.toString()}>
                                {createdAt.toLocaleString()}
                            </time>
                        </span>
                    </h2>
                    <div id={`message-content-${snowflake}`} className={msgEl.firstChild.firstChild.lastChild.classes}>{children || content}</div>
                </div>
                <div id={`message-accessories-${snowflake}`} className={DiscordClassModules.MessageAccessory.container}>
                    {showEmbeds && embeds.map(embed => (
                        <article className={classNames(
                            DiscordClassModules.MessageAccessory.embedWrapper,
                            DiscordClassModules.Embed.embedFull,
                            DiscordClassModules.MessageMarkup.markup
                        )} aria-hidden={false} style={{ borderColor: embed.color }}>
                            <div className={DiscordClassModules.Embed.gridContainer}>
                                <div className={DiscordClassModules.Embed.grid}>
                                    <div className={DiscordClassModules.Embed.embedSuppressButton} aria-label="Remove all embeds" role="button" tabIndex={0}
                                        onClick={() => setShowEmbeds(false)}
                                    >
                                        <CloseButton />
                                    </div>
                                    <div className={classNames(
                                        DiscordClassModules.Embed.embedTitle,
                                        embed.url && DiscordClassModules.Embed.embedTitleLink,
                                        DiscordClassModules.Embed.embedMargin
                                    )}>
                                        {embed.rawTitle}
                                    </div>
                                    {embed.fields.length && (
                                        <div className={DiscordClassModules.Embed.embedFields}>
                                            {embed.fields.map((field, i) => (
                                                <div className={DiscordClassModules.Embed.embedField} key={i} style={{
                                                    gridColumn: "1 / 13" // Reflects on field.inline - max inline is 3?
                                                }}>
                                                    <div className={DiscordClassModules.Embed.embedFieldName}>{field.rawTitle}</div>
                                                    <div className={DiscordClassModules.Embed.embedFieldValue}>{field.rawValue}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {embed.footer && (
                                        <div className={classNames(
                                            DiscordClassModules.Embed.embedFooter,
                                            DiscordClassModules.Embed.embedMargin,
                                        )}>
                                            {embed.footer.iconURL && (
                                                <img src={embed.footer.iconURL} alt="" className={DiscordClassModules.Embed.embedFooterIcon} />
                                            )}
                                            <div className={DiscordClassModules.Embed.embedFooterText}>{embed.footer.text}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                    {components.length > 0 && (
                        <div className="container-3Sqbyb">
                            <ActionRow components={components} />
                        </div>
                    )}
                    {(!hideEphemeralMessage && <div className={DiscordClassModules.MessageLocalBot.ephemeralMessage}>
                        <EphemeralEye />
                        Only you can see this •
                        <a className={classNames(
                            DiscordClassModules.Anchor.anchor,
                            DiscordClassModules.Anchor.anchorUnderlineOnHover,
                        )} role="button" tabIndex={0} onClick={() => ref.current.parentElement.remove()}
                        > Dismiss message</a>
                    </div>)}
                </div>
                <div className={msgEl.firstChild.lastChild.classes}></div>
            </div>
        </li>
    )
}