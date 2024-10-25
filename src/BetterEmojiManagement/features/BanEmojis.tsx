import { MenuItem, MenuSeparator } from "@dium/components";
import { React } from "@dium/modules";

import { CustomEmoji, Emoji, EmojiStore } from "@stores";
import createPatcherCallback, { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import { ExpressionPickerContextMenuFiber, ExpressionPickerContextMenuTargetProps } from "@danho-lib/ContextMenus/ExpressionPickerItemOptions";
import { ExpressionPickerMenu } from "@danho-lib/Modals/ExpressionPicker";
import { $ } from "@danho-lib/DOM";

import Bin from "@components/Icons/Bin";

import { Settings } from "../Settings";

const KNOWN_EXPRESSION_PICKER_CONTEXTMENU_ITEMS_COUNT = 2;

export const isBanFeatureEnabled = () => Settings.current.enableBannedEmojis;
export const sortBannedEmojisToEnd = function <TEmoji extends Emoji>(emojis: TEmoji[]) {
  const banned = Settings.current.bannedEmojis.map(e => e.id);

  return emojis.sort((a, b) => {
    const aIsBanned = banned.includes(a.id);
    const bIsBanned = banned.includes(b.id);
    return (
      aIsBanned && !bIsBanned ? 1
        : !aIsBanned && bIsBanned ? -1
          : 0
    );
  });
};

export const sortBannedEmojisOnSearch = createPatcherCallback<EmojiStore['getSearchResultsOrder'], Emoji[]>(({ args, original: __getStoreSearchResults }) => {
  const emojis = __getStoreSearchResults(...args);
  return sortBannedEmojisToEnd(emojis);
});

export const addBannedTagToEmoji = createPatcherAfterCallback<ExpressionPickerMenu[string]>(({ result }) => {
  const bannedEmojis = Settings.current.bannedEmojis.map(e => e.id);
  result.props.children = result.props.children.map((row) => {
    if (!row.props.descriptor) return row;
    const emojiId = row.props.descriptor.emoji.id;
    const isBanned = bannedEmojis.includes(emojiId);

    return !isBanned ? row : {
      ...row,
      props: {
        ...row.props,
        ['data-banned-emoji']: true
      }
    };
  });
});

export const addBannedDataTagToEmojiElement = createPatcherAfterCallback<ExpressionPickerMenu[string]>(({ result }) => {
  result.props.children.forEach(row => {
    if (!('data-banned-emoji' in row.props)) return;

    const emojiId = row.props.descriptor.emoji.id;
    if (!emojiId) return;
    $(`[data-id="${emojiId}"]`)?.attr('data-banned-emoji', 'true');
  });
});

export const renderBanEmojiMenuItem = function (menu: ExpressionPickerContextMenuFiber, props: ExpressionPickerContextMenuTargetProps) {
  const attributes = [...props.target.attributes];
  const name = attributes.find(a => a.name === "data-name")?.value;
  const id = attributes.find(a => a.name === "data-id")?.value ?? `default_${name}`;

  const isBanned = Settings.current.bannedEmojis.some(e => e.id === id);

  menu.props.children.props.children.splice(KNOWN_EXPRESSION_PICKER_CONTEXTMENU_ITEMS_COUNT, 2, (<>
    <MenuSeparator />
    <MenuItem id={`emoji-ban_${id}`}
      label={isBanned ? "Unban Emoji" : "Ban Emoji"}
      action={() => {
        Settings.update({
          bannedEmojis: isBanned
            ? Settings.current.bannedEmojis.filter(e => e.id !== id)
            : [...Settings.current.bannedEmojis, { id, name }]
        });

        $(`[data-id="${id}"]`).attr<true, true>('data-banned-emoji', isBanned ? undefined : 'true', true).forceUpdate();
      }}
      color={isBanned ? undefined : "danger"}
      icon={isBanned ? undefined : Bin}
    />
  </>));

  // return menu;
};

export const replaceEmojiStore_getDisambiguatedEmojiContext = createPatcherCallback<EmojiStore['getDisambiguatedEmojiContext'], any>(({ args, original: getDisambiguatedEmojiContext }) => {
  const result = getDisambiguatedEmojiContext(...args);

  return {
    _original: result,

    getFrequentlyUsedReactionEmojisWithoutFetchingLatest: function () { return sortBannedEmojisToEnd(result.getFrequentlyUsedReactionEmojisWithoutFetchingLatest()); },
    getFrequentlyUsedEmojisWithoutFetchingLatest: function () { return sortBannedEmojisToEnd(result.getFrequentlyUsedEmojisWithoutFetchingLatest()); },
    get favoriteEmojisWithoutFetchingLatest() { return sortBannedEmojisToEnd(result.favoriteEmojisWithoutFetchingLatest); },
    getGroupedCustomEmoji: function () {
      const groupedCustomEmojis = result.getGroupedCustomEmoji();
      return Object.keys(groupedCustomEmojis).reduce((acc, guildId) => {
        acc[guildId] = sortBannedEmojisToEnd(groupedCustomEmojis[guildId]);
        return acc;
      }, {} as Record<string, CustomEmoji[]>);
    },

    getCustomEmoji: function () { return result.getCustomEmoji(); },
    isFavoriteEmojiWithoutFetchingLatest: function (emojiId: string) { return result.isFavoriteEmojiWithoutFetchingLatest(emojiId); },
    getById: function (emojiId: string) { return result.getById(emojiId); },
    getEscapedCustomEmoticonNames: function () { return result.getEscapedCustomEmoticonNames(); },
    getCustomEmoticonRegex: function () { return result.getCustomEmoticonRegex(); },
    getEmojiInPriorityOrderWithoutFetchingLatest: function () { return sortBannedEmojisToEnd(result.getEmojiInPriorityOrderWithoutFetchingLatest()); },
    getByName(name: string) { return result.getByName(name); },
  } as any;
});