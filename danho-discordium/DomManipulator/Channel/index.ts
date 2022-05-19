export type TextAreaButtonsLeft = 'attach';
export type TextAreaButtonsRight = 'timestamp' | 'gift' | 'gif' | 'sticker' | 'emoji' | 'send';
export type ChatToolbarButtons = 'thread' | 'mute' | 'pin' | 'member-list' | 'search' | 'inbox';
export type ChannelButtons = TextAreaButtonsLeft | TextAreaButtonsRight | ChatToolbarButtons;

export { default } from './Channel';