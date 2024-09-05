export type ChannelInputType = {
  analyticsName: string | 'normal',
  attachments: boolean,
  autocomplete: {
    addReactionShortcut: boolean,
    forceChatLayer: boolean,
    reactions: boolean,
  },
  commands: {
    enabled: boolean;
  },
  drafts: {
    type: number,
    autoSave: boolean,
  },
  emojis: {
    button: boolean;
  },
  gifs: {
    button: boolean,
    allowSending: boolean;
  },
  gifts: {
    button: boolean,
  };
  permissions: {
    requireSendMessages: boolean,
  },
  sedReplace: boolean, // what
  showCharacterCount: boolean,
  showThreadPromptOnreply: boolean,
  stickers: {
    button: boolean,
    allowSending: boolean;
    autoSuggest: boolean,
  },
  submit: {
    button: boolean,
    ignorePreference: boolean,
    disableEntertoSubmit: boolean,
    clearOnsubmit: boolean,
    useDisabledStylesOnSubmit: boolean,
  },
  uploadLongMessages: boolean,
  upsellLongMessages: boolean,
};